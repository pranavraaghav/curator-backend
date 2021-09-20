import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";

export async function userPostLoginAction(
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
  if ((await user.validatePassword(password)) === false) {
    response.status(400).send({
      message: "Incorrect password",
    });
    return;
  }

  // jwt
  try {
    var secret: string = process.env.SECRET! || "secret";
  } catch (error) {
    response.status(500).send(error);
    console.log("Secret provided in .env was not a string");
    return;
  }

  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "30d" });

  response.status(200).send({
    message: "Validation successfull",
    jwt: token,
    token_type: "Bearer",
  });
}
