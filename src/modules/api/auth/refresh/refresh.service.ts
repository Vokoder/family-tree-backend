import { INVALID_JWT_TOKEN, INVALID_OR_EXPIRED_JWT_TOKEN, USER_NOT_FOUND } from '#constants/errors.constants.ts';
import { getUserById } from '#firebase-client.ts';
import type { JwtTokensWithUser } from '#shared/types/jwt.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { extendAuthSession, getJwtPayload, isJwtTokenValid } from '#utils/jwt.utils.ts';
import { userToUserDto } from '#utils/user-converter.utils.ts';

export const refreshService = async (refreshToken: string): Promise<JwtTokensWithUser> => {
  if (!isJwtTokenValid(refreshToken)) {
    throw new HttpError(401, INVALID_OR_EXPIRED_JWT_TOKEN);
  }

  const jwtPayload = getJwtPayload(refreshToken);
  if (!jwtPayload || !jwtPayload.uid) {
    throw new HttpError(401, INVALID_JWT_TOKEN);
  }

  const uid = jwtPayload.uid;
  const user = await getUserById(uid);
  if (!user) {
    throw new HttpError(404, USER_NOT_FOUND);
  }

  const tokens = await extendAuthSession(refreshToken, user);
  const userDto = userToUserDto(user);
  return { userDto, tokens };
};
