import argon2 from 'argon2';
import { HttpError } from '#utils/http-error.utils.ts';
import { WRONG_CREDENTIALS } from '#constants/errors.constants.ts';
import { getUserByLogin } from '#firebase-client.ts';
import type { User } from '#shared/types/user.type.ts';
import type { JwtTokens } from '#shared/types/jwt.type.ts';
import { createAuthSession } from '#utils/jwt.utils.ts';

export const loginService = async (login: string, password: string): Promise<JwtTokens> => {
  const user = await getUserByLogin(login);
  if (user) {
    const isCorrectPassword = await argon2.verify(user.password, password);
    if (!isCorrectPassword) {
      throw new HttpError(401, WRONG_CREDENTIALS);
    }

    const output = await createAuthSession(user);
    return output;
  }

  throw new HttpError(401, WRONG_CREDENTIALS);
};
