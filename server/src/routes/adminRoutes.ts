import { Router } from "express";
import { getAnalytics } from "../controllers/adminController";
import { protect, allowRoles } from "../middleware/authMiddleware";

const router = Router();

router.get("/analytics", protect, allowRoles("admin"), getAnalytics);

export default router;