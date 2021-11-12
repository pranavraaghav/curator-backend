import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi, { string } from "joi";
import { Curation } from "../../entity/Curation";
import { Block } from "../../entity/Block";

export async function curationUpdate(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    user_id: Joi.string().uuid().required(),
    curation_id: Joi.string().uuid().required(),
    title: Joi.string(),
    description: Joi.string().allow(""),
    blocks: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(""),
        url: Joi.string(),
      })
    ),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }
  const { user_id, curation_id, title, description, blocks } = value;

  // Fetch Curation
  try {
    var curation = await getManager()
      .getRepository(Curation)
      .createQueryBuilder("curation")
      .leftJoinAndSelect("curation.created_by", "created_by")
      .leftJoinAndSelect("curation.blocks", "blocks")
      .where("curation.id = :curation_id", { curation_id: curation_id })
      .getOne();

    if (!curation) {
      response.status(404).send({
        message: "Curation does not exist, check provided id",
      });
      return;
    }

    if (curation.created_by.id != user_id) {
      response.status(403).send({
        message: "Curation can only be modified by owner",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  // Update Values
  curation.title = title || curation.title;
  curation.description = description || curation.description;

  if (blocks) {
    // Prepping new blocks
    let createdBlocks: Block[] = [];
    blocks.forEach((item: Block, i: number) => {
      const { title, description, url } = item;

      const block = new Block();
      block.title = title;
      block.description = description;
      block.url = url;
      block.index = i;

      createdBlocks.push(block);
    });

    // Deleting old blocks
    if (curation.blocks.length > 0) {
      const blockIdsToDelete: string[] = [];
      curation.blocks.forEach((item) => {
        blockIdsToDelete.push(item.id);
      });
      try {
        await getManager()
          .getRepository(Block)
          .createQueryBuilder()
          .delete()
          .from(Block)
          .where("Block.id IN (:...ids)", { ids: blockIdsToDelete })
          .execute();
      } catch (error) {
        response.status(500).send(error);
        return;
      }
    }

    // Add new blocks to curation
    curation.blocks = createdBlocks;
  }

  // Push changes to DB
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
