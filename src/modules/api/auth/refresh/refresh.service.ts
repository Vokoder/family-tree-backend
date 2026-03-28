import { INVALID_JWT_TOKEN, USER_NOT_FOUND } from '#constants/errors.constants.ts';
import { getUserById } from '#firebase-client.ts';
import type { JwtRefrashTokenPayload, JwtTokensWithUser } from '#shared/types/jwt.type.ts';
import type { RefreshToken } from '#shared/types/refresh-token.type.ts';
import { HttpError } from '#utils/http-error.utils.ts';
import { extendAuthSession, getJwtPayload } from '#utils/jwt.utils.ts';
import { userToUserDto } from '#utils/user-converter.utils.ts';

export const refreshService = async (
  refreshToken: string,
  refreshTokenPayload: JwtRefrashTokenPayload,
): Promise<JwtTokensWithUser> => {
  const uid = refreshTokenPayload.uid;
  const user = await getUserById(uid);
  if (!user) {
    throw new HttpError(404, USER_NOT_FOUND);
  }

  const tokens = await extendAuthSession(refreshToken, user);
  const userDto = userToUserDto(user);
  return { userDto, tokens };
};
