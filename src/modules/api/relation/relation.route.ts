import { Router } from 'express';
import {
  createRelationController,
  deleteRelationController,
  getRelationController,
  getRelationsController,
  updateRelationController,
} from './relation.controller.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';
import { cleareCacheMiddleware } from '#shared/middleware/cleare-cache.middleware.ts';

export const relationRouter = Router();

relationRouter.get('/', getRelationsController);
relationRouter.get('/:relationId', getRelationController);
relationRouter.post('/:relationId', authenticationTokenProtectedMiddleware, cleareCacheMiddleware, updateRelationController);
relationRouter.post('/', authenticationTokenProtectedMiddleware, cleareCacheMiddleware, createRelationController);
relationRouter.delete('/:relationId', authenticationTokenProtectedMiddleware, cleareCacheMiddleware, deleteRelationController);
