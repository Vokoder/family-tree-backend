export interface JwtAccessTokenPayload {
  uid: string;
  login: string;
  roleId: string;
}

export interface JwtOutput {
  accessToken: string;
  refreshToken: string;
}