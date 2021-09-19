import { Router } from "express";
import { baseAction } from "../controller/baseAction";
import { router as userRouter } from "./user";
import { router as curationRouter } from "./curation";
import { router as blockRouter } from "./block";

export const router = Router();

router.use("/user", userRouter);
router.use("/curation", curationRouter);
router.use("/block", blockRouter);

router.get("/", (request, response) => {
  baseAction(request, response);
});
