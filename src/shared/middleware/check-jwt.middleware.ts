import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '#app.config.ts';
import { INVALID_OR_EXPIRED_JWT_TOKEN, JWT_TOKEN_IS_MISSING } from '#constants/errors.constants.ts';
import type { JwtAccessTokenPayload, JwtOutput } from '#shared/types/jwt.type.ts';

export const authenticationTokenProtectedMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: JWT_TOKEN_IS_MISSING });
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ error: INVALID_OR_EXPIRED_JWT_TOKEN });
    }
    res.locals.user = user as JwtAccessTokenPayload;

    next();
  });
};
