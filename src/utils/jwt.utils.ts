import { ACCESS_TOKEN_EXPIRES_IN, JWT_SECRET, REFRESH_TOKEN_EXPIRES_IN } from '#app.config.ts';
import { addRefreshToken, extendRefreshToken } from '#firebase-client.ts';
import type { JwtAccessTokenPayload, JwtTokens } from '#shared/types/jwt.type.ts';
import type { RefreshToken } from '#shared/types/refresh-token.type.ts';
import type { User } from '#shared/types/user.type.ts';
import type { Request } from 'express';
import { Timestamp } from 'firebase-admin/firestore';
import * as jwt from 'jsonwebtoken';
import type { Response } from 'express';

// true = verified, false - unverified
export const isJwtTokenValid = (token: string): boolean => {
  jwt.verify(token, JWT_SECRET, (error) => {
    return error ? false : true;
  });
  return false;
};

export const getJwtToken = (req: Request): string | null => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token ?? null;
};

export function getJwtPayloadFromRequest(req: Request): jwt.JwtPayload | null {
  const token = getJwtToken(req);
  if (token) {
    getJwtPayload(token);
  }

  return null;
}

export function getJwtPayload(token: string): jwt.JwtPayload | null {
  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (!error) {
      return user;
    }
  });

  return null;
}

export const generateAccessToken = (user: User): string => {
  return jwt.sign({ uid: user.id, login: user.login, roleId: user.roleId } as JwtAccessTokenPayload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

export const generateRefreshToken = (uid: string): RefreshToken => {
  const token = jwt.sign({ uid }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  const refreshToken: RefreshToken = {
    uid,
    token,
    createdAt: Timestamp.fromDate(new Date()),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000)),
  };

  return refreshToken;
};

export const createAuthSession = async (user: User): Promise<JwtTokens> => {
  const { accessToken, refreshToken } = generateTokens(user);
  await addRefreshToken(refreshToken);
  return createJwtTokens(accessToken, refreshToken);
};

export const extendAuthSession = async (oldRefreshToken: string, user: User): Promise<JwtTokens> => {
  const { accessToken, refreshToken } = generateTokens(user);
  await extendRefreshToken(oldRefreshToken, refreshToken);
  return createJwtTokens(accessToken, refreshToken);
};

const generateTokens = (user: User) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);
  return { accessToken, refreshToken };
};

const createJwtTokens = (accessToken: string, refreshToken: RefreshToken): JwtTokens => ({
  accessToken,
  refreshToken: refreshToken.token,
});

export const setJwtCookies = (res: Response, tokens: JwtTokens): void => {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_EXPIRES_IN * 1000,
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_EXPIRES_IN * 1000,
  });
};
