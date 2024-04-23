export interface LoginCredentials {
  uid: string;
  password: string;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
  }
}
