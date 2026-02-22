import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  code: string;
  language: "javascript" | "python" | "cpp";
  status: "pending" | "accepted" | "rejected";
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["javascript", "python", "cpp"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔍 Helpful compound index for fast lookups
SubmissionSchema.index({ user: 1, problem: 1, createdAt: -1 });

export default mongoose.model<ISubmission>("Submission", SubmissionSchema);