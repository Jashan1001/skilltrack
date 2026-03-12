import { Router } from "express";
import {
  register,
  login,
  getMe,
  googleRedirect,
  googleCallback,
  githubRedirect,
  githubCallback,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/schemas";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);

router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);

router.get("/github", githubRedirect);
router.get("/github/callback", githubCallback);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;