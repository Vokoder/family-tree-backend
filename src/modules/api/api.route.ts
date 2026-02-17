import { Router } from 'express';
import { authRouter } from './auth/auth.route.ts';
import { personRouter } from './person/person.route.ts';
import { profileRouter } from './profile/profile.route.ts';
import { treeRouter } from './tree/tree.route.ts';
import { relationRouter } from './relation/relation.route.ts';
import { authenticateTokenMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/person', personRouter);
apiRouter.use('/profile', profileRouter);
apiRouter.use('/tree', authenticateTokenMiddleware, treeRouter);
apiRouter.use('/relation', relationRouter);
