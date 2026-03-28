import { Router } from 'express';
import { refreshController } from './refresh.controller.ts';
import { refreshTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const refreshRouter = Router();

refreshRouter.post('/', refreshTokenProtectedMiddleware, refreshController);
