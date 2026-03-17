import { Router } from 'express';
import { deleteUserController, getMyUserController, getUserController, updateUserController } from './user.controller.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';

export const userRouter = Router();

userRouter.get('/', authenticationTokenProtectedMiddleware, getMyUserController);
userRouter.get('/:uid', getUserController);
userRouter.post('/', authenticationTokenProtectedMiddleware, updateUserController);
userRouter.delete('/', authenticationTokenProtectedMiddleware, deleteUserController);
