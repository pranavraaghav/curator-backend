import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import Joi from "joi";
import { Curation } from "../entity/Curation";
import { Block } from "../entity/Block";

export async function blockPostBulkCreateAction(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    verified_user_id: Joi.string().uuid().required(),
    curation_id: Joi.string().uuid().required(),
    blocks: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string(),
        url: Joi.string(),
      })
    ),
  }).validate(request.body);

  if (error != null) {
    response.status(400).send(error);
    return;
  }
  const { verified_user_id, curation_id, blocks } = value;

  try {
    var curation = await getManager()
      .getRepository(Curation)
      .createQueryBuilder("curation")
      .leftJoinAndSelect("curation.created_by", "created_by")
      .where("curation.id = :curation_id", { curation_id: curation_id })
      .getOne();
    if (!curation || typeof curation == "undefined") {
      response.status(400).json({
        message: "Invalid curation id",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  // Validate user
  if (curation.created_by.id != verified_user_id) {
    response.status(400).json({
      message: "Only creator of curation can add blocks",
    });
    return;
  }

  // add curation reference to all blocks
  for (const block of blocks) {
    block.curation = curation;
  }

  try {
    var bulkBlockCreationReturn = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Block)
      .values(blocks)
      .execute();
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const idObjectList = bulkBlockCreationReturn.identifiers;

  response.status(201).send(idObjectList);
}
