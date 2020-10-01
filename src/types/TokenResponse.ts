export interface TokenResponse {
  token: string;
  token_type: string;
}

export interface AccessTokenResponse extends TokenResponse {
  expires_in: number;
}