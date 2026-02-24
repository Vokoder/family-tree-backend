import { INVALID_JWT_TOKEN, INVALID_OR_EXPIRED_JWT_TOKEN } from "#constants/errors.constants.ts";
import { deleteRefreshToken } from "#firebase-client.ts";
import type { JwtAccessTokenPayload } from "#shared/types/jwt.type.ts";
import { HttpError } from "#utils/http-error.utils.ts";
import { getJwtPayload, isJwtTokenValid } from "#utils/jwt.utils.ts"

export const logoutService = async (accessToken: string, refreshToken: string): Promise<void> => {
  if (!isJwtTokenValid(refreshToken)) {
    throw new HttpError(401, INVALID_OR_EXPIRED_JWT_TOKEN);
  }

  const accessJwtPayload: JwtAccessTokenPayload | null = getJwtPayload(accessToken) as JwtAccessTokenPayload;
  if (!accessJwtPayload) {
    throw new HttpError(500, INVALID_JWT_TOKEN);
  }

  await deleteRefreshToken(accessJwtPayload.uid, refreshToken);
}