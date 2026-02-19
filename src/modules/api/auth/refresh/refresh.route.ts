import { Router } from "express";
import { refreshController } from "./refresh.controller.ts";

export const refreshRouter = Router();

refreshRouter.post('/', refreshController);