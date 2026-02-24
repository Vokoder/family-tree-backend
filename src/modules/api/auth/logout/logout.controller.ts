import { HttpError } from '#utils/http-error.utils.ts';
import { getJwtToken } from '#utils/jwt.utils.ts';
import type { Request, Response } from 'express';
import { logoutService } from './logout.service.ts';
import { NO_REFRESH_TOKEN } from '#constants/errors.constants.ts';

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  const JwtAccessTokenPayload = res.locals.user;
  const { body: { jwtRefreshToken } = {} } = req;
  if (!JwtAccessTokenPayload || !jwtRefreshToken) {
    throw new HttpError(500, NO_REFRESH_TOKEN);
  }

  await logoutService(JwtAccessTokenPayload, jwtRefreshToken);
  res.json({ status: 200 });
};
