import express from "express";
import * as dotenv from "dotenv";
import { createConnection } from "typeorm";
import { router } from "./routes/index";

dotenv.config();
const PORT = process.env.PORT || 8080;

createConnection()
  .then(async (connection) => {
    const app = express();

    app.use(express.json());

    app.use("/api", router);

    app.listen(PORT);

    console.log(`Application running on port ${PORT}`);
  })
  .catch((err) => console.log("TypeORM connection error: ", err));
