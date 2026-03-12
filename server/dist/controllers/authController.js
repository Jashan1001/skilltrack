"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.githubCallback = exports.githubRedirect = exports.googleCallback = exports.googleRedirect = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = __importDefault(require("axios"));
const User_1 = __importDefault(require("../models/User"));
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../utils/sendEmail");
/* ============================= */
/* HELPERS                      */
/* ============================= */
const signToken = (userId, role) => jsonwebtoken_1.default.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
const sendTokenRedirect = (res, token) => {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/oauth/callback?token=${token}`);
};
/* ============================= */
/* REGISTER                     */
/* ============================= */
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        return next(new AppError_1.AppError("User already exists", 400));
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    await User_1.default.create({
        name,
        email,
        password: hashedPassword,
        role,
    });
    res.status(201).json({
        success: true,
        message: "User registered successfully",
    });
});
/* ============================= */
/* LOGIN                        */
/* ============================= */
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        return next(new AppError_1.AppError("Invalid credentials", 401));
    }
    if (!user.password) {
        return next(new AppError_1.AppError("This account uses Google or GitHub sign-in. Please continue with that provider.", 401));
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return next(new AppError_1.AppError("Invalid credentials", 401));
    }
    const token = signToken(String(user._id), user.role);
    res.status(200).json({ success: true, token });
});
/* ============================= */
/* GET ME                       */
/* ============================= */
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const user = await User_1.default.findById(req.user.userId).select("-password");
    if (!user) {
        return next(new AppError_1.AppError("User not found", 404));
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
});
/* ============================= */
/* GOOGLE OAUTH                 */
/* ============================= */
const googleRedirect = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account",
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};
exports.googleRedirect = googleRedirect;
exports.googleCallback = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { code } = req.query;
    if (!code) {
        return next(new AppError_1.AppError("No code provided", 400));
    }
    // Exchange code for tokens
    const tokenRes = await axios_1.default.post("https://oauth2.googleapis.com/token", new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
    }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    const { access_token } = tokenRes.data;
    // Get user info
    const userInfoRes = await axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${access_token}` } });
    const { id, email, name, picture } = userInfoRes.data;
    // Find or create user
    let user = await User_1.default.findOne({
        $or: [{ googleId: id }, { email }],
    });
    if (!user) {
        user = await User_1.default.create({
            name,
            email,
            googleId: id,
            avatarUrl: picture,
            role: "student",
        });
    }
    else if (!user.googleId) {
        // Existing email account — link Google to it
        user.googleId = id;
        if (!user.avatarUrl)
            user.avatarUrl = picture;
        await user.save();
    }
    const token = signToken(String(user._id), user.role);
    sendTokenRedirect(res, token);
});
/* ============================= */
/* GITHUB OAUTH                 */
/* ============================= */
const githubRedirect = (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
        scope: "user:email",
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
};
exports.githubRedirect = githubRedirect;
exports.githubCallback = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    var _a;
    const { code } = req.query;
    if (!code) {
        return next(new AppError_1.AppError("No code provided", 400));
    }
    // Exchange code for access token
    const tokenRes = await axios_1.default.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
    }, { headers: { Accept: "application/json" } });
    const { access_token } = tokenRes.data;
    // Get user profile
    const userRes = await axios_1.default.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${access_token}` },
    });
    // GitHub may not expose email publicly — fetch separately
    const emailsRes = await axios_1.default.get("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${access_token}` },
    });
    const primaryEmail = (_a = emailsRes.data.find((e) => e.primary && e.verified)) === null || _a === void 0 ? void 0 : _a.email;
    if (!primaryEmail) {
        return next(new AppError_1.AppError("No verified email found on your GitHub account.", 400));
    }
    const { id, name, avatar_url, login } = userRes.data;
    let user = await User_1.default.findOne({
        $or: [{ githubId: String(id) }, { email: primaryEmail }],
    });
    if (!user) {
        user = await User_1.default.create({
            name: name || login,
            email: primaryEmail,
            githubId: String(id),
            avatarUrl: avatar_url,
            role: "student",
        });
    }
    else if (!user.githubId) {
        user.githubId = String(id);
        if (!user.avatarUrl)
            user.avatarUrl = avatar_url;
        await user.save();
    }
    const token = signToken(String(user._id), user.role);
    sendTokenRedirect(res, token);
});
/* ============================= */
/* FORGOT PASSWORD              */
/* ============================= */
exports.forgotPassword = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { email } = req.body;
    const user = await User_1.default.findOne({ email });
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
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const hashedToken = crypto_1.default
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
        await (0, sendEmail_1.sendEmail)({ to: email, subject: "Reset your SkillTrack password", html });
    }
    catch {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        return next(new AppError_1.AppError("Failed to send email. Please try again.", 500));
    }
    res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent.",
    });
});
/* ============================= */
/* RESET PASSWORD               */
/* ============================= */
exports.resetPassword = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { token, email, password } = req.body;
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User_1.default.findOne({
        email,
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
        return next(new AppError_1.AppError("Invalid or expired reset token.", 400));
    }
    user.password = await bcryptjs_1.default.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password reset successfully. You can now log in.",
    });
});
