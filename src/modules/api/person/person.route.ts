import { Router } from "express";
import { createPersonController, deletePersonController, getPersonController, updatePersonController } from "./person.controller.ts";
import { authenticationTokenProtectedMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const personRouter = Router();

personRouter.get('/', getPersonController);
personRouter.put('/', authenticationTokenProtectedMiddleware, updatePersonController);
personRouter.post('/', authenticationTokenProtectedMiddleware, createPersonController);
personRouter.delete('/', authenticationTokenProtectedMiddleware, deletePersonController);
