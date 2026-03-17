import { Router } from 'express';
import { getTypesOfRelationsController } from './types-of-relations.controller.ts';

export const typesOfRelationsRouter = Router();

typesOfRelationsRouter.get('/', getTypesOfRelationsController);
