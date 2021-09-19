import { Router } from "express";
import { userPostCreateAction } from "../controller/userPostCreateAction";

export const router = Router();

router.post("/", (request, response) => {
  userPostCreateAction(request, response);
});
