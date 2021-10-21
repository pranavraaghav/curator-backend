import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import { router } from "./routes/index";

import * as swaggerUI from "swagger-ui-express";
import * as YAML from "yamljs";
const SWAGGER_DOC = YAML.load(__dirname + "/../swagger.yml");

dotenv.config();
const PORT = process.env.PORT || 8080;

createConnection()
  .then(async (connection) => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use("/api", router);

    app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(SWAGGER_DOC));

    app.listen(PORT);

    console.log(`Application running on port ${PORT}`);
  })
  .catch((err) => console.log("TypeORM connection error: ", err));
