export interface UserLoginCredentials {
  email: string;
  password: string;
}

export interface OfficerLoginCredentials {
  email: string;
  password: string;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
    role: string;
    uid?: string;
    officerId?: string;
  }
}
