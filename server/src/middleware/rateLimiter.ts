import rateLimit from "express-rate-limit";

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per IP
  message: {
    message: "Too many requests. Please try again later."
  }
});

// Submission-specific limiter
export const submissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5, // 5 submissions per minute
  message: {
    message: "Submission limit exceeded. Please wait before submitting again."
  }
});