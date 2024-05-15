import { RequestHandler } from "express";

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

export function getViolationFine(violation: string): number {
  switch (violation) {
    case "overspeeding":
      return 500;
    case "no licence":
      return 1000;
    case "missing documents":
      return 750;
    default:
      return 1500;
  }
}

export function sanitizeNumberPlate(plate: string): string {
  const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return plate
    .trim()
    .split("")
    .filter((ch) => allowedChars.includes(ch))
    .join("");
}
