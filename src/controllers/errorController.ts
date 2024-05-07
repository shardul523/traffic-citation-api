import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  next
) => {
  res.status(500).json({
    error: err.message,
    status: "fail",
  });
};
