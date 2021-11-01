import { Router } from "express";
import { userSignup } from "../controller/user/signup";
import { userLogin } from "../controller/user/login";
import { userGetAllCurations } from "../controller/user/getAllCurations";
import { verifyToken } from "../middleware/jwt";

export const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.get("/curations", verifyToken, userGetAllCurations);