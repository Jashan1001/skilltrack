import { Router } from "express";
import {
  register,
  login,
  getMe,
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback,
  exchangeOAuthTicket,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, oauthExchangeSchema, verifyEmailSchema, resendVerificationSchema } from "../validators/schemas";
import { loginAttemptLimiter, registrationEmailLimiter, verificationEmailLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", validate(registerSchema), registrationEmailLimiter, register);
router.post("/login", validate(loginSchema), loginAttemptLimiter, login);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/verify-email/resend", verificationEmailLimiter, validate(resendVerificationSchema), resendVerificationEmail);
router.get("/me", protect, getMe);

router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);

router.get("/github", githubRedirect);
router.get("/github/callback", githubCallback);
router.post("/oauth/exchange", validate(oauthExchangeSchema), exchangeOAuthTicket);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;

