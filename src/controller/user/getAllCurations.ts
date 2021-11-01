import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { Curation } from "../../entity/Curation";

export async function userGetAllCurations(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    user_id: Joi.string().uuid().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { user_id } = value;

  try {
    var curations = await getManager()
      .getRepository(Curation)
      .createQueryBuilder("curation")
      .leftJoin("curation.created_by", "user")
      .select([
        "curation.id",
        "curation.created_at",
        "curation.title",
        "curation.description",
        "curation.like_count"
      ])
      .where("user.id = :user_id", { user_id: user_id })
      .getMany();
    if (!curations) {
      response.status(400).json({
        message: "Invalid curation id",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  response.status(201).send(curations);
}
