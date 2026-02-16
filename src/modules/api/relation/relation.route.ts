import { Router } from "express";
import { createRelationController, deleteRelationController, getRelationController, updateRelationController } from "./relation.controller.ts";

export const relationRouter = Router();

relationRouter.get('/', getRelationController);
relationRouter.put('/', updateRelationController);
relationRouter.post('/', createRelationController);
relationRouter.delete('/', deleteRelationController);
