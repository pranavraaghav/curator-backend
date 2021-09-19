import { Router } from "express";
import { curationPostCreateAction } from "../controller/curationPostCreateAction";

export const router = Router();

router.post("/", (request, response) => {
  curationPostCreateAction(request, response);
});
