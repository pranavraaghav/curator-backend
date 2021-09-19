import { Router } from "express";
import { curationPostCreateAction } from "../controller/curationPostCreateAction";
import { verifyToken } from "../middleware/jwt";

export const router = Router();

router.post("/", verifyToken, (request, response) => {
  curationPostCreateAction(request, response);
});
