import { Router } from "express";
import { blockPostCreateAction } from "../controller/blockPostCreateAction";

export const router = Router();

router.post("/", (request, response) => {
  blockPostCreateAction(request, response);
});
