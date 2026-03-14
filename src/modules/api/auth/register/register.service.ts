import argon2 from 'argon2';
import { createUser } from '#firebase-client.ts';
import type { JwtTokens } from '#shared/types/jwt.type.ts';
import { createAuthSession } from '#utils/jwt.utils.ts';

export const registerService = async (login: string, password: string): Promise<JwtTokens> => {
  const hashedPassword = await argon2.hash(password);
  const user = await createUser(login, hashedPassword);
  const tokens = createAuthSession(user);
  return tokens;
};
