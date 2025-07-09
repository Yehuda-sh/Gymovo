// src/theme/design/status/index.ts
// צבעי סטטוס והודעות

import { colors } from "../../colors";

/**
 * צבעי סטטוס בסיסיים
 */
export const statusColors = {
  success: {
    main: colors.success,
    background: colors.success + "10",
    border: colors.success + "40",
    text: colors.success,
    icon: colors.success,
  },

  warning: {
    main: colors.warning,
    background: colors.warning + "10",
    border: colors.warning + "40",
    text: colors.warning,
    icon: colors.warning,
  },

  error: {
    main: colors.error,
    background: colors.error + "10",
    border: colors.error + "40",
    text: colors.error,
    icon: colors.error,
  },

  info: {
    main: colors.info,
    background: colors.info + "10",
    border: colors.info + "40",
    text: colors.info,
    icon: colors.info,
  },

  neutral: {
    main: colors.text,
    background: colors.surface + "20",
    border: colors.border,
    text: colors.text,
    icon: colors.text,
  },
} as const;

/**
 * טיפוס עבור מפתחות סטטוס
 */
export type StatusType = keyof typeof statusColors;

/**
 * צבעי סטטוס עבור מרכיבי כושר
 */
export const fitnessStatusColors = {
  // Workout status
  workoutNotStarted: {
    main: colors.text + "60",
    background: colors.surface + "20",
    border: colors.border,
    text: colors.text + "80",
    icon: colors.text + "60",
  },

  workoutInProgress: {
    main: colors.primary,
    background: colors.primary + "10",
    border: colors.primary + "40",
    text: colors.primary,
    icon: colors.primary,
  },

  workoutCompleted: {
    main: colors.success,
    background: colors.success + "10",
    border: colors.success + "40",
    text: colors.success,
    icon: colors.success,
  },

  workoutPaused: {
    main: colors.warning,
    background: colors.warning + "10",
    border: colors.warning + "40",
    text: colors.warning,
    icon: colors.warning,
  },

  workoutFailed: {
    main: colors.error,
    background: colors.error + "10",
    border: colors.error + "40",
    text: colors.error,
    icon: colors.error,
  },

  // Exercise difficulty
  beginnerDifficulty: {
    main: colors.success,
    background: colors.success + "15",
    border: colors.success + "30",
    text: colors.success,
    icon: colors.success,
  },

  intermediateDifficulty: {
    main: colors.warning,
    background: colors.warning + "15",
    border: colors.warning + "30",
    text: colors.warning,
    icon: colors.warning,
  },

  advancedDifficulty: {
    main: colors.error,
    background: colors.error + "15",
    border: colors.error + "30",
    text: colors.error,
    icon: colors.error,
  },

  // Set status
  setIncomplete: {
    main: colors.text + "40",
    background: colors.surface + "20",
    border: colors.border,
    text: colors.text + "60",
    icon: colors.text + "40",
  },

  setInProgress: {
    main: colors.primary,
    background: colors.primary + "10",
    border: colors.primary + "40",
    text: colors.primary,
    icon: colors.primary,
  },

  setCompleted: {
    main: colors.success,
    background: colors.success + "10",
    border: colors.success + "40",
    text: colors.success,
    icon: colors.success,
  },

  setSkipped: {
    main: colors.text + "60",
    background: colors.surface + "20",
    border: colors.border,
    text: colors.text + "80",
    icon: colors.text + "60",
  },
} as const;

/**
 * צבעי אינטנסיביות אימון
 */
export const intensityColors = {
  low: {
    main: colors.success,
    background: colors.success + "15",
    border: colors.success + "30",
    text: colors.success,
    icon: colors.success,
  },

  medium: {
    main: colors.warning,
    background: colors.warning + "15",
    border: colors.warning + "30",
    text: colors.warning,
    icon: colors.warning,
  },

  high: {
    main: colors.error,
    background: colors.error + "15",
    border: colors.error + "30",
    text: colors.error,
    icon: colors.error,
  },

  extreme: {
    main: "#ff6b35",
    background: "#ff6b3515",
    border: "#ff6b3530",
    text: "#ff6b35",
    icon: "#ff6b35",
  },
} as const;

/**
 * צבעי התקדמות
 */
export const progressColors = {
  notStarted: {
    main: colors.text + "30",
    background: colors.surface + "20",
    border: colors.border,
    text: colors.text + "60",
    icon: colors.text + "30",
  },

  started: {
    main: colors.primary + "80",
    background: colors.primary + "10",
    border: colors.primary + "40",
    text: colors.primary,
    icon: colors.primary + "80",
  },

  inProgress: {
    main: colors.primary,
    background: colors.primary + "10",
    border: colors.primary + "40",
    text: colors.primary,
    icon: colors.primary,
  },

  nearComplete: {
    main: colors.warning,
    background: colors.warning + "10",
    border: colors.warning + "40",
    text: colors.warning,
    icon: colors.warning,
  },

  complete: {
    main: colors.success,
    background: colors.success + "10",
    border: colors.success + "40",
    text: colors.success,
    icon: colors.success,
  },

  overdue: {
    main: colors.error,
    background: colors.error + "10",
    border: colors.error + "40",
    text: colors.error,
    icon: colors.error,
  },
} as const;

/**
 * פונקציה לקבלת צבעי סטטוס
 * @param status - סוג הסטטוס
 * @returns צבעי הסטטוס
 */
export const getStatusColors = (status: StatusType) => {
  return statusColors[status];
};

/**
 * פונקציה לקבלת צבע עבור אחוז התקדמות
 * @param percentage - אחוז התקדמות (0-100)
 * @returns צבעי התקדמות מתאימים
 */
export const getProgressColors = (percentage: number) => {
  if (percentage === 0) return progressColors.notStarted;
  if (percentage < 25) return progressColors.started;
  if (percentage < 75) return progressColors.inProgress;
  if (percentage < 100) return progressColors.nearComplete;
  return progressColors.complete;
};

/**
 * פונקציה לקבלת צבע עבור רמת קושי
 * @param difficulty - רמת קושי
 * @returns צבעי הקושי
 */
export const getDifficultyColors = (
  difficulty: "beginner" | "intermediate" | "advanced"
) => {
  switch (difficulty) {
    case "beginner":
      return fitnessStatusColors.beginnerDifficulty;
    case "intermediate":
      return fitnessStatusColors.intermediateDifficulty;
    case "advanced":
      return fitnessStatusColors.advancedDifficulty;
    default:
      return fitnessStatusColors.beginnerDifficulty;
  }
};

/**
 * פונקציה לקבלת צבע עבור אינטנסיביות
 * @param intensity - רמת אינטנסיביות
 * @returns צבעי האינטנסיביות
 */
export const getIntensityColors = (intensity: keyof typeof intensityColors) => {
  return intensityColors[intensity];
};
