import { Router } from 'express';
import { getTree } from './tree.controller.ts';

export const treeRouter = Router();

treeRouter.get('/', getTree);
