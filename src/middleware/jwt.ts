import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";

dotenv.config();

export const verifyToken = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const tokenHeader = request.header("Authorization"); // using Authorization === bearer token
  if (!tokenHeader) {
    response.status(400).send({
      message: "Access denied, secure routes require jwt authorization",
    });
    return;
  }

  try {
    const token = tokenHeader.split(" ")[1];
    const secret: string = process.env.SECRET!;
    try {
      var payload = jwt.verify(token, secret);
      /**
       * above statement returns type "string | jwt.JwtPayload"
       * if payload is string, payload.id is invalid
       * so we need to assure TypeScript that it is not a string
       */
      if (typeof payload == "string") {
        throw new Error("Payload from jwt is string");
      }
    } catch (error) {
      response.status(500).json(error);
      return;
    }

    /**
     * if the verifyToken middleware is used in a route
     * the request.body in the next function (after middleware)
     * will contain a key "user_id" which contains
     * the id of User which was extracted from jwt
     */
    request.body.user_id = payload.id;
    next();
  } catch (error) {
    response.status(500).send({
      message: "Token is invalid",
    });
  }
};
