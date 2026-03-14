import type { Request, Response } from 'express';
import { EMPTY_REQUEST_BODY } from '#constants/errors.constants.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { loginService } from './login.service.ts';
import { setJwtCookies } from '#utils/jwt.utils.ts';
import { userToUserDto } from '#utils/user-converter.utils.ts';

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { body: { login, password } = {} } = req;

  if (!login || !password) {
    throw new HttpError(400, `${EMPTY_REQUEST_BODY} login & password`);
  }

  const tokensWithUser = await loginService(login, password);
  setJwtCookies(res, tokensWithUser.tokens);

  res.json(tokensWithUser.userDto);
};
