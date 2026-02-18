import { Router } from "express";
import { deleteProfileController, getProfileController, updateProfileController } from "./profile.controller.ts";
import { authenticationTokenProtectedMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const profileRouter = Router();

profileRouter.get('/', getProfileController);
profileRouter.put('/', authenticationTokenProtectedMiddleware, updateProfileController);
profileRouter.delete('/', authenticationTokenProtectedMiddleware, deleteProfileController);
