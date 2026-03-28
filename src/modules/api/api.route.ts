import { Router } from 'express';
import { authRouter } from './auth/auth.route.ts';
import { personRouter } from './person/person.route.ts';
import { userRouter } from './user/user.route.ts';
import { treeRouter } from './tree/tree.route.ts';
import { relationRouter } from './relation/relation.route.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';
import { typesOfRelationsRouter } from './types-of-relations/types-of-relations.route.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/person', personRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/relation', relationRouter);
apiRouter.use('/tree', authenticationTokenProtectedMiddleware, treeRouter);
apiRouter.use('/typesofrelations', typesOfRelationsRouter);
