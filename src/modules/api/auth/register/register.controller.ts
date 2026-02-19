import type { Request, Response } from 'express';
import { HttpError } from '#utils/http-error.utils.ts';
import { EMPTY_REQUEST_BODY } from '#constants/errors.constants.ts';
import { registerService } from './register.service.ts';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  const { body: { login, password } = {} } = req;

  if (!login || !password) {
    throw new HttpError(400, `${EMPTY_REQUEST_BODY} login & password`);
  }

  const jwtOutput = await registerService(login, password);

  res.json(jwtOutput);
};
