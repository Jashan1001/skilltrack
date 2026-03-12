import rateLimit from "express-rate-limit";

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// Submission-specific limiter
export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message: "Submission limit exceeded. Please wait before submitting again.",
  },
});

// ✅ Run-specific limiter (more generous than submit, but still bounded)
export const runLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    message: "Run limit exceeded. Please wait a moment before running again.",
  },
});