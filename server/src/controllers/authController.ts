import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields (name, email, password) are required",
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 5️⃣ Save to database
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};