import { Router } from "express";
import { createPersonController, deletePersonController, getPersonController, getPersonsController, updatePersonController } from "./person.controller.ts";
import { authenticationTokenProtectedMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const personRouter = Router();

personRouter.get('/', getPersonsController);
personRouter.get('/:personId', getPersonController);
personRouter.put('/:personId', authenticationTokenProtectedMiddleware, updatePersonController);
personRouter.post('/', authenticationTokenProtectedMiddleware, createPersonController);
personRouter.delete('/:personId', authenticationTokenProtectedMiddleware, deletePersonController);
