import { LoginCredentials } from "..";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

import { prisma } from "../config/db";
import { catchAsync } from "../utils/index";
import { signToken, verifyToken, setJwtResCookie } from "../utils/jwt";

/**
 * @description Sign Up New Users
 * @route       POST /api/v1/auth/signup
 * @access      PUBLIC
 */
export const signup = catchAsync(async (req, res, next) => {
  const { uid, name, password, email }: Prisma.UserCreateInput = req.body;

  if (uid.length !== 12) return next(new Error("Invalid UID"));

  const newUser = await prisma.user.signup(uid, email, name, password);
  const token = signToken({ id: newUser.id });

  setJwtResCookie(res, token);

  return res.status(201).json({ user: newUser, status: "success" });
});

/**
 * @description Login Users
 * @route       POST /api/v1/auth/login
 * @access      PUBLIC
 */
export const login = catchAsync(async (req, res, next) => {
  const { email, password }: LoginCredentials = req.body;

  const user = await prisma.user.signin(email, password);

  if (!user) return next(new Error("Invalid credentials"));

  const token = signToken({ id: user.id });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    user,
  });
});

/**
 * @description Check if users are logged in
 * @route       GET /api/v1/auth/authenticate
 * @access      Private
 */
export const authenticate = catchAsync(async (req, res, next) => {
  if (!req.cookies?.jwt) return next(new Error("Not authorized"));

  const token = req.cookies?.jwt;

  const decoded = verifyToken(token) as JwtPayload;

  if (!decoded) return next(new Error("Not authorized"));

  req.body.userId = decoded.id;

  next();
});
