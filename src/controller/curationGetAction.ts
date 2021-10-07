import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { User } from "../entity/User";
import { Curation } from "../entity/Curation";

export async function curationGetAction(request: Request, response: Response) {
  // request validation
  const { value, error } = Joi.object({
    curation_id: Joi.string().uuid().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { curation_id } = value;

  try {
    var curation = await getManager()
      .getRepository(Curation)
      .createQueryBuilder("curation")
      .leftJoinAndSelect("curation.blocks", "blocks")
      .where("curation.id = :curation_id", { curation_id: curation_id })
      .getOne();
    if (!curation) {
      response.status(400).json({
        message: "Invalid curation id",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  response.status(201).send(curation);
}
