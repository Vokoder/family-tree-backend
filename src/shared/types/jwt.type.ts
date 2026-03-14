export interface JwtAccessTokenPayload {
  uid: string;
  login: string;
  roleId: string;
}

export interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}
