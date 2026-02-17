import { Router } from "express";
import { deleteProfileController, getProfileController, updateProfileController } from "./profile.controller.ts";
import { authenticateTokenMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const profileRouter = Router();

profileRouter.get('/', getProfileController);
profileRouter.put('/', authenticateTokenMiddleware, updateProfileController);
profileRouter.delete('/', authenticateTokenMiddleware, deleteProfileController);
