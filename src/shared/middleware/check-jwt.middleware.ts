import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#app.config.ts';
import { INVALID_OR_EXPIRED_JWT_TOKEN, JWT_TOKEN_IS_MISSING } from '#constants/errors.constants.ts';
import type { JwtAccessTokenPayload, JwtTokens } from '#shared/types/jwt.type.ts';

export const authenticationTokenProtectedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: JWT_TOKEN_IS_MISSING });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtAccessTokenPayload;
    res.locals.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: INVALID_OR_EXPIRED_JWT_TOKEN });
  }
};
