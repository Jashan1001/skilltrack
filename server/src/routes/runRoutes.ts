import express from "express";
import { protect, allowRoles } from "../middleware/authMiddleware";
import { runSolution } from "../controllers/runController";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("student", "admin"),
  runSolution
);

export default router;