import { Router } from "express";
import { createPersonController, deletePersonController, getPersonController, updatePersonController } from "./person.controller.ts";
import { authenticateTokenMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const personRouter = Router();

personRouter.get('/', getPersonController);
personRouter.put('/', authenticateTokenMiddleware, updatePersonController);
personRouter.post('/', authenticateTokenMiddleware, createPersonController);
personRouter.delete('/', authenticateTokenMiddleware, deletePersonController);
