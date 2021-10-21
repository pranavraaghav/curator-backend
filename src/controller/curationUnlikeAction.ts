import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import Joi from "joi";
import { Like } from "../entity/Like";
import { Curation } from "../entity/Curation";

export async function curationUnlikeAction(
  request: Request,
  response: Response
) {
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

  try {
    var like = await getConnection()
      .getRepository(Like)
      .createQueryBuilder("like")
      .leftJoinAndSelect("like.curation", "curation")
      .leftJoinAndSelect("like.user", "user")
      .where("user.id = :user_id", { user_id: user_id })
      .andWhere("curation.id = :curation_id", {
        curation_id: curation_id,
      })
      .getOne();
    if (!like) {
      response.status(404).json({
        message: "This curation was not liked by the user previously",
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

  curation.like_count -= 1;

  try {
    await getManager().getRepository(Curation).save(curation);
    await getManager().getRepository(Like).remove(like);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  response.status(201).send({
    message: "success",
  });
}
