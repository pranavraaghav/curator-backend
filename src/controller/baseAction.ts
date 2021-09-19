import { Request, Response } from "express";

export async function baseAction(request: Request, response: Response) {
  response.status(200).send({
    messsage: "Route works!",
  });
}
