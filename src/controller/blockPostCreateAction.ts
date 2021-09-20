import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { Curation } from "../entity/Curation";
import { Block } from "../entity/Block";

export async function blockPostCreateAction(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    verified_user_id: Joi.string().uuid().required(),
    curation_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    url: Joi.string(),
  }).validate(request.body);

  if (error != null) {
    response.status(400).send(error);
    return;
  }
  const { verified_user_id, curation_id, title, description, url } = value;

  try {
    // TODO: Do a left join to get user deets and validate with jwt
    var curation = await getManager()
      .getRepository(Curation)
      .createQueryBuilder("curation")
      .leftJoinAndSelect("curation.created_by", "created_by")
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

  // Validate correct user
  if (curation.created_by.id != verified_user_id) {
    response.status(400).json({
      message: "Only creator of curation can add blocks",
    });
    return;
  }
  // creating new entry
  const block = new Block();
  block.curation = curation;
  block.title = title;
  block.description = description || null;
  block.url = url || null;

  try {
    var createdBlock = await getManager().getRepository(Block).save(block);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const responseObject = {
    message: "success",
    id: createdBlock.id,
    title: createdBlock.title,
    description: createdBlock.description,
    url: createdBlock.url,
    curation_id: createdBlock.curation.id,
  };

  response.status(201).send(responseObject);
}
