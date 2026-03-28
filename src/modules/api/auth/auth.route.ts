import { Router } from 'express';
import { registerRouter } from './register/register.route.ts';
import { loginRouter } from './login/login.route.ts';
import { logoutRouter } from './logout/logout.route.ts';
import { authenticationTokenProtectedMiddleware } from '#shared/middleware/check-jwt.middleware.ts';
import { refreshRouter } from './refresh/refresh.route.ts';

export const authRouter = Router();

authRouter.use('/register', registerRouter);
authRouter.use('/login', loginRouter);
authRouter.use('/logout', authenticationTokenProtectedMiddleware, logoutRouter);
authRouter.use('/refresh', refreshRouter);
