import argon2 from 'argon2';
import { createUser } from '#firebase-client.ts';
import type { JwtTokensWithUser } from '#shared/types/jwt.type.ts';
import { createAuthSession } from '#utils/jwt.utils.ts';
import { userToUserDto } from '#utils/user-converter.utils.ts';

export const registerService = async (login: string, password: string): Promise<JwtTokensWithUser> => {
  const hashedPassword = await argon2.hash(password);
  const user = await createUser(login, hashedPassword);
  const tokens = await createAuthSession(user);
  const userDto = userToUserDto(user);
  return { userDto, tokens };
};
