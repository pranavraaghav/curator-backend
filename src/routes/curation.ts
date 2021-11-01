import { Router } from "express";
import { verifyToken } from "../middleware/jwt";
import { curationDeleteAction } from "../controller/curationDeleteAction";
import { curationPostCreateAction } from "../controller/curationPostCreateAction";
import { curationPutUpdateAction } from "../controller/curationPutUpdateAction";
import { curationGetAction } from "../controller/curationGetAction";
import { curationLikeAction } from "../controller/curationLikeAction";
import { curationUnlikeAction } from "../controller/curationUnlikeAction";

export const router = Router();

router.get("/", curationGetAction);
router.post("/", verifyToken, curationPostCreateAction);
router.put("/", verifyToken, curationPutUpdateAction);
router.delete("/", verifyToken, curationDeleteAction);

router.post("/like", verifyToken, curationLikeAction);
router.post("/unlike", verifyToken, curationUnlikeAction);
