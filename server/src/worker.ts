import dotenv from "dotenv";
import mongoose from "mongoose";
import { runJudgeWorker } from "./services/judgeWorker";

dotenv.config();

const start = async () => {
  const required = ["MONGO_URI", "EXECUTION_ENGINE_URL", "INTERNAL_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  if ((process.env.INTERNAL_SECRET || "").length < 32) {
    throw new Error("INTERNAL_SECRET must be at least 32 characters long");
  }
  const executionUrl = new URL(process.env.EXECUTION_ENGINE_URL as string);
  if (executionUrl.protocol !== "http:" && executionUrl.protocol !== "https:") {
    throw new Error("EXECUTION_ENGINE_URL must use HTTP or HTTPS");
  }

  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Judge worker connected to MongoDB");
  await runJudgeWorker();
  await mongoose.disconnect();
};

void start().catch(async (error: unknown) => {
  console.error("Judge worker could not start", {
    errorType: error instanceof Error ? error.name : "UnknownError",
  });
  await mongoose.disconnect();
  process.exitCode = 1;
});
