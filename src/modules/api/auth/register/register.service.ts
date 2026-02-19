import argon2 from 'argon2';
import { LOGIN_ALREADY_EXISTS } from '#constants/errors.constants.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { createUser, getUserByLogin } from '#firebase-client.ts';
import { createAuthSession } from '#utils/jwt.utils.ts';
import type { JwtOutput } from '#shared/types/jwt.type.ts';

export const registerService = async (login: string, password: string): Promise<JwtOutput> => {
  const existUser = await getUserByLogin(login);
  if (existUser) {
    throw new HttpError(400, LOGIN_ALREADY_EXISTS);
  }

  const hashedPassword = await argon2.hash(password);
  const user = await createUser(login, hashedPassword);
  const output = createAuthSession(user);
  return output
};
