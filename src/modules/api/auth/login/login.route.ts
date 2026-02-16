import { Router } from 'express';
import { loginController } from './login.controller.ts';

export const loginRouter = Router();

loginRouter.post('/', loginController);
