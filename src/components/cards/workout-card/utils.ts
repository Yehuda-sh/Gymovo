// src/components/cards/workout-card/utils.ts
// פונקציות עזר משותפות לרכיבי WorkoutCard

import {
  INTENSITY_CONFIG,
  IntensityLevel,
  MUSCLE_COLORS,
  DATE_FORMATS,
} from "./config";

/**
 * 📊 פונקציית חישוב נפח אימון
 * מחשבת את סך הנפח (משקל x חזרות x סטים)
 */
export const calculateWorkoutVolume = (exercises: any[]): number => {
  if (!exercises || exercises.length === 0) return 0;

  return exercises.reduce((total, exercise) => {
    if (!exercise.sets) return total;

    const exerciseVolume = exercise.sets.reduce(
      (setTotal: number, set: any) => {
        const weight = set.weight || 0;
        const reps = set.reps || 0;
        return setTotal + weight * reps;
      },
      0
    );

    return total + exerciseVolume;
  }, 0);
};

/**
 * 💪 פונקציית חישוב סך הסטים
 * מחזירה את מספר הסטים הכולל באימון
 */
export const calculateTotalSets = (exercises: any[]): number => {
  if (!exercises || exercises.length === 0) return 0;
  return exercises.reduce(
    (total, exercise) => total + (exercise.sets?.length || 0),
    0
  );
};

/**
 * 🔥 פונקציית חישוב אינטנסיביות אימון
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
 * 🎨 פונקציית עזר לרמת אינטנסיביות
 * מחזירה את רמת האינטנסיביות בהתאם לאחוז
 */
export const getIntensityLevel = (intensity: number): IntensityLevel => {
  for (const [level, threshold] of Object.entries(
    INTENSITY_CONFIG.thresholds
  )) {
    if (intensity >= threshold.min && intensity < threshold.max) {
      return level as IntensityLevel;
    }
  }
  return IntensityLevel.LOW;
};

/**
 * 🎨 פונקציית עזר לצבע אינטנסיביות
 * מחזירה צבע בהתאם לרמת האינטנסיביות
 */
export const getIntensityColor = (intensity: number): string => {
  const level = getIntensityLevel(intensity);
  return INTENSITY_CONFIG.colors[level];
};

/**
 * 📝 פונקציית עזר לתווית אינטנסיביות
 * מחזירה תיאור טקסטואלי לרמת האינטנסיביות
 */
export const getIntensityLabel = (intensity: number): string => {
  const level = getIntensityLevel(intensity);
  return INTENSITY_CONFIG.labels[level];
};

/**
 * 🎯 פונקציית עזר לגרדיאנט אינטנסיביות
 * מחזירה צבעי גרדיאנט לרמת האינטנסיביות
 */
export const getIntensityGradient = (
  intensity: number
): readonly [string, string] => {
  const level = getIntensityLevel(intensity);
  return INTENSITY_CONFIG.gradients[level] as [string, string];
};

/**
 * 🎨 פונקציית עזר לצבע שריר
 * מחזירה צבע בהתאם לשם השריר
 */
export const getMuscleColor = (muscle: string): string => {
  const normalizedMuscle = muscle.toLowerCase().replace(/\s+/g, "_");
  return MUSCLE_COLORS[normalizedMuscle] || MUSCLE_COLORS.default;
};

/**
 * ⏱️ פונקציית עיצוב זמן שעבר
 * מחזירה תיאור טקסטואלי של זמן שעבר
 */
export const formatTimeAgo = (date: string | Date | number): string => {
  if (!date) return "";

  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return DATE_FORMATS.relative.today;
  if (diffDays === 1) return DATE_FORMATS.relative.yesterday;
  if (diffDays < 7) return DATE_FORMATS.relative.daysAgo(diffDays);
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return DATE_FORMATS.relative.weeksAgo(weeks);
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return DATE_FORMATS.relative.monthsAgo(months);
  }

  return then.toLocaleDateString("he-IL", DATE_FORMATS.absolute.short);
};

/**
 * 🏋️ פונקציית עיצוב נפח
 * מחזירה תיאור מעוצב של נפח האימון
 */
export const formatVolume = (volume: number): string => {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k ק"ג`;
  }
  return `${volume} ק"ג`;
};

/**
 * 🎯 פונקציית חישוב ציון אימון
 * מחשבת ציון כולל לאימון (0-100)
 */
export const calculateWorkoutScore = (workout: any): number => {
  const intensity = calculateWorkoutIntensity(workout);
  const completionRate = workout.completedSets
    ? (workout.completedSets / workout.plannedSets) * 100
    : 100;
  const ratingScore = (workout.rating || 3) * 20;

  return Math.round(intensity * 0.3 + completionRate * 0.4 + ratingScore * 0.3);
};

/**
 * 📊 פונקציית חישוב התקדמות
 * מחזירה אחוז ההתקדמות באימון
 */
export const calculateProgress = (completed: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};
