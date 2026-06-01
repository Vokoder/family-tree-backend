import { Router } from 'express';
import { getTreeController } from './tree.controller.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const treeRouter = Router();

treeRouter.get('/:personId', authenticationTokenProtectedMiddleware, getTreeController);
