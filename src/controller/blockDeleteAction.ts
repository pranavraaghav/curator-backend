import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { Block } from "../entity/Block";

export async function blockDeleteAction(request: Request, response: Response) {
  // request validation
  const { value, error } = Joi.object({
    verified_user_id: Joi.string().uuid().required(),
    block_id: Joi.string().uuid().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { verified_user_id, block_id } = value;

  try {
    var block = await getManager()
      .getRepository(Block)
      .createQueryBuilder("block")
      .leftJoinAndSelect("block.curation", "curation")
      .leftJoinAndSelect("curation.created_by", "created_by")
      .where("block.id = :block_id", { block_id: block_id })
      .getOne();
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  if (!block) {
    response.status(404).send({
      message: "Block does not exist, check provided id",
    });
    return;
  }

  if (block.curation.created_by.id != verified_user_id) {
    response.status(403).send({
      message: "Block can only be deleted by owner",
    });
  }

  try {
    var deletedBlock = await getManager().getRepository(Block).remove(block);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const responseObject = {
    message: "Block deleted successfully",
    id: deletedBlock.id,
    title: deletedBlock.title,
    description: deletedBlock.description,
  };

  response.status(200).send(responseObject);
}
