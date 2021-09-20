import { Router } from "express";
import { blockDeleteAction } from "../controller/blockDeleteAction";
import { blockPostCreateAction } from "../controller/blockPostCreateAction";
import { blockPutUpdateAction } from "../controller/blockPutUpdateAction";
import { verifyToken } from "../middleware/jwt";

export const router = Router();

router.post("/", verifyToken, (request, response) => {
  blockPostCreateAction(request, response);
});

router.put("/", verifyToken, (request, response) => {
  blockPutUpdateAction(request, response);
});

router.delete("/", verifyToken, (request, response) => {
  blockDeleteAction(request, response);
});
