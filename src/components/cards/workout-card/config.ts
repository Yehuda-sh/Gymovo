// src/components/cards/workout-card/config.ts
// קונפיגורציה מרכזית לכל רכיבי WorkoutCard

import { colors } from "../../../theme/colors";

/**
 * רמות קושי
 */
export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

/**
 * רמות אינטנסיביות
 */
export enum IntensityLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  EXTREME = "extreme",
}

/**
 * קונפיגורציית רמות קושי
 */
export const DIFFICULTY_CONFIG = {
  [DifficultyLevel.BEGINNER]: {
    color: "#4CAF50",
    text: "מתחיל",
    icon: "leaf" as const,
  },
  [DifficultyLevel.INTERMEDIATE]: {
    color: "#FF9800",
    text: "בינוני",
    icon: "flash" as const,
  },
  [DifficultyLevel.ADVANCED]: {
    color: "#F44336",
    text: "מתקדם",
    icon: "flame" as const,
  },
  default: {
    color: "#757575",
    text: "לא מוגדר",
    icon: "help-circle-outline" as const,
  },
} as const;

/**
 * קונפיגורציית רמות אינטנסיביות
 */
export const INTENSITY_CONFIG = {
  thresholds: {
    [IntensityLevel.LOW]: { min: 0, max: 40 },
    [IntensityLevel.MEDIUM]: { min: 40, max: 60 },
    [IntensityLevel.HIGH]: { min: 60, max: 80 },
    [IntensityLevel.EXTREME]: { min: 80, max: 100 },
  },
  colors: {
    [IntensityLevel.LOW]: "#8e8e93",
    [IntensityLevel.MEDIUM]: colors.success,
    [IntensityLevel.HIGH]: colors.warning,
    [IntensityLevel.EXTREME]: colors.error,
  },
  labels: {
    [IntensityLevel.LOW]: "קלה",
    [IntensityLevel.MEDIUM]: "נמוכה",
    [IntensityLevel.HIGH]: "בינונית",
    [IntensityLevel.EXTREME]: "גבוהה",
  },
  gradients: {
    [IntensityLevel.LOW]: ["#43e97b", "#38f9d7"],
    [IntensityLevel.MEDIUM]: ["#4facfe", "#00f2fe"],
    [IntensityLevel.HIGH]: ["#f093fb", "#f5576c"],
    [IntensityLevel.EXTREME]: ["#f43f5e", "#dc2626"],
  },
} as const;

/**
 * קונפיגורציית גדלים
 */
export const SIZE_CONFIG = {
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
    iconSize: 10,
    borderRadius: 10,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 10,
    iconSize: 12,
    borderRadius: 12,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    fontSize: 12,
    iconSize: 16,
    borderRadius: 14,
  },
} as const;

/**
 * קונפיגורציית אנימציות
 */
export const ANIMATION_CONFIG = {
  entrance: {
    duration: 300,
    delayIncrement: 50,
  },
  press: {
    scaleIn: 0.98,
    scaleOut: 1,
    tension: 100,
    friction: 8,
  },
} as const;

/**
 * מיפוי שרירים לצבעים
 */
export const MUSCLE_COLORS: Record<string, string> = {
  // פלג גוף עליון
  חזה: "#FF6B6B",
  גב: "#4ECDC4",
  כתפיים: "#45B7D1",
  ביצפס: "#F7DC6F",
  טריצפס: "#F5B7B1",
  בטן: "#82E0AA",

  // פלג גוף תחתון
  רגליים: "#85C1E9",
  ישבן: "#BB8FCE",
  שוקיים: "#F8B739",
  ארבע_ראשי: "#76D7C4",

  // אחר
  ליבה: "#AAB7B8",
  אירובי: "#F39C12",
  גמישות: "#A569BD",

  // ברירת מחדל
  default: "#95A5A6",
};

/**
 * פורמטים של תאריכים
 */
export const DATE_FORMATS = {
  relative: {
    today: "היום",
    yesterday: "אתמול",
    daysAgo: (days: number) => `לפני ${days} ימים`,
    weeksAgo: (weeks: number) => `לפני ${weeks} שבועות`,
    monthsAgo: (months: number) => `לפני ${months} חודשים`,
  },
  absolute: {
    short: { day: "numeric", month: "short" } as const,
    long: { day: "numeric", month: "short", year: "numeric" } as const,
  },
} as const;

/**
 * קונפיגורציית דירוגים
 */
export const RATING_CONFIG = {
  colors: {
    5: "#FFD700", // זהב
    4: "#FFA500", // כתום
    3: "#FFEB3B", // צהוב
    2: "#FF9800", // כתום כהה
    1: "#F44336", // אדום
  },
  thresholds: {
    excellent: 4.5,
    veryGood: 4.0,
    good: 3.5,
    average: 3.0,
    belowAverage: 2.5,
  },
  labels: {
    excellent: "מצוין",
    veryGood: "טוב מאוד",
    good: "טוב",
    average: "בינוני",
    belowAverage: "מתחת לממוצע",
    poor: "חלש",
  },
} as const;
export const BASE_STYLES = {
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
  },
  compactCard: {
    padding: 12,
    borderRadius: 12,
  },
  gradientCard: {
    borderRadius: 20,
    padding: 20,
  },
} as const;
