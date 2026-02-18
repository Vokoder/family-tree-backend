import { Router } from "express";
import { createRelationController, deleteRelationController, getRelationController, updateRelationController } from "./relation.controller.ts";
import { authenticationTokenProtectedMiddleware } from "#shared/middleware/check-jwt.middleware.ts";

export const relationRouter = Router();

relationRouter.get('/', getRelationController);
relationRouter.put('/', authenticationTokenProtectedMiddleware, updateRelationController);
relationRouter.post('/', authenticationTokenProtectedMiddleware, createRelationController);
relationRouter.delete('/', authenticationTokenProtectedMiddleware, deleteRelationController);
