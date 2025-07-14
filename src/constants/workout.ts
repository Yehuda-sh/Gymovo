// src/constants/workout.ts
// 💪 קבועי אימון וברירות מחדל

/**
 * 🎯 Workout Defaults
 * ערכי ברירת מחדל לאימונים
 */
export const WORKOUT_DEFAULTS = {
  // Sets & Reps
  SETS: 3,
  REPS: 12,
  MIN_SETS: 1,
  MAX_SETS: 10,
  MIN_REPS: 1,
  MAX_REPS: 50,

  // Rest Time (seconds)
  REST_TIME: 90,
  MIN_REST: 0,
  MAX_REST: 600,
  REST_INTERVALS: [30, 45, 60, 90, 120, 180, 240, 300],

  // Weight
  MIN_WEIGHT: 0,
  MAX_WEIGHT: 500,
  WEIGHT_INCREMENT: 2.5,

  // Rating
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 3,

  // Duration
  MIN_DURATION: 0, // minutes
  MAX_DURATION: 300, // 5 hours
  AVERAGE_DURATION: 60, // 1 hour
} as const;

/**
 * 🏋️ Exercise Types
 * סוגי תרגילים
 */
export const EXERCISE_TYPES = {
  STRENGTH: {
    id: "strength",
    name: "כוח",
    icon: "weight-lifter",
    color: "#007AFF",
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 120,
  },
  HYPERTROPHY: {
    id: "hypertrophy",
    name: "נפח שריר",
    icon: "arm-flex",
    color: "#8B5CF6",
    defaultSets: 4,
    defaultReps: 12,
    defaultRest: 90,
  },
  ENDURANCE: {
    id: "endurance",
    name: "סיבולת",
    icon: "run",
    color: "#00E676",
    defaultSets: 3,
    defaultReps: 20,
    defaultRest: 45,
  },
  POWER: {
    id: "power",
    name: "עוצמה",
    icon: "lightning-bolt",
    color: "#FF6B35",
    defaultSets: 5,
    defaultReps: 3,
    defaultRest: 180,
  },
} as const;

/**
 * 📊 Workout Intensity Levels
 * רמות עצימות אימון
 */
export const INTENSITY_LEVELS = {
  LIGHT: {
    id: "light",
    name: "קל",
    percentage: 50,
    color: "#4CAF50",
    description: "אימון קל, מתאים לחימום או התאוששות",
  },
  MODERATE: {
    id: "moderate",
    name: "בינוני",
    percentage: 70,
    color: "#2196F3",
    description: "אימון בעצימות בינונית",
  },
  HARD: {
    id: "hard",
    name: "קשה",
    percentage: 85,
    color: "#FF9800",
    description: "אימון מאתגר בעצימות גבוהה",
  },
  MAX: {
    id: "max",
    name: "מקסימלי",
    percentage: 100,
    color: "#F44336",
    description: "עצימות מקסימלית - זהירות!",
  },
} as const;

/**
 * 🎯 Rep Ranges
 * טווחי חזרות לפי מטרה
 */
export const REP_RANGES = {
  STRENGTH: { min: 1, max: 5, name: "כוח מקסימלי" },
  POWER: { min: 3, max: 5, name: "עוצמה" },
  HYPERTROPHY: { min: 8, max: 12, name: "בניית שריר" },
  ENDURANCE: { min: 15, max: 25, name: "סיבולת שרירית" },
  METABOLIC: { min: 20, max: 50, name: "מטבולי" },
} as const;

/**
 * ⏱️ Rest Time Recommendations
 * המלצות זמני מנוחה
 */
export const REST_RECOMMENDATIONS = {
  COMPOUND_HEAVY: {
    name: "תרגילים מורכבים כבדים",
    time: 180,
    description: "סקוואט, דדליפט, בנץ׳ פרס כבד",
  },
  COMPOUND_MODERATE: {
    name: "תרגילים מורכבים בינוניים",
    time: 120,
    description: "לחיצות, משיכות, חתירה",
  },
  ISOLATION_HEAVY: {
    name: "תרגילי בידוד כבדים",
    time: 90,
    description: "תרגילי זרועות ורגליים כבדים",
  },
  ISOLATION_LIGHT: {
    name: "תרגילי בידוד קלים",
    time: 60,
    description: "תרגילי בידוד וגימור",
  },
  SUPERSET: {
    name: "סופרסט",
    time: 30,
    description: "מעבר מהיר בין תרגילים",
  },
} as const;

/**
 * 📈 Progress Indicators
 * אינדיקטורים להתקדמות
 */
export const PROGRESS_INDICATORS = {
  WEIGHT_INCREASE: {
    small: 2.5,
    medium: 5,
    large: 10,
    unit: 'ק"ג',
  },
  REPS_INCREASE: {
    small: 1,
    medium: 2,
    large: 5,
    unit: "חזרות",
  },
  SETS_INCREASE: {
    small: 1,
    medium: 2,
    large: 3,
    unit: "סטים",
  },
} as const;

/**
 * 🏆 Workout Achievements
 * הישגים באימון
 */
export const WORKOUT_ACHIEVEMENTS = {
  FIRST_WORKOUT: {
    id: "first_workout",
    name: "האימון הראשון",
    description: "השלמת את האימון הראשון שלך!",
    icon: "🎯",
  },
  WEEK_STREAK: {
    id: "week_streak",
    name: "שבוע רצוף",
    description: "התאמנת כל שבוע!",
    icon: "🔥",
  },
  PERSONAL_RECORD: {
    id: "personal_record",
    name: "שיא אישי",
    description: "שברת שיא אישי!",
    icon: "🏆",
  },
  CENTURY_CLUB: {
    id: "century_club",
    name: "מועדון המאה",
    description: 'הרמת 100 ק"ג!',
    icon: "💯",
  },
} as const;

/**
 * 💾 Workout Status
 * סטטוסי אימון
 */
export const WORKOUT_STATUS = {
  PLANNED: {
    id: "planned",
    name: "מתוכנן",
    color: "#9E9E9E",
    icon: "calendar-clock",
  },
  ACTIVE: {
    id: "active",
    name: "פעיל",
    color: "#00E676",
    icon: "play",
  },
  PAUSED: {
    id: "paused",
    name: "מושהה",
    color: "#FF9800",
    icon: "pause",
  },
  COMPLETED: {
    id: "completed",
    name: "הושלם",
    color: "#2196F3",
    icon: "check-circle",
  },
  SKIPPED: {
    id: "skipped",
    name: "דולג",
    color: "#757575",
    icon: "skip-next",
  },
} as const;

/**
 * 🔧 Helper Functions
 */
export const workoutHelpers = {
  // חישוב נפח כולל
  calculateVolume: (sets: number, reps: number, weight: number): number => {
    return sets * reps * weight;
  },

  // חישוב 1RM משוער (Epley Formula)
  calculate1RM: (weight: number, reps: number): number => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  },

  // המלצת משקל לפי אחוזים מ-1RM
  calculateWorkingWeight: (oneRM: number, percentage: number): number => {
    return Math.round((oneRM * percentage) / 100 / 2.5) * 2.5;
  },

  // חישוב קלוריות משוערות
  estimateCalories: (
    duration: number,
    intensity: "light" | "moderate" | "hard"
  ): number => {
    const baseCaloriesPerMinute = {
      light: 5,
      moderate: 8,
      hard: 12,
    };
    return Math.round(duration * baseCaloriesPerMinute[intensity]);
  },

  // פורמט זמן לתצוגה
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  },
};

// Type exports
export type ExerciseType = keyof typeof EXERCISE_TYPES;
export type IntensityLevel = keyof typeof INTENSITY_LEVELS;
export type WorkoutStatus = keyof typeof WORKOUT_STATUS;
