import type { UserDto } from './user.type.ts';

export interface JwtAccessTokenPayload {
  uid: string;
  login: string;
  roleId: string;
}

export interface JwtRefrashTokenPayload {
  uid: string;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtTokensWithUser {
  userDto: UserDto;
  tokens: JwtTokens;
}
