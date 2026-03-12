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

app.use(express.json({ limit: "50kb" }));

/* ============================= */
/* Routes                       */
/* ============================= */

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/run", runRoutes);

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

  res.status(dbState === 1 ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
    },
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

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });