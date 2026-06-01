import { Router } from 'express';
import {
  createPersonController,
  deletePersonController,
  getPersonController,
  getUserPersonsController,
  getPersonsController,
  updatePersonController,
  getRelatedPersonsController,
} from './person.controller.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';
import { cleareCacheMiddleware } from '#shared/middleware/cleare-cache.middleware.ts';

export const personRouter = Router();

personRouter.get('/', getPersonsController);
personRouter.get('/user', authenticationTokenProtectedMiddleware, getUserPersonsController);
personRouter.get('/related/:personId', authenticationTokenProtectedMiddleware, getRelatedPersonsController);
personRouter.get('/:personId', getPersonController);
personRouter.post('/', authenticationTokenProtectedMiddleware, cleareCacheMiddleware, createPersonController);
personRouter.post('/:personId', authenticationTokenProtectedMiddleware, cleareCacheMiddleware, updatePersonController);
personRouter.delete('/:personId', authenticationTokenProtectedMiddleware, cleareCacheMiddleware, deletePersonController);
