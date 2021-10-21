import { Router } from "express";
import { verifyToken } from "../middleware/jwt";
import { curationDeleteAction } from "../controller/curationDeleteAction";
import { curationPostCreateAction } from "../controller/curationPostCreateAction";
import { curationPutUpdateAction } from "../controller/curationPutUpdateAction";
import { curationGetAction } from "../controller/curationGetAction";
import { curationLikeAction } from "../controller/curationLikeAction";
import { curationUnlikeAction } from "../controller/curationUnlikeAction";

export const router = Router();

router.get("/", (request, response) => {
  curationGetAction(request, response);
});

router.post("/", verifyToken, (request, response) => {
  curationPostCreateAction(request, response);
});

router.put("/", verifyToken, (request, response) => {
  curationPutUpdateAction(request, response);
});

router.delete("/", verifyToken, (request, response) => {
  curationDeleteAction(request, response);
});

router.post("/like", verifyToken, (request, response) => {
  curationLikeAction(request, response);
});

router.post("/unlike", verifyToken, (request, response) => {
  curationUnlikeAction(request, response);
});
