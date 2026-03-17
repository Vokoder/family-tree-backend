import { Router } from 'express';
import {
  createRelationController,
  deleteRelationController,
  getRelationController,
  getRelationsController,
  updateRelationController,
} from './relation.controller.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const relationRouter = Router();

relationRouter.get('/', getRelationsController);
relationRouter.get('/:relationId', getRelationController);
relationRouter.post('/:relationId', authenticationTokenProtectedMiddleware, updateRelationController);
relationRouter.post('/', authenticationTokenProtectedMiddleware, createRelationController);
relationRouter.delete('/', authenticationTokenProtectedMiddleware, deleteRelationController);
