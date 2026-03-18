import { Router } from 'express';
import {
  createPersonController,
  deletePersonController,
  getPersonController,
  getUserPersonsController,
  getPersonsController,
  updatePersonController,
} from './person.controller.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const personRouter = Router();

personRouter.get('/', getPersonsController);
personRouter.get('/user', authenticationTokenProtectedMiddleware, getUserPersonsController);
personRouter.get('/:personId', getPersonController);
personRouter.post('/:personId', authenticationTokenProtectedMiddleware, updatePersonController);
personRouter.post('/', authenticationTokenProtectedMiddleware, createPersonController);
personRouter.delete('/:personId', authenticationTokenProtectedMiddleware, deletePersonController);
