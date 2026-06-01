import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';
import { clearUserCache } from '#utils/cache.utils.ts';
import type { NextFunction, Request, Response } from 'express';

export const cleareCacheMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const jwtPayload: JwtAccessTokenPayload = res.locals.user;
  const uid = jwtPayload.uid;
  clearUserCache(uid);
  next();
};
