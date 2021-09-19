import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { UserProfile } from "../entity/UserProfile";

export async function userprofileCreateAction(request: Request, response: Response) {
  // request validation 
  const schema = Joi.object({
      username: Joi.string().required(),
      imageurl: Joi.string(),
      bio: Joi.string(),
  })
  const { value, error } = schema.validate(request.body)
  if(error != null) {
      response.status(400).send(error)
      return
  }
  const { username, imageurl, bio } = value

  // TODO: verify if same username does not exist already

  // creating new entry
  const userProfile = new UserProfile()
  userProfile.username = username
  userProfile.bio = bio || null
  userProfile.imageurl = imageurl || null

  try {
    response.status(200).send(await getManager().getRepository(UserProfile).save(userProfile))      
  } catch (error) {
    response.status(500).send(error)
  }
}
