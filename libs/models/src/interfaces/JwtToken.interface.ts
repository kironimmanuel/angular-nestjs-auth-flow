export interface JwtToken {
  email: string;
  username: string;
  exp: number;
  iat: number;
}
