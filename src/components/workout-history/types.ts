// src/components/workout-history/types.ts
// קובץ זה מכיל את כל הטיפוסים והקבועים לניהול היסטוריית אימונים

import { Workout } from "../../types/workout";

// ממשק לסינון היסטוריית אימונים - מאפשר סינון לפי תקופה, דירוג, משך ועוד
export interface WorkoutHistoryFilters {
  dateRange?: "week" | "month" | "3months" | "all";
  planId?: string;
  exerciseType?: string;
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
}

// ממשק לנתוני סטטיסטיקה של אימונים - מציג נתונים מסוכמים
export interface WorkoutStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  totalDuration: number;
  averageRating: number;
}

// ממשק לכרטיס אימון
export interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onLongPress: () => void;
  index: number;
}

// enum למיון אימונים
export enum WorkoutSortBy {
  DATE_DESC = "date_desc",
  DATE_ASC = "date_asc",
  DURATION_DESC = "duration_desc",
  DURATION_ASC = "duration_asc",
  EXERCISES_DESC = "exercises_desc",
  EXERCISES_ASC = "exercises_asc",
}

// פלטת צבעים מודרנית למסך ההיסטוריה - עיצוב אחיד ומקצועי
export const modernColors = {
  primary: "#007AFF",
  primaryGradient: ["#007AFF", "#0051D5"],
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  danger: "#FF3B30",
  surface: "#F2F2F7",
  cardBg: "#FFFFFF",
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  muted: "#8E8E93",
  border: "#E5E5EA",
  shadow: "#000000",
};

// ייצוא כל הטיפוסים בצורה נוחה
export type { Workout };
