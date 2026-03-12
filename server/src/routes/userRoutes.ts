import { Router } from "express";
import {
  getUserProgress,
  getPublicProfile,
  toggleBookmark,
  getBookmarks,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/progress", protect, getUserProgress);
router.get("/bookmarks", protect, getBookmarks);
router.post("/bookmark/:problemId", protect, toggleBookmark);
router.get("/:userId", protect, getPublicProfile);

export default router;