import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import Joi from "joi";
import { Curation } from "../entity/Curation";
import { Block } from "../entity/Block";

export async function blockReorderAction(request: Request, response: Response) {
  // request validation
  const { value, error } = Joi.object({
    verified_user_id: Joi.string().uuid().required(),
    curation_id: Joi.string().uuid().required(),
    blocks: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().uuid().required(),
        index: Joi.number().required(),
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

  var responseObject: any;

  for (const block of blocks) {
    const { id, index } = block;
    // Verify if block belongs to curation
    try {
      const block = await getManager()
        .getRepository(Block)
        .createQueryBuilder("block")
        .leftJoinAndSelect("block.curation", "curation")
        .where("block.id = :block_id", { block_id: id })
        .getOne();
      if (typeof block == "undefined") {
        throw new Error("Block is undefined, honestly no clue whats happening");
      }
      if (block.curation.id != curation.id) {
        response.status(403).send({
          message: "YOU DO NOT OWN THIS BLOCK",
        });
      }
    } catch (error) {
      response.status(500).send(error);
    }
    try {
      responseObject = await getConnection()
        .createQueryBuilder()
        .update(Block)
        .set({
          index: index,
        })
        .where({ id: id })
        .execute();
    } catch (error) {
      response.status(500).send(error);
      return;
    }
  }

  response.status(201).send(responseObject);
}
