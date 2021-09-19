import { request, response, Router } from "express";
import { userPostCreateAction } from "../controller/userPostCreateAction";
import { userPostLogin } from "../controller/userPostLogin";

export const router = Router();

router.post("/", (request, response) => {
  userPostCreateAction(request, response);
});

router.post("/login", (request, response) => {
  userPostLogin(request, response);
})