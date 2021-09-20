import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { Curation } from "../entity/Curation";

export async function curationPutUpdateAction(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    verified_user_id: Joi.string().uuid().required(),
    curation_id: Joi.string().uuid().required(),
    title: Joi.string(),
    description: Joi.string(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { verified_user_id, curation_id, title, description } = value;

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

  if (curation.created_by.id != verified_user_id) {
    response.status(403).send({
      message: "Curation can only be modified by owner",
    });
  }

  // update values
  curation.title = title || curation.title;
  curation.description = description || curation.description;

  try {
    var updatedCuration = await getManager()
      .getRepository(Curation)
      .save(curation);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const responseObject = {
    message: "Curation updated successfully",
    id: updatedCuration.id,
    title: updatedCuration.title,
    description: updatedCuration.description,
  };

  response.status(200).send(responseObject);
}
