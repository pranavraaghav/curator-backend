import { Request, Response } from "express";
import { baseAction } from "./controller/baseAction";
import { userprofileCreateAction} from "./controller/userprofileCreateAction"

interface IRoute {
  path: string;
  method: "get" | "post" | "put" | "delete";
  action: (request: Request, response: Response) => Promise<void>;
}

export const AppRoutes: IRoute[] = [
  // temp 
  {
    path: "/user/profile",
    method: "post",
    action: userprofileCreateAction
  },

  // base
  {
    path: "/",
    method: "get",
    action: baseAction,
  },
];
