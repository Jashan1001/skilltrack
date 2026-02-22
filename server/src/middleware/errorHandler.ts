import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("ERROR 💥", err);

  // Known operational error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong",
  });
};