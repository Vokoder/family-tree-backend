import type { Request, Response } from 'express';
import { EMPTY_REQUEST_BODY } from '#constants/errors.constants.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { loginService } from './login.service.ts';
import { setJwtCookies } from '#utils/jwt.utils.ts';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { body: { login, password } = {} } = req;

  if (!login || !password) {
    throw new HttpError(400, `${EMPTY_REQUEST_BODY} login & password`);
  }

  const jwtTokens = await loginService(login, password);
  setJwtCookies(res, jwtTokens);

  res.json('ok');
};
