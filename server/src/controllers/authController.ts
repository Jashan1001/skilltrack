import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import axios from "axios";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
/* ============================= */
/* HELPERS                      */
/* ============================= */

const signToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });

const sendTokenRedirect = (res: Response, token: string) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  res.redirect(`${clientUrl}/oauth/callback?token=${token}`);
};

/* ============================= */
/* REGISTER                     */
/* ============================= */

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
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
/* LOGIN                        */
/* ============================= */

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    if (!user.password) {
      return next(
        new AppError(
          "This account uses Google or GitHub sign-in. Please continue with that provider.",
          401
        )
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    const token = signToken(String(user._id), user.role);

    res.status(200).json({ success: true, token });
  }
);

/* ============================= */
/* GET ME                       */
/* ============================= */

export const getMe = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
      },
    });
  }
);

/* ============================= */
/* GOOGLE OAUTH                 */
/* ============================= */

export const googleRedirect = (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
};

export const googleCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;

    if (!code) {
      return next(new AppError("No code provided", 400));
    }

    // Exchange code for tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL!,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // Get user info
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { id, email, name, picture } = userInfoRes.data;

    // Find or create user
    let user = await User.findOne({
      $or: [{ googleId: id }, { email }],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: id,
        avatarUrl: picture,
        role: "student",
      });
    } else if (!user.googleId) {
      // Existing email account — link Google to it
      user.googleId = id;
      if (!user.avatarUrl) user.avatarUrl = picture;
      await user.save();
    }

    const token = signToken(String(user._id), user.role);
    sendTokenRedirect(res, token);
  }
);

/* ============================= */
/* GITHUB OAUTH                 */
/* ============================= */

export const githubRedirect = (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: process.env.GITHUB_CALLBACK_URL!,
    scope: "user:email",
  });

  res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};

export const githubCallback = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.query;

    if (!code) {
      return next(new AppError("No code provided", 400));
    }

    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL!,
      },
      { headers: { Accept: "application/json" } }
    );

    const { access_token } = tokenRes.data;

    // Get user profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // GitHub may not expose email publicly — fetch separately
    const emailsRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const primaryEmail = emailsRes.data.find(
      (e: any) => e.primary && e.verified
    )?.email;

    if (!primaryEmail) {
      return next(
        new AppError(
          "No verified email found on your GitHub account.",
          400
        )
      );
    }

    const { id, name, avatar_url, login } = userRes.data;

    let user = await User.findOne({
      $or: [{ githubId: String(id) }, { email: primaryEmail }],
    });

    if (!user) {
      user = await User.create({
        name: name || login,
        email: primaryEmail,
        githubId: String(id),
        avatarUrl: avatar_url,
        role: "student",
      });
    } else if (!user.githubId) {
      user.githubId = String(id);
      if (!user.avatarUrl) user.avatarUrl = avatar_url;
      await user.save();
    }

    const token = signToken(String(user._id), user.role);
    sendTokenRedirect(res, token);
  }
);


/* ============================= */
/* FORGOT PASSWORD              */
/* ============================= */

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return success — don't reveal if email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    if (!user.password) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password?token=${token}&email=${email}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #111827;">Reset your password</h2>
        <p style="color: #6B7280;">
          You requested a password reset for your SkillTrack account.
          Click the button below to set a new password. This link expires in 15 minutes.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #4F46E5; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none;
                  font-weight: 600; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #9CA3AF; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({ to: email, subject: "Reset your SkillTrack password", html });
    } catch {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      return next(new AppError("Failed to send email. Please try again.", 500));
    }

    res.status(200).json({
      success: true,
      message: "If that email exists, a reset link has been sent.",
    });
  }
);

/* ============================= */
/* RESET PASSWORD               */
/* ============================= */

export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, email, password } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return next(new AppError("Invalid or expired reset token.", 400));
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  }
);