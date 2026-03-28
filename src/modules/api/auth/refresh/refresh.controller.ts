import type { Request, Response } from 'express';
import { refreshService } from './refresh.service.ts';
import { setJwtCookies } from '#utils/jwt.utils.ts';

export const refreshController = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = res.locals.refreshToken;
  const refreshTokenPayload = res.locals.refreshTokenPayload;
  const tokensWithUser = await refreshService(refreshToken, refreshTokenPayload);
  setJwtCookies(res, tokensWithUser.tokens);
  res.json(200);
};
