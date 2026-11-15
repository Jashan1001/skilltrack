"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const problemRoutes_1 = __importDefault(require("./routes/problemRoutes"));
const submissionRoutes_1 = __importDefault(require("./routes/submissionRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const runRoutes_1 = __importDefault(require("./routes/runRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const errorHandler_1 = require("./middleware/errorHandler");
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
/* ============================= */
/* Trust Proxy (Render support) */
/* ============================= */
app.set("trust proxy", 1);
/* ============================= */
/* CORS Configuration           */
/* ============================= */
const allowedOrigins = [
    "http://localhost:5173",
    "https://skilltrack-delta.vercel.app",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow server-to-server or curl requests
        if (!origin)
            return callback(null, true);
        // allow localhost
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // allow ANY vercel preview deployment
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
/* ============================= */
/* Security Middleware          */
/* ============================= */
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
/* ============================= */
/* Body Parser                  */
/* ============================= */
app.use(express_1.default.json({ limit: "50kb" }));
/* ============================= */
/* Routes                       */
/* ============================= */
app.use("/api/auth", authRoutes_1.default);
app.use("/api/problems", problemRoutes_1.default);
app.use("/api/submissions", submissionRoutes_1.default);
app.use("/api/leaderboard", leaderboardRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/run", runRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
/* ============================= */
/* Health Check Route           */
/* ============================= */
app.get("/", (req, res) => {
    res.send("SkillTrack API is running 🚀");
});
app.get("/health", async (req, res) => {
    const dbState = mongoose_1.default.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus = dbState === 1 ? "connected" : "disconnected";
    const status = dbState === 1 ? "ok" : "degraded";
    res.status(dbState === 1 ? 200 : 503).json({
        status,
        timestamp: new Date().toISOString(),
        services: {
            database: dbStatus,
        },
    });
});
/* Example protected route */
app.get("/api/test/protected", authMiddleware_1.protect, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        user: req.user,
    });
});
/* ============================= */
/* Global Error Handler         */
/* ============================= */
app.use(errorHandler_1.globalErrorHandler);
/* ============================= */
/* Database + Server Start      */
/* ============================= */
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("MongoDB connection failed:", error);
});
