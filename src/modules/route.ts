import { Router } from 'express';
import { apiRouter } from './api/api.route.ts';

export const router = Router();

router.use('/api', apiRouter);
