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

export const personRouter = Router();

personRouter.get('/', getPersonsController);
personRouter.get('/user', authenticationTokenProtectedMiddleware, getUserPersonsController);
personRouter.get('/related/:personId', authenticationTokenProtectedMiddleware, getRelatedPersonsController);
personRouter.get('/:personId', getPersonController);
personRouter.post('/', authenticationTokenProtectedMiddleware, createPersonController);
personRouter.post('/:personId', authenticationTokenProtectedMiddleware, updatePersonController);
personRouter.delete('/:personId', authenticationTokenProtectedMiddleware, deletePersonController);
