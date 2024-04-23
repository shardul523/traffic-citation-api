import { RequestHandler, Response } from "express";
import bcrypt from "bcrypt";

export function extractCharactersAfterPattern(string: string, pattern: string) {
  const match = string.match(pattern);
  if (match) {
    const index = match.index + match[0].length;
    return string.substring(index);
  } else {
    return null;
  }
}

export const catchAsync: (fn: RequestHandler) => RequestHandler =
  (fn: RequestHandler) => (req, res, next) => {
    try {
      return fn(req, res, next);
    } catch (err) {
      console.error(err);
      next(err);
    }
  };

export function setJwtResCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
  });
}

// export async function passwordCompare(
//   candidatePassword: string,
//   hashedPassword: string
// ) {
//   try {
//     await bcrypt.compare(candidatePassword, hashedPassword);
//     return true;
//   } catch (err) {
//     return false;
//   }
// }
