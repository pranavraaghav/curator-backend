import { Router } from "express";
import { userPostSignupAction } from "../controller/userPostSignupAction";
import { userPostLoginAction } from "../controller/userPostLoginAction";
import { userGetAllCurationAction } from "../controller/userGetAllCurationAction";
import { verifyToken } from "../middleware/jwt";

export const router = Router();

router.post("/signup", (request, response) => {
  userPostSignupAction(request, response);
});

router.post("/login", (request, response) => {
  userPostLoginAction(request, response);
});

router.get("/curations", verifyToken, (request, response) => {
  userGetAllCurationAction(request, response);
});
