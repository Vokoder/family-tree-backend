import type { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "#app.config.ts";

export const authenticateTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'токен отсутствует' });//TODO const
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'токен невалидный или истёк' });//TODO const
    }
    res.locals.user = user;

    next();
  });
};
