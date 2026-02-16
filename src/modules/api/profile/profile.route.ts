import { Router } from "express";
import { deleteProfileController, getProfileController, updateProfileController } from "./profile.controller.ts";

export const profileRouter = Router();

profileRouter.get('/', getProfileController);
profileRouter.put('/', updateProfileController);
profileRouter.delete('/', deleteProfileController);
