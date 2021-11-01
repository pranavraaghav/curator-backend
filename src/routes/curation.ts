import { Router } from "express";
import { verifyToken } from "../middleware/jwt";
import { curationDelete } from "../controller/curation/delete";
import { curationCreate } from "../controller/curation/create";
import { curationUpdate } from "../controller/curation/update";
import { curationGet } from "../controller/curation/get";
import { curationLike } from "../controller/curation/like";
import { curationUnlike } from "../controller/curation/unlike";

export const router = Router();

router.get("/", curationGet);
router.post("/", verifyToken, curationCreate);
router.put("/", verifyToken, curationUpdate);
router.delete("/", verifyToken, curationDelete);

router.post("/like", verifyToken, curationLike);
router.post("/unlike", verifyToken, curationUnlike);
