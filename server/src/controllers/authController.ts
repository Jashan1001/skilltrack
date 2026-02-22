import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

/* ============================= */
/* REGISTER */
/* ============================= */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(
        new AppError(
          "Name, email and password are required",
          400
        )
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(
        new AppError("User already exists", 400)
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  }
);

/* ============================= */
/* LOGIN */
/* ============================= */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(
        new AppError("Email and password required", 400)
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new AppError("Invalid credentials", 401)
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return next(
        new AppError("Invalid credentials", 401)
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
    });
  }
);