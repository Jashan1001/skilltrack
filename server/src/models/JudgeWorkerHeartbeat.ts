import { Schema, model } from "mongoose";

const JudgeWorkerHeartbeatSchema = new Schema(
  {
    workerId: { type: String, required: true, unique: true },
    lastSeenAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export default model("JudgeWorkerHeartbeat", JudgeWorkerHeartbeatSchema);
