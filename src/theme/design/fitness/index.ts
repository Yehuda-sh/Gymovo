// src/theme/design/fitness/index.ts
// טוקנים מיוחדים לאפליקציית כושר

import { colors } from "../../colors";
import { spacing } from "../spacing";
import { borderRadius } from "../tokens";
import { ViewStyle } from "react-native";

/**
 * צבעי קושי תרגילים
 */
export const difficultyColors = {
  beginner: {
    color: colors.success,
    background: colors.success + "15",
    border: colors.success + "30",
    shadow: colors.success + "20",
  },
  intermediate: {
    color: colors.warning,
    background: colors.warning + "15",
    border: colors.warning + "30",
    shadow: colors.warning + "20",
  },
  advanced: {
    color: colors.error,
    background: colors.error + "15",
    border: colors.error + "30",
    shadow: colors.error + "20",
  },
} as const;

/**
 * צבעי אינטנסיביות אימון
 */
export const intensityColors = {
  low: colors.success,
  medium: colors.warning,
  high: colors.error,
  extreme: "#ff6b35",
} as const;

/**
 * צבעי התקדמות
 */
export const progressColors = {
  incomplete: colors.text + "30",
  inProgress: colors.primary,
  complete: colors.success,
  skipped: colors.text + "60",
} as const;

/**
 * צבעי סוגי תרגילים
 */
export const exerciseTypeColors = {
  strength: {
    primary: colors.primary,
    secondary: colors.primary + "20",
    icon: colors.primary,
  },
  cardio: {
    primary: colors.error,
    secondary: colors.error + "20",
    icon: colors.error,
  },
  flexibility: {
    primary: colors.success,
    secondary: colors.success + "20",
    icon: colors.success,
  },
  balance: {
    primary: colors.warning,
    secondary: colors.warning + "20",
    icon: colors.warning,
  },
  sports: {
    primary: colors.info,
    secondary: colors.info + "20",
    icon: colors.info,
  },
} as const;

/**
 * צבעי קבוצות שרירים
 */
export const muscleGroupColors = {
  chest: "#ff6b6b",
  back: "#4ecdc4",
  shoulders: "#45b7d1",
  arms: "#96ceb4",
  legs: "#ffeaa7",
  core: "#dda0dd",
  glutes: "#ff9ff3",
  calves: "#74b9ff",
  forearms: "#6c5ce7",
  traps: "#fd79a8",
} as const;

/**
 * גדלים לרכיבי כושר
 */
export const fitnessSizes = {
  // Exercise cards
  exerciseCard: {
    height: 120,
    minHeight: 100,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },

  // Set inputs
  setInput: {
    width: 60,
    height: 40,
    borderRadius: borderRadius.sm,
  },

  // Weight inputs
  weightInput: {
    width: 80,
    height: 40,
    borderRadius: borderRadius.sm,
  },

  // Reps inputs
  repsInput: {
    width: 60,
    height: 40,
    borderRadius: borderRadius.sm,
  },

  // Progress indicators
  progressBar: {
    height: 6,
    borderRadius: borderRadius.full,
  },

  progressCircle: {
    size: 60,
    strokeWidth: 4,
  },

  // Timer display
  timer: {
    width: 200,
    height: 120,
    borderRadius: borderRadius.xl,
  },

  // Stat cards
  statCard: {
    width: 100,
    height: 80,
    borderRadius: borderRadius.md,
  },

  // Workout summary
  workoutSummary: {
    padding: spacing.xxl,
    borderRadius: borderRadius.lg,
  },
} as const;

/**
 * צבעי סטטוס אימון
 */
export const workoutStatusColors = {
  notStarted: {
    background: colors.surface + "40",
    border: colors.border,
    text: colors.text + "60",
    icon: colors.text + "40",
  },
  inProgress: {
    background: colors.primary + "10",
    border: colors.primary + "40",
    text: colors.primary,
    icon: colors.primary,
  },
  completed: {
    background: colors.success + "10",
    border: colors.success + "40",
    text: colors.success,
    icon: colors.success,
  },
  paused: {
    background: colors.warning + "10",
    border: colors.warning + "40",
    text: colors.warning,
    icon: colors.warning,
  },
  failed: {
    background: colors.error + "10",
    border: colors.error + "40",
    text: colors.error,
    icon: colors.error,
  },
} as const;

/**
 * צבעי סטטוס סטים
 */
export const setStatusColors = {
  pending: {
    background: colors.surface + "20",
    border: colors.border,
    text: colors.text + "60",
    icon: colors.text + "40",
  },
  current: {
    background: colors.primary + "10",
    border: colors.primary + "40",
    text: colors.primary,
    icon: colors.primary,
  },
  completed: {
    background: colors.success + "10",
    border: colors.success + "40",
    text: colors.success,
    icon: colors.success,
  },
  skipped: {
    background: colors.text + "10",
    border: colors.text + "20",
    text: colors.text + "60",
    icon: colors.text + "40",
  },
} as const;

/**
 * סגנונות עבור רכיבי כושר
 */
export const fitnessStyles = {
  // Workout card
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,

  // Exercise item
  exerciseItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,

  // Set row
  setRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,

  // Progress container
  progressContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
  } as ViewStyle,

  // Stats container
  statsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  } as ViewStyle,

  // Timer container
  timerContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  } as ViewStyle,
} as const;

/**
 * אנימציות עבור רכיבי כושר
 */
export const fitnessAnimations = {
  setComplete: {
    duration: 300,
    type: "spring",
    damping: 15,
  },

  workoutComplete: {
    duration: 500,
    type: "spring",
    damping: 10,
  },

  progressUpdate: {
    duration: 400,
    type: "timing",
  },

  timerTick: {
    duration: 100,
    type: "timing",
  },
} as const;

/**
 * פונקציה לקבלת צבע עבור קבוצת שרירים
 * @param muscleGroup - שם קבוצת השרירים
 * @returns צבע הקבוצה
 */
export const getMuscleGroupColor = (
  muscleGroup: keyof typeof muscleGroupColors
): string => {
  return muscleGroupColors[muscleGroup] || colors.text;
};

/**
 * פונקציה לקבלת צבע עבור רמת קושי
 * @param difficulty - רמת הקושי
 * @returns צבעי הקושי
 */
export const getDifficultyColor = (
  difficulty: keyof typeof difficultyColors
) => {
  return difficultyColors[difficulty];
};

/**
 * פונקציה לקבלת צבע עבור סוג תרגיל
 * @param type - סוג התרגיל
 * @returns צבעי הסוג
 */
export const getExerciseTypeColor = (type: keyof typeof exerciseTypeColors) => {
  return exerciseTypeColors[type] || exerciseTypeColors.strength;
};

/**
 * פונקציה לקבלת צבע עבור אינטנסיביות
 * @param intensity - רמת האינטנסיביות
 * @returns צבע האינטנסיביות
 */
export const getIntensityColor = (
  intensity: keyof typeof intensityColors
): string => {
  return intensityColors[intensity];
};
