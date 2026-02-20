import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";

const router = Router();

//Register new user
router.post("/register", registerUser);

//Login user
router.post("/login", loginUser);

export default router;