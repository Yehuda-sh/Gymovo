// src/components/cards/workout-card/utils.ts
// פונקציות עזר עבור WorkoutCard - מערכת צבעים ועיבוד נתונים

import { colors } from "../../../theme/colors";

/**
 * 🎨 פונקציית עזר לצבע שריר
 * מחזירה צבע ייחודי לכל קבוצת שרירים
 */
export const getMuscleColor = (muscle: string): string => {
  const muscleColors: { [key: string]: string } = {
    chest: "#ff6b35",
    back: "#007aff",
    legs: "#fbbf24",
    shoulders: "#8b5cf6",
    arms: "#00ff88",
    core: "#f59e0b",
    biceps: "#00ff88",
    triceps: "#00ff88",
    quadriceps: "#fbbf24",
    hamstrings: "#fbbf24",
    calves: "#fbbf24",
    abs: "#f59e0b",
  };
  return muscleColors[muscle.toLowerCase()] || colors.primary;
};

/**
 * 📊 פונקציית עזר לחישוב נפח אימון
 * מחשבה את הנפח הכולל של האימון (משקל × חזרות)
 */
export const calculateWorkoutVolume = (exercises: any[]): number => {
  return exercises.reduce((total: number, exercise: any) => {
    const exerciseVolume = exercise.sets.reduce(
      (setTotal: number, set: any) => {
        return setTotal + (set.weight || 0) * (set.reps || 0);
      },
      0
    );
    return total + exerciseVolume;
  }, 0);
};

/**
 * 📈 פונקציית עזר לחישוב סה"כ סטים
 * מחשבת את מספר הסטים הכולל באימון
 */
export const calculateTotalSets = (exercises: any[]): number => {
  return exercises.reduce((total: number, exercise: any) => {
    return total + exercise.sets.length;
  }, 0);
};

/**
 * 🔢 פונקציית עזר לעיצוב נפח
 * מעצבת את הנפח בצורה קריאה (1000+ -> 1k)
 */
export const formatVolume = (kg: number): string => {
  if (kg > 1000) return `${(kg / 1000).toFixed(1)}k`;
  return Math.round(kg).toString();
};

/**
 * ⏰ פונקציית עזר לחישוב זמן שעבר
 * מחזירה מחרוזת תיאור זמן באופן ידידותי
 */
export const formatTimeAgo = (date: Date | number | string): string => {
  const targetDate = new Date(date);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - targetDate.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "עכשיו";
  if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
  if (diffInHours < 24 * 7) {
    const days = Math.floor(diffInHours / 24);
    return `לפני ${days} ימים`;
  }
  if (diffInHours < 24 * 30) {
    const weeks = Math.floor(diffInHours / (24 * 7));
    return `לפני ${weeks} שבועות`;
  }
  const months = Math.floor(diffInHours / (24 * 30));
  return `לפני ${months} חודשים`;
};

/**
 * 🎯 פונקציית עזר לחישוב אינטנסיביות אימון
 * מחשבת את רמת האינטנסיביות על בסיס נפח, זמן וסטים (0-100)
 */
export const calculateWorkoutIntensity = (workout: any): number => {
  const totalVolume = calculateWorkoutVolume(workout.exercises);
  const totalSets = calculateTotalSets(workout.exercises);
  const duration = workout.duration || 45;

  // נרמול אינטנסיביות (0-100)
  const volumeScore = Math.min((totalVolume / 1000) * 30, 30);
  const setsScore = Math.min((totalSets / 20) * 40, 40);
  const durationScore = Math.min((duration / 90) * 30, 30);

  return Math.round(volumeScore + setsScore + durationScore);
};

/**
 * 🎨 פונקציית עזר לצבע אינטנסיביות
 * מחזירה צבע בהתאם לרמת האינטנסיביות
 */
export const getIntensityColor = (intensity: number): string => {
  if (intensity >= 80) return colors.error;
  if (intensity >= 60) return colors.warning;
  if (intensity >= 40) return colors.success;
  return "#8e8e93";
};

/**
 * 📝 פונקציית עזר לתווית אינטנסיביות
 * מחזירה תיאור טקסטואלי לרמת האינטנסיביות
 */
export const getIntensityLabel = (intensity: number): string => {
  if (intensity >= 80) return "גבוהה";
  if (intensity >= 60) return "בינונית";
  if (intensity >= 40) return "נמוכה";
  return "קלה";
};
