import { OfficerLoginCredentials, UserLoginCredentials } from "..";
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
export const userSignup = catchAsync(async (req, res, next) => {
  const { uid, name, password, email }: Prisma.UserCreateInput = req.body;

  if (uid.length !== 12) return next(new Error("Invalid UID"));

  const newUser = await prisma.user.signup(uid, email, name, password);
  const token = signToken({ id: newUser.id, isOfficer: false, isAdmin: false });

  setJwtResCookie(res, token);

  return res.status(201).json({ user: newUser, status: "success" });
});

/**
 * @description Login Users
 * @route       POST /api/v1/auth/login
 * @access      PUBLIC
 */
export const userLogin = catchAsync(async (req, res, next) => {
  const { email, password }: UserLoginCredentials = req.body;

  const user = await prisma.user.signin(email, password);

  if (!user) return next(new Error("Invalid credentials"));

  const token = signToken({ id: user.id, isOfficer: false, isAdmin: false });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    user,
  });
});

/**
 * @description     Sign Up New Officer
 * @route           POST /signup/officer
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
    isOfficer: true,
    isAdmin: false,
  });

  setJwtResCookie(res, token);

  return res.status(201).json({ officer: newOfficer, status: "success" });
});

/**
 * @description     Sign In Officer
 * @route           POST /signin/officer
 * @access          public
 */
export const officerSignin = catchAsync(async (req, res, next) => {
  const { officerId, password }: OfficerLoginCredentials = req.body;

  const officer = await prisma.officer.signin(officerId, password);

  if (!officer) return next(new Error("Invalid credentials"));

  const token = signToken({ id: officer.id, isOfficer: true, isAdmin: false });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    officer,
  });
});

/**
 * @description   Sign up admin user
 * @route         POST /signup/admin
 * @access        public
 */
export const adminSignup = catchAsync(async (req, res, next) => {
  const { password, email }: Prisma.AdminCreateInput = req.body;

  const newAdmin = await prisma.admin.create({ data: { email, password } });
  const token = signToken({
    id: newAdmin.id,
    isOfficer: false,
    isAdmin: false,
  });

  setJwtResCookie(res, token);

  return res.status(201).json({ admin: newAdmin, status: "success" });
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

  if (!decoded) return next(new Error("Not authenticated"));

  req.body.isOfficer = decoded.isOfficer;

  if (req.body.isOfficer) req.body.officerId = decoded.id;
  else req.body.userId = decoded.id;

  next();
});

/**
 * @description Login Admins
 * @route       POST /auth/login/admin
 * @access      public
 */
export const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password }: UserLoginCredentials = req.body;

  const user = await prisma.admin.signin(email, password);

  if (!user) return next(new Error("Invalid credentials"));

  const token = signToken({ id: user.id, isOfficer: false, isAdmin: false });

  setJwtResCookie(res, token);

  return res.status(200).json({
    status: "success",
    user,
  });
});

/**
 * @description   Authorize the officers
 * @route         MIDDLEWARE
 * @access        private
 */
export const authorizeOfficer = catchAsync(async (req, res, next) => {
  if (!req.body.isOfficer) return next(new Error("Unauthorized!"));

  return next();
});
