import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import problemRoutes from "./routes/problemRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import userRoutes from "./routes/userRoutes";
import runRoutes from "./routes/runRoutes";

import { protect } from "./middleware/authMiddleware";
import { globalErrorHandler } from "./middleware/errorHandler";
import adminRoutes from "./routes/adminRoutes";
import Submission from "./models/Submission";
import JudgeWorkerHeartbeat from "./models/JudgeWorkerHeartbeat";
dotenv.config();

const app = express();

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

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server or curl requests
      if (!origin) return callback(null, true);

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
  })
);

/* ============================= */
/* Security Middleware          */
/* ============================= */

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* ============================= */
/* Body Parser                  */
/* ============================= */

app.use(express.json({ limit: "250kb" }));

/* ============================= */
/* Routes                       */
/* ============================= */

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/run", runRoutes);
app.use("/api/admin", adminRoutes);

/* ============================= */
/* Health Check Route           */
/* ============================= */

app.get("/", (req, res) => {
  res.send("SkillTrack API is running 🚀");
});

app.get("/health", async (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatus = dbState === 1 ? "connected" : "disconnected";
  const status = dbState === 1 ? "ok" : "degraded";
  let judgeWorkerStatus = "unknown";
  let queuedJobs: number | null = null;
  let runningJobs: number | null = null;

  if (dbState === 1) {
    const heartbeatSince = new Date(Date.now() - 45_000);
    const [heartbeat, queuedCount, runningCount] = await Promise.all([
      JudgeWorkerHeartbeat.exists({ lastSeenAt: { $gte: heartbeatSince } }),
      Submission.countDocuments({ jobState: "queued" }),
      Submission.countDocuments({ jobState: "running" }),
    ]);
    judgeWorkerStatus = heartbeat ? "healthy" : "unavailable";
    queuedJobs = queuedCount;
    runningJobs = runningCount;
  }

  res.status(dbState === 1 ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      judgeWorker: judgeWorkerStatus,
    },
    queue: { queuedJobs, runningJobs },
  });
});

/* Example protected route */

app.get("/api/test/protected", protect, (req: Request, res: Response) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

/* ============================= */
/* Global Error Handler         */
/* ============================= */

app.use(globalErrorHandler);

/* ============================= */
/* Database + Server Start      */
/* ============================= */

const PORT = process.env.PORT || 5000;

export { app };

const startServer = async () => {
  try {
    const required = ["MONGO_URI", "JWT_SECRET", "EXECUTION_ENGINE_URL", "INTERNAL_SECRET"];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }

    if ((process.env.JWT_SECRET || "").length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters long");
    }
    if ((process.env.INTERNAL_SECRET || "").length < 32) {
      throw new Error("INTERNAL_SECRET must be at least 32 characters long");
    }

    const executionUrl = new URL(process.env.EXECUTION_ENGINE_URL as string);
    if (executionUrl.protocol !== "http:" && executionUrl.protocol !== "https:") {
      throw new Error("EXECUTION_ENGINE_URL must use HTTP or HTTPS");
    }

    await mongoose.connect(process.env.MONGO_URI as string);
    await Promise.all([
      Submission.createIndexes(),
      JudgeWorkerHeartbeat.createIndexes(),
    ]);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

if (require.main === module) {
  void startServer();
}
