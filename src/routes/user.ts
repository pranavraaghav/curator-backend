import { Router } from "express";
import { userPostSignupAction } from "../controller/userPostSignupAction";
import { userPostLoginAction } from "../controller/userPostLoginAction";

export const router = Router();

router.post("/signup", (request, response) => {
  userPostSignupAction(request, response);
});

router.post("/login", (request, response) => {
  userPostLoginAction(request, response);
})