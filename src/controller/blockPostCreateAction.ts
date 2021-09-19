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
    curation_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    text: Joi.string(),
    url: Joi.string(),
  }).validate(request.body);

  if (error != null) {
    response.status(400).send(error);
    return;
  }
  const { curation_id, title, text, url } = value;

  try {
    // TODO: Do a left join to get user deets and validate with jwt
    var curation = await getManager()
      .getRepository(Curation)
      .findOne(curation_id);
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

  // creating new entry
  const block = new Block();
  block.curation = curation;
  block.title = title;
  block.text = text || null;
  block.url = url || null;

  try {
    response.send(await getManager().getRepository(Block).save(block));
  } catch (error) {
    response.status(500).send(error);
  }
}
