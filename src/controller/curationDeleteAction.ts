import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { Curation } from "../entity/Curation";

export async function curationDeleteAction(
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
    var curation = await getManager()
      .getRepository(Curation)
      .createQueryBuilder("curation")
      .leftJoinAndSelect("curation.created_by", "created_by")
      .where("curation.id = :curation_id", { curation_id: curation_id })
      .getOne();
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  if (!curation) {
    response.status(404).send({
      message: "Curation does not exist, check provided id",
    });
    return;
  }

  if (curation.created_by.id != user_id) {
    response.status(403).send({
      message: "Curation can only be deleted by owner",
    });
  }

  try {
    var deletedCuration = await getManager()
      .getRepository(Curation)
      .remove(curation);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const responseObject = {
    message: "Curation deleted successfully",
    id: deletedCuration.id,
    title: deletedCuration.title,
    description: deletedCuration.description,
  };

  response.status(200).send(responseObject);
}
