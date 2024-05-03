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
  (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

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
