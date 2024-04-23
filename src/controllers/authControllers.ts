import { LoginCredentials } from "..";
import { Request } from "express";
import { Prisma } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { prisma } from "../config/db";
import { catchAsync } from "../utils";

const JWT_SECRET = process.env.JWT_SECRET;

const signToken = (payload: string | object) =>
  jwt.sign(payload, JWT_SECRET, {
    expiresIn: "30m",
  });

const verifyToken = (token: string) => jwt.verify(token, JWT_SECRET);

/**
 * @description Sign Up New Users
 * @route       POST /api/v1/auth/signup
 * @access      PUBLIC
 */
export const signup = catchAsync(async (req, res, next) => {
  const { uid, name, password }: Prisma.UserCreateInput = req.body;

  if (uid.length !== 12) return next(new Error("Invalid UID"));

  const newUser = await prisma.user.signup(uid, name, password);
  const token = signToken({ id: newUser.id });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
  });

  return res.status(201).json({ user: newUser });
});

/**
 * @description Login Users
 * @route       POST /api/v1/auth/login
 * @access      PUBLIC
 */
export const login = catchAsync(async (req, res, next) => {
  const { uid, password }: LoginCredentials = req.body;
  const user = await prisma.user.findUnique({
    where: { uid },
  });

  console.log(user);

  if (!user) return next(new Error("Invalid Credentials"));

  const isPassValid = await bcrypt.compare(password, user.password);

  if (!isPassValid) return next(new Error("Invalid Credentials"));

  const token = signToken({ id: user.id });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
  });

  return res.status(200).json({
    status: "success",
    data: {
      message: "Login successful",
    },
  });
});

/**
 * @description Check if users are logged in
 * @route       GET /api/v1/auth/authenticate
 * @access      Private
 */
export const authenticate = catchAsync(async (req, res, next) => {
  console.log(req.cookies);

  if (!req.cookies?.jwt) return next(new Error("Not authorized"));

  const token = req.cookies?.jwt;

  const decoded = verifyToken(token) as JwtPayload;

  if (!decoded) return next(new Error("Not authorized"));

  req.body.user = decoded.id;

  next();
});
