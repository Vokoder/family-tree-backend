import { Router } from 'express';
import { logoutController } from './logout.controller.ts';

export const logoutRouter = Router();

logoutRouter.post('/', logoutController);
