import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import { User } from "../entity/User";

export async function userPostLogin(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { username, password } = value;

  try {
    var user = await getManager()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: username })
      .getOne();
    if (!user) {
      response.status(404).send({
        message: "username does not exist",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // validate
  if(await user.validatePassword(password) === false) {
    response.status(400).send({
        message: "Incorrect password"
    });
    return
  }

  response.status(200).send({
      message: "Validation successfull"
      // TODO: JWT stuff
  })
}
