import { Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signToken = (payload: string | object) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30m",
  });

export const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);

export function setJwtResCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
  });
}
