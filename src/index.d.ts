export interface UserLoginCredentials {
  email: string;
  password: string;
}

export interface OfficerLoginCredentials {
  officerId: string;
  password: string;
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    id: number;
    isOfficer: boolean;
  }
}
