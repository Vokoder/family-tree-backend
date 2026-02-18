import { JWT_SECRET } from "#app.config.ts";
import type { Request } from "express";
import * as jwt from 'jsonwebtoken';

export const getJWTPayload = (req: Request): null | jwt.JwtPayload => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (error, user) => {
      if (!error) {
        return user;
      }
    });
  }

  return null
};
