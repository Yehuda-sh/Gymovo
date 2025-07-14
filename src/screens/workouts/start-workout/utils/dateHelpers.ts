// src/screens/workouts/start-workout/utils/dateHelpers.ts

export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "עכשיו";
  } else if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`;
  } else if (diffInHours < 24) {
    return `לפני ${diffInHours} שעות`;
  } else if (diffInDays === 1) {
    return "אתמול";
  } else if (diffInDays < 7) {
    return `לפני ${diffInDays} ימים`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `לפני ${weeks} ${weeks === 1 ? "שבוע" : "שבועות"}`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `לפני ${months} ${months === 1 ? "חודש" : "חודשים"}`;
  }
};

export const getDaysSince = (date: Date): number => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};
