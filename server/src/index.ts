import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes";
import { protect, allowRoles } from "./middleware/authMiddleware";
import problemRoutes from "./routes/problemRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import { globalErrorHandler } from "./middleware/errorHandler";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import userRoutes from "./routes/userRoutes";
import runRoutes from "./routes/runRoutes";

dotenv.config();

const app = express();

/* ============================= */
/* Security & Production Setup  */
/* ============================= */

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

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

app.get("/", (req, res) => {
  res.send("InterviewSphere API is running 🚀");
});

app.get("/api/test/protected", protect, (req: any, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

/* ============================= */
/* Error Handler (Last)         */
/* ============================= */

app.use(globalErrorHandler);

/* ============================= */
/* DB + Server Start            */
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