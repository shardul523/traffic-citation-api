import { OfficerLoginCredentials, UserLoginCredentials } from "..";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

import { prisma } from "../config/db";
import { catchAsync } from "../utils/index";
import { signToken, verifyToken, setJwtResCookie } from "../utils/jwt";
import { RequestHandler } from "express";

/**
 * @description Sign Up New Users
 * @route       POST auth/signup/user
 * @access      PUBLIC
 */
export const userSignup = catchAsync(async (req, res, next) => {
  const { uid, name, password, email }: Prisma.UserCreateInput = req.body;

  if (uid.length !== 12) return next(new Error("Invalid UID"));

  const newUser = await prisma.user.signup(uid, email, name, password);
  const token = signToken({
    id: newUser.id,
    role: "user",
    uid: newUser.uid,
  });

  setJwtResCookie(res, token);

  return res
    .status(201)
    .json({ message: "User Signed Up", role: "user", status: "success" });
});

/**
 * @description Login Users
 * @route       POST /auth/login/user
 * @access      PUBLIC
 */
export const userLogin = catchAsync(async (req, res, next) => {
  const { email, password }: UserLoginCredentials = req.body;

  const user = await prisma.user.signin(email, password);

  if (!user) return next(new Error("Invalid credentials"));

  const token = signToken({
    id: user.id,
    role: "user",
    uid: user.uid,
  });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    message: "User signed in",
    role: "user",
  });
});

/**
 * @description     Sign Up New Officer
 * @route           POST auth/signup/officer
 * @access          public
 */
export const officerSignup = catchAsync(async (req, res, next) => {
  const { officerId, name, password, email }: Prisma.OfficerCreateInput =
    req.body;

  if (officerId.length !== 10) return next(new Error("Invalid Officer Id"));

  const newOfficer = await prisma.officer.signup(
    officerId,
    email,
    name,
    password
  );
  const token = signToken({
    id: newOfficer.id,
    role: "officer",
    officerId,
  });

  setJwtResCookie(res, token);

  return res
    .status(201)
    .json({ message: "Officer signed up", status: "success", role: "officer" });
});

/**
 * @description     Sign In Officer
 * @route           POST auth/login/officer
 * @access          public
 */
export const officerSignin = catchAsync(async (req, res, next) => {
  const { email, password }: OfficerLoginCredentials = req.body;

  const officer = await prisma.officer.signin(email, password);

  if (!officer) return next(new Error("Invalid credentials"));

  const token = signToken({
    id: officer.id,
    role: "officer",
    officerId: officer.officerId,
  });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    message: "Officer signed in",
    role: "officer",
  });
});

/**
 * @description   Sign up admin user
 * @route         POST auth/signup/admin
 * @access        public
 */
export const adminSignup = catchAsync(async (req, res, next) => {
  const { password, email }: Prisma.AdminCreateInput = req.body;

  const newAdmin = await prisma.admin.signup(email, password);
  const token = signToken({
    id: newAdmin.id,
    role: "admin",
  });

  setJwtResCookie(res, token);

  return res.status(201).json({ admin: newAdmin, status: "success" });
});

/**
 * @description Login Admins
 * @route       POST auth/login/admin
 * @access      public
 */
export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password }: UserLoginCredentials = req.body;

  const user = await prisma.admin.signin(email, password);

  if (!user) return next(new Error("Invalid credentials"));

  const token = signToken({ id: user.id, role: "admin" });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    user,
  });
});

/**
 * @description Check if users are logged in
 * @route       MIDDLEWARE
 * @access      Private
 */
export const authenticate = catchAsync(async (req, res, next) => {
  if (!req.cookies?.jwt) return next(new Error("Not authorized"));

  const token = req.cookies?.jwt;

  const decoded = verifyToken(token) as JwtPayload;

  if (!decoded) return next(new Error("Not authenticated"));

  req.body.auth = { id: decoded.id, role: decoded.role };

  switch (decoded.role) {
    case "user":
      req.body.auth.uid = decoded.uid;
      break;
    case "officer":
      req.body.auth.officerId = decoded.officerId;
      break;
    default:
      break;
  }

  next();
});

/**
 * @description   Authorize the officers
 * @route         MIDDLEWARE
 * @access        private
 */
export const authorize = (role: string) =>
  catchAsync(async (req, res, next) => {
    if (req.body.auth.role !== role) return next(new Error("Unauthorized!"));

    return next();
  });

/**
 * @description   Logout
 * @route         DELETE  /auth/logout
 * @access        public
 */
export const logout: RequestHandler = async (req, res) => {
  res.clearCookie("jwt");

  return res.status(200).json({
    status: "success",
    message: "Logout successful",
  });
};
