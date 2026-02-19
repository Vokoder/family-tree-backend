import { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET, REFRESH_TOKEN_EXPIRES_IN } from "#app.config.ts";
import { addRefreshToken, extendRefreshToken } from "#firebase-client.ts";
import type { JwtAccessToken, JwtOutput } from "#shared/types/jwt.type.ts";
import type { RefreshToken } from "#shared/types/refreshToken.type.ts";
import type { User } from "#shared/types/user.type.ts";
import type { Request } from "express";
import { Timestamp } from "firebase-admin/firestore";
import * as jwt from 'jsonwebtoken';

// true = verified, false - unverified
export const isJwtTokenValid = (token: string): boolean => {
  jwt.verify(token, JWT_SECRET, (error) => {
    return error ? false : true;
  });
  return false;
}

export const getJwtToken = (req: Request): string | null => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token ?? null;
}

export function getJwtPayloadFromRequest(req: Request): jwt.JwtPayload | null {
  const token = getJwtToken(req);
  if (token) {
    getJwtPayload(token);
  }

  return null
};

export function getJwtPayload(token: string): jwt.JwtPayload | null {
  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (!error) {
      return user;
    }
  });

  return null
}

export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    { uid: user.id, login: user.login, roleId: user.roleId } as JwtAccessToken,
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

export const generateRefreshToken = (uid: string): RefreshToken => {
  const token = jwt.sign(
    { uid },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  const refreshToken: RefreshToken = {
    uid,
    token,
    createdAt: Timestamp.fromDate(new Date()),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000))
  }

  return refreshToken
}

export const createAuthSession = async (user: User): Promise<JwtOutput> => {
  const { accessToken, refreshToken } = generateTokens(user);
  await addRefreshToken(refreshToken);
  return createJwtOutput(accessToken, refreshToken);
}

export const extendAuthSession = async (oldRefreshToken: string, user: User): Promise<JwtOutput> => {
  const { accessToken, refreshToken } = generateTokens(user);
  await extendRefreshToken(oldRefreshToken, refreshToken);
  return createJwtOutput(accessToken, refreshToken);
}

const generateTokens = (user: User) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);
  return { accessToken, refreshToken };
};

const createJwtOutput = (accessToken: string, refreshToken: RefreshToken): JwtOutput => ({
  accessToken,
  refreshToken: refreshToken.token,
});