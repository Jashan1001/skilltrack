import { Router } from "express";
import {
  getUserProgress,
  getPublicProfile,
  toggleBookmark,
  getBookmarks,
  getLearningPlan,
  updateLearningGoal,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/progress", protect, getUserProgress);
router.get("/learning-plan", protect, getLearningPlan);
router.put("/learning-goal", protect, updateLearningGoal);
router.get("/bookmarks", protect, getBookmarks);
router.post("/bookmark/:problemId", protect, toggleBookmark);
router.get("/:userId", protect, getPublicProfile);

export default router;
