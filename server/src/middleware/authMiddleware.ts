import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "Not authorized, no token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string; role: "student" | "admin" | "recruiter" };

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access forbidden: insufficient permissions",
      });
    }
    next();
  };
};