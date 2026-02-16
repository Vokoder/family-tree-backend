import { Router } from 'express';
import { registerController } from './register.controller.ts';

export const registerRouter = Router();

registerRouter.post('/', registerController);
