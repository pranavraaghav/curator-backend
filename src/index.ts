import express from "express";
import { Request, Response } from "express";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import { AppRoutes } from "./routes";

dotenv.config();
const PORT = process.env.PORT || 8080;

createConnection()
  .then(async (connection) => {
    const app = express();

    app.use(express.json());

    // register all routes
    AppRoutes.forEach((route) => {
      app[route.method](
        "/api" + route.path,
        (request: Request, response: Response, next: Function) => {
          route
            .action(request, response)
            .then(() => next)
            .catch((err: any) => next(err));
        }
      );
    });

    // run app
    app.listen(PORT);

    console.log(`Application running on port ${PORT}`);
  })
  .catch((err) => console.log("TypeORM connection error: ", err));
