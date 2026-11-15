import { randomUUID } from "crypto";
import os from "os";
import { setTimeout as delay } from "timers/promises";
import JudgeWorkerHeartbeat from "../models/JudgeWorkerHeartbeat";
import Problem from "../models/Problem";
import Submission, { ISubmission } from "../models/Submission";
import User from "../models/User";
import { JudgeCancelledError, JudgeInfrastructureError, evaluateTestCases } from "./evaluateSolution";
import { calculateNewStreak } from "../utils/calculateStreak";

const LEASE_MS = 90_000;
const HEARTBEAT_MS = 15_000;
const MAX_ATTEMPTS = 3;
const IDLE_POLL_MS = 750;

class PermanentJudgeError extends Error {}

const claimNextSubmission = async () => {
  const now = new Date();
  const lockToken = randomUUID();
  const submission = await Submission.findOneAndUpdate(
    {
      $or: [
        { jobState: "queued", availableAt: { $lte: now } },
        {
          jobState: "running",
          lockedUntil: { $lte: now },
          attempts: { $lt: MAX_ATTEMPTS },
        },
      ],
    },
    {
      $set: {
        jobState: "running",
        lockToken,
        lockedUntil: new Date(now.getTime() + LEASE_MS),
        startedAt: now,
      },
      $inc: { attempts: 1 },
    },
    { new: true, sort: { createdAt: 1 } }
  )
    .select("+lockToken")
    .exec();

  if (!submission) return null;
  return { submission, lockToken };
};

const extendLease = async (submissionId: ISubmission["_id"], lockToken: string) => {
  await Submission.updateOne(
    { _id: submissionId, jobState: "running", lockToken },
    { $set: { lockedUntil: new Date(Date.now() + LEASE_MS) } }
  );
};

const updateStreak = async (userId: ISubmission["user"]) => {
  const user = await User.findById(userId).select("+activeJudgeJobs");
  if (!user) return;

  const updated = calculateNewStreak(
    {
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      lastSubmissionDate: user.lastSubmissionDate || null,
    },
    new Date()
  );

  user.currentStreak = updated.currentStreak;
  user.longestStreak = updated.longestStreak;
  user.lastSubmissionDate = updated.lastSubmissionDate;
  await user.save();
};

const failOrRetry = async (
  submission: ISubmission,
  lockToken: string,
  error: unknown
) => {
  const retryable = !(error instanceof PermanentJudgeError);
  const canRetry = retryable && submission.attempts < MAX_ATTEMPTS;
  const message =
    error instanceof PermanentJudgeError
      ? error.message
      : error instanceof JudgeInfrastructureError
        ? "The judge is temporarily unavailable. This submission will be retried."
        : "The judge could not complete this submission.";

  if (canRetry) {
    const backoffMs = Math.min(60_000, 15_000 * 2 ** (submission.attempts - 1));
    await Submission.updateOne(
      { _id: submission._id, jobState: "running", lockToken },
      {
        $set: {
          jobState: "queued",
          availableAt: new Date(Date.now() + backoffMs),
          errorMessage: message,
        },
        $unset: { lockToken: 1, lockedUntil: 1 },
      }
    );
    return;
  }

  await Submission.updateOne(
    { _id: submission._id, jobState: "running", lockToken },
    {
      $set: {
        jobState: "failed",
        status: "runtime_error",
        errorMessage:
          error instanceof PermanentJudgeError
            ? error.message
            : "The judge could not complete this submission after several attempts.",
        completedAt: new Date(),
      },
      $unset: { lockToken: 1, lockedUntil: 1 },
    }
  );
};

const processOne = async (): Promise<boolean> => {
  const expiredAt = new Date();
  const exhausted = await Submission.find({
    jobState: "running",
    lockedUntil: { $lte: expiredAt },
    attempts: { $gte: MAX_ATTEMPTS },
  })
    .limit(25)
    .exec();

  for (const staleJob of exhausted) {
    await Submission.updateOne(
      {
        _id: staleJob._id,
        jobState: "running",
        lockedUntil: { $lte: expiredAt },
        attempts: { $gte: MAX_ATTEMPTS },
      },
      {
        $set: {
          jobState: "failed",
          status: "runtime_error",
          errorMessage: "The judge stopped before completing this submission.",
          completedAt: new Date(),
        },
        $unset: { lockToken: 1, lockedUntil: 1 },
      }
    );
  }

  const claim = await claimNextSubmission();
  if (!claim) return false;

  const { submission, lockToken } = claim;
  const leaseTimer = setInterval(() => {
    void extendLease(submission._id, lockToken).catch(() => {
      // If MongoDB is briefly unavailable, the lease can be recovered after
      // expiry. The completion update still checks the claim token.
    });
  }, Math.floor(LEASE_MS / 3));

  try {
    const problem = await Problem.findById(submission.problem).select(
      "privateTestCases evaluationType"
    );
    if (!problem || problem.privateTestCases.length === 0) {
      throw new PermanentJudgeError("The problem test suite is unavailable.");
    }

    const evaluation = await evaluateTestCases(
      problem.privateTestCases,
      submission.code || "",
      submission.language,
      problem.evaluationType,
      async () => !(await Submission.exists({
        _id: submission._id,
        jobState: "running",
        lockToken,
      }))
    );
    const score =
      evaluation.verdict === "accepted"
        ? 100
        : Math.round((evaluation.passed / evaluation.total) * 100);

    const completed = await Submission.findOneAndUpdate(
      { _id: submission._id, jobState: "running", lockToken },
      {
        $set: {
          jobState: "completed",
          status: evaluation.verdict,
          score,
          runtime: evaluation.runtime,
          totalTestCases: evaluation.total,
          passedTestCases: evaluation.passed,
          errorMessage: "",
          completedAt: new Date(),
        },
        $unset: { lockToken: 1, lockedUntil: 1 },
      },
      { new: true }
    );

    // A worker whose lease expired must not overwrite a newer worker's result.
    if (completed) {
      if (completed.status === "accepted") await updateStreak(completed.user);
    }
  } catch (error) {
    if (error instanceof JudgeCancelledError) return true;
    console.error("Judge job failed", {
      submissionId: submission._id.toString(),
      attempt: submission.attempts,
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    await failOrRetry(submission, lockToken, error);
  } finally {
    clearInterval(leaseTimer);
  }

  return true;
};

const recordHeartbeat = async (workerId: string) => {
  await JudgeWorkerHeartbeat.updateOne(
    { workerId },
    { $set: { lastSeenAt: new Date() } },
    { upsert: true }
  );
};

export const runJudgeWorker = async (workerId = `${os.hostname()}-${process.pid}`) => {
  let stopping = false;
  const stop = () => {
    stopping = true;
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  await Promise.all([
    Submission.createIndexes(),
    JudgeWorkerHeartbeat.createIndexes(),
  ]);
  await recordHeartbeat(workerId);
  let heartbeatInFlight = false;
  const heartbeatTimer = setInterval(() => {
    if (heartbeatInFlight) return;
    heartbeatInFlight = true;
    void recordHeartbeat(workerId)
      .catch(() => console.error("Judge worker heartbeat update failed"))
      .finally(() => {
        heartbeatInFlight = false;
      });
  }, HEARTBEAT_MS);

  console.log(`Judge worker ${workerId} started`);
  try {
    while (!stopping) {
      try {
        const processed = await processOne();
        if (!processed) await delay(IDLE_POLL_MS);
      } catch (error) {
        console.error("Judge worker poll failed", {
          errorType: error instanceof Error ? error.name : "UnknownError",
        });
        await delay(2_000);
      }
    }
  } finally {
    clearInterval(heartbeatTimer);
    process.removeListener("SIGINT", stop);
    process.removeListener("SIGTERM", stop);
    await JudgeWorkerHeartbeat.deleteOne({ workerId });
    console.log(`Judge worker ${workerId} stopped`);
  }
};
