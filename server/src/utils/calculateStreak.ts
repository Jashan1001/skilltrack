export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastSubmissionDate: Date | null;
}

export interface UpdatedStreakState {
  currentStreak: number;
  longestStreak: number;
  lastSubmissionDate: Date;
}

export const calculateNewStreak = (
  state: StreakState,
  now: Date
): UpdatedStreakState => {
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const lastDate = state.lastSubmissionDate
    ? new Date(state.lastSubmissionDate)
    : null;

  if (lastDate) {
    lastDate.setUTCHours(0, 0, 0, 0);
  }

  let newStreak = state.currentStreak;

  if (!lastDate || lastDate < yesterday) {
    newStreak = 1;
  } else if (lastDate.getTime() === yesterday.getTime()) {
    newStreak = state.currentStreak + 1;
  }

  const newLongest = Math.max(newStreak, state.longestStreak);

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastSubmissionDate: now,
  };
};
