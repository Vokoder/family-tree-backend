import type { Request, Response } from 'express';
import { logoutAllService, logoutService } from './logout.service.ts';
import { clearJwtCookies } from '#utils/jwt.utils.ts';

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  const JwtAccessTokenPayload = res.locals.user;
  const refreshToken = res.locals.refreshToken;

  await logoutService(JwtAccessTokenPayload, refreshToken);
  clearJwtCookies(res);
  res.json({ status: 200 });
};

export const logoutAllController = async (req: Request, res: Response): Promise<void> => {
  const JwtAccessTokenPayload = res.locals.user;

  await logoutAllService(JwtAccessTokenPayload);
  clearJwtCookies(res);
  res.json({ status: 200 });
};
