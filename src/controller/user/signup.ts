import { Request, Response } from "express";
import { getManager } from "typeorm";
import Joi from "joi";
import * as dotenv from "dotenv";
import { User } from "../../entity/User";
import * as jwt from "jsonwebtoken";

dotenv.config();

// TODO: Implement password and password hashing

export async function userSignup(
  request: Request,
  response: Response
) {
  // request validation
  const { value, error } = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(request.body);
  if (error != null) {
    response.status(400).send(error);
    return;
  }

  const { email, username, password } = value;

  try {
    const userWithSameUsername = await getManager()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.username = :username", { username: username })
      .getOne();
    if (userWithSameUsername) {
      response.status(403).send({
        message: "username taken",
      });
      return;
    }
  } catch (error) {
    response.status(500).json({ error: error });
    return;
  }

  // creating new entry
  const user = new User();
  user.username = username;
  user.email = email;
  user.password = password;

  try {
    var createdUser = await getManager().getRepository(User).save(user);
  } catch (error) {
    response.status(500).send(error);
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

  const token = jwt.sign({ id: createdUser.id }, secret, { expiresIn: "30d" });

  response.status(201).send({
    message: "User created successfully",
    jwt: token,
    token_type: "Bearer",
  });
}
