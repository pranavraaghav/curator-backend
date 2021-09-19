import { Request, Response } from "express";
import { baseAction } from "./controller/baseAction";
interface IRoute {
  path: string;
  method: "get" | "post" | "put" | "delete";
  action: (request: Request, response: Response) => Promise<void>;
}

export const AppRoutes: IRoute[] = [
  {
    path: "/",
    method: "get",
    action: baseAction,
  },
];
