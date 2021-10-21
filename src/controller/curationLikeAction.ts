import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import Joi from "joi";
import { User } from "../entity/User";
import { Curation } from "../entity/Curation";
import { Like } from "../entity/Like";

export async function curationLikeAction(request: Request, response: Response) {
  // request validation
  const { value, error } = Joi.object({
    user_id: Joi.string().uuid().required(),
    curation_id: Joi.string().uuid().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { user_id, curation_id } = value;

  // Checking for pre-existing like
  try {
    const existingLike = await getConnection()
      .getRepository(Like)
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.curation", "curation")
      .leftJoinAndSelect("like.user", "user")
      .where("user.id = :user_id", { user_id: user_id })
      .andWhere("curation.id = :curation_id", {
        curation_id: curation_id,
      })
      .getOne();
    if (existingLike) {
      response.status(400).json({
        message: "You cannot like the same curation twice",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  try {
    var user = await getManager().getRepository(User).findOne(user_id);
    if (!user) {
      response.status(404).json({
        message: "Invalid user id",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  try {
    var curation = await getManager()
      .getRepository(Curation)
      .findOne(curation_id);
    if (!curation) {
      response.status(404).json({
        message: "Invalid curation id",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const like = new Like();
  curation.like_count += 1;
  like.user = user;
  like.curation = curation;

  try {
    await getManager().getRepository(Like).save(like);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  response.status(201).send({
    message: "success",
  });
}
