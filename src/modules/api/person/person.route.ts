import { Router } from "express";
import { createPersonController, deletePersonController, getPersonController, updatePersonController } from "./person.controller.ts";

export const personRouter = Router();

personRouter.get('/', getPersonController);
personRouter.put('/', updatePersonController);
personRouter.post('/', createPersonController);
personRouter.delete('/', deletePersonController);
