import { Router } from 'express';
import { logoutAllController, logoutController } from './logout.controller.ts';
import { refreshTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const logoutRouter = Router();

logoutRouter.post('/', refreshTokenProtectedMiddleware, logoutController);
logoutRouter.post('/all', logoutAllController);
