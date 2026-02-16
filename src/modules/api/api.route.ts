import { Router } from 'express';
import { authRouter } from './auth/auth.route.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
