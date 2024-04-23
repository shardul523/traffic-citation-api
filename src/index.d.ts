export interface LoginCredentials {
  email: string;
  password: string;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
  }
}
