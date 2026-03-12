"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/analytics", authMiddleware_1.protect, (0, authMiddleware_1.allowRoles)("admin"), adminController_1.getAnalytics);
exports.default = router;
