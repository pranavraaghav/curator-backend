import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { UserProfile } from "../entity/UserProfile";
import { Curation } from "../entity/Curation";

export async function userprofileCreateActionTemp(request: Request, response: Response) {
  // request validation 
  const schema = Joi.object({
      user_profile_id: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string(),
  })
  const { value, error } = schema.validate(request.body)
  if(error != null) {
      response.status(400).send(error)
      return
  }
  const { dsf, title, description } = value

  // creating new entry
  const curation = new Curation()
  curation.created_by = new UserProfile()
  curation.title = title
  curation.description = description || null

  try {
    response.status(200).send(await getManager().getRepository(Curation).save(curation))      
  } catch (error) {
    response.status(500).send(error)
  }
}
