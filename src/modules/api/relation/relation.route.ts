import { Router } from "express";
import { createRelationController, deleteRelationController, getRelationController, updateRelationController } from "./relation.controller.ts";
import { authenticateTokenMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const relationRouter = Router();

relationRouter.get('/', getRelationController);
relationRouter.put('/', authenticateTokenMiddleware, updateRelationController);
relationRouter.post('/', authenticateTokenMiddleware, createRelationController);
relationRouter.delete('/', authenticateTokenMiddleware, deleteRelationController);
