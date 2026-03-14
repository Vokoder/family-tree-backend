import argon2 from 'argon2';
import { HttpError } from '#utils/http-error.utils.ts';
import { WRONG_CREDENTIALS } from '#constants/errors.constants.ts';
import { getUserByLogin } from '#firebase-client.ts';
import type { JwtTokens, JwtTokensWithUser } from '#shared/types/jwt.type.ts';
import { createAuthSession } from '#utils/jwt.utils.ts';
import { userToUserDto } from '#utils/user-converter.utils.ts';

export const loginService = async (login: string, password: string): Promise<JwtTokensWithUser> => {
  const user = await getUserByLogin(login);
  if (user) {
    const isCorrectPassword = await argon2.verify(user.password, password);
    if (!isCorrectPassword) {
      throw new HttpError(401, WRONG_CREDENTIALS);
    }

    const tokens = await createAuthSession(user);
    const userDto = userToUserDto(user);
    return { userDto, tokens };
  }

  throw new HttpError(401, WRONG_CREDENTIALS);
};
