import { calculateNewStreak } from "../utils/calculateStreak";

describe("calculateNewStreak", () => {
  const makeDate = (daysAgo: number, now = new Date("2025-06-15T12:00:00Z")) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d;
  };

  const NOW = new Date("2025-06-15T14:00:00Z");

  it("starts streak at 1 when no previous submission", () => {
    const result = calculateNewStreak(
      { currentStreak: 0, longestStreak: 0, lastSubmissionDate: null },
      NOW
    );
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(1);
  });

  it("increments streak when last submission was yesterday", () => {
    const result = calculateNewStreak(
      { currentStreak: 5, longestStreak: 5, lastSubmissionDate: makeDate(1) },
      NOW
    );
    expect(result.currentStreak).toBe(6);
    expect(result.longestStreak).toBe(6);
  });

  it("does not change streak when last submission was today", () => {
    const result = calculateNewStreak(
      { currentStreak: 5, longestStreak: 7, lastSubmissionDate: makeDate(0) },
      NOW
    );
    expect(result.currentStreak).toBe(5);
    expect(result.longestStreak).toBe(7);
  });

  it("resets streak to 1 when last submission was 2 days ago", () => {
    const result = calculateNewStreak(
      { currentStreak: 10, longestStreak: 10, lastSubmissionDate: makeDate(2) },
      NOW
    );
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(10);
  });

  it("resets streak to 1 when last submission was a week ago", () => {
    const result = calculateNewStreak(
      { currentStreak: 3, longestStreak: 8, lastSubmissionDate: makeDate(7) },
      NOW
    );
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(8);
  });

  it("updates longestStreak when new streak exceeds it", () => {
    const result = calculateNewStreak(
      { currentStreak: 9, longestStreak: 9, lastSubmissionDate: makeDate(1) },
      NOW
    );
    expect(result.currentStreak).toBe(10);
    expect(result.longestStreak).toBe(10);
  });

  it("does not update longestStreak when new streak is lower", () => {
    const result = calculateNewStreak(
      { currentStreak: 0, longestStreak: 30, lastSubmissionDate: makeDate(5) },
      NOW
    );
    expect(result.currentStreak).toBe(1);
    expect(result.longestStreak).toBe(30);
  });

  it("sets lastSubmissionDate to the current time", () => {
    const result = calculateNewStreak(
      { currentStreak: 1, longestStreak: 1, lastSubmissionDate: makeDate(1) },
      NOW
    );
    expect(result.lastSubmissionDate).toEqual(NOW);
  });

  it("handles submission exactly at midnight correctly", () => {
    const midnight = new Date("2025-06-15T00:00:00Z");
    const yesterday = new Date("2025-06-14T23:59:59Z");
    const result = calculateNewStreak(
      { currentStreak: 3, longestStreak: 3, lastSubmissionDate: yesterday },
      midnight
    );
    expect(result.currentStreak).toBe(4);
  });
});
