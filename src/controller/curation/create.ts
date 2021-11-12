import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { User } from "../../entity/User";
import { Curation } from "../../entity/Curation";
import { Block } from "../../entity/Block";

export async function curationCreate(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    user_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
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

  const { user_id, title, description, blocks } = value;

  try {
    var user = await getManager().getRepository(User).findOne(user_id);
    if (!user) {
      response.status(400).json({
        message: "Invalid user id",
      });
      return;
    }
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const curation = new Curation();
  curation.created_by = user;
  curation.title = title;
  curation.description = description || null;

  if (blocks) {
    let createdBlocks: Block[] = [];
    // Index all blocks
    blocks.forEach((item: Block, i: number) => {
      const { title, description, url } = item;

      const block = new Block();
      block.title = title;
      block.description = description;
      block.url = url;
      block.index = i;

      createdBlocks.push(block);
    });
    curation.blocks = createdBlocks;
  }

  try {
    var createdCuration = await getManager()
      .getRepository(Curation)
      .save(curation);
  } catch (error) {
    response.status(500).send(error);
    return;
  }

  const responseObject = {
    message: "Curation Created Successfully",
    id: createdCuration.id,
    title: createdCuration.title,
    description: createdCuration.description,
  };

  response.status(201).send(responseObject);
}
