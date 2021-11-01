import { Router } from "express";
import { userPostSignupAction } from "../controller/userPostSignupAction";
import { userPostLoginAction } from "../controller/userPostLoginAction";
import { userGetAllCurationAction } from "../controller/userGetAllCurationAction";
import { verifyToken } from "../middleware/jwt";

export const router = Router();

router.post("/signup", userPostSignupAction);
router.post("/login", userPostLoginAction);
router.get("/curations", verifyToken, userGetAllCurationAction);