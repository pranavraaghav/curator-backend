import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { User } from "../entity/User";
import { Curation } from "../entity/Curation";

export async function curationPostCreateAction(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    user_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { user_id, title, description } = value;

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

  try {
    response
      .status(200)
      .send(await getManager().getRepository(Curation).save(curation));
  } catch (error) {
    response.status(500).send(error);
  }
}
