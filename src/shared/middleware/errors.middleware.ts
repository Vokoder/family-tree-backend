import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '#utils/http-error.utils.ts';
import { logger } from '#utils/logger.utils.ts';

export const httpErrorMiddleware = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  req.resume();
  logger.error(err);
  res.status(Number.isInteger(err.status) ? err.status : 500).json({ error: 'Request error', ...err.toJson() });
  next();
};

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  req.resume();
  logger.error(err);
  res.status(500).json({ error: 'Internal error:', message: err.message });
  next();
};

export const typeErrorMiddleware = (err: TypeError, req: Request, res: Response, next: NextFunction): void => {
  req.resume();
  logger.error(err);
  res.status(500).json({ error: 'Internal error. TypeError.', message: err.message });
  next();
};
