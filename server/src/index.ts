import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import { protect, allowRoles } from "./middleware/authMiddleware";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("InterviewSphere API is running 🚀");
});

// Protected test route
app.get("/api/test/protected", protect, (req: any, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

// 🔒 Admin only
app.get(
  "/api/test/admin",
  protect,
  allowRoles("admin"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

// 🔒 Recruiter only
app.get(
  "/api/test/recruiter",
  protect,
  allowRoles("recruiter"),
  (req, res) => {
    res.json({
      message: "Welcome Recruiter",
    });
  }
);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
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