import { deleteRefreshToken, deleteRefreshTokens } from '#firebase-client.ts';
import type { JwtAccessTokenPayload } from '#shared/types/jwt.type.ts';

export const logoutService = async (accessToken: JwtAccessTokenPayload, refreshToken: string): Promise<void> => {
  await deleteRefreshToken(accessToken.uid, refreshToken);
};

export const logoutAllService = async (accessToken: JwtAccessTokenPayload): Promise<void> => {
  await deleteRefreshTokens(accessToken.uid);
};
