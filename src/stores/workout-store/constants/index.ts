// src/stores/workout-store/constants/index.ts
// ⚙️ קבועים ופונקציות עזר לניהול אימונים

import { WorkoutExercise } from "../../../types/workout";

// ⚙️ קבועים בסיסיים
export const DEFAULT_REST_TIME = 90; // שניות
export const DEFAULT_SETS_PER_EXERCISE = 3;
export const DEFAULT_REPS_PER_SET = 12;
export const CALORIES_PER_SET = 10; // הערכה בסיסית

// 🎯 קבועי זמן ומשך
export const WORKOUT_TIMER_INTERVAL = 1000; // מילישניות
export const AUTO_SAVE_INTERVAL = 30000; // 30 שניות

// 📊 קבועים לחישובי סטטיסטיקות
export const MIN_WORKOUT_DURATION = 5; // דקות מינימליות לאימון
export const MAX_WORKOUT_DURATION = 180; // דקות מקסימליות לאימון
export const TYPICAL_WORKOUT_DURATION = 45; // דקות טיפוסיות

// 🏆 קבועים לשיאים אישיים
export const PERSONAL_RECORD_THRESHOLD = 1.05; // 5% שיפור נחשב לשיא
export const MAX_PERSONAL_RECORDS_STORED = 100;

// 🔧 פונקציות עזר

/**
 * חישוב נפח כולל של תרגיל (משקל × חזרות × סטים)
 */
export const calculateVolume = (exercise: WorkoutExercise): number => {
  return exercise.sets.reduce((total, set) => {
    if (set.status === "completed") {
      const weight = set.actualWeight || set.weight || 0;
      const reps = set.actualReps || set.reps || 0;
      return total + weight * reps;
    }
    return total;
  }, 0);
};

/**
 * חישוב משך זמן בפורמט קריא
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} דקות`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} שעות`;
  }

  return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

/**
 * חישוב אחוז השלמה של אימון
 */
export const calculateWorkoutProgress = (
  exercise: WorkoutExercise[]
): number => {
  if (!exercise.length) return 0;

  const totalSets = exercise.reduce((total, ex) => total + ex.sets.length, 0);
  const completedSets = exercise.reduce((total, ex) => {
    return total + ex.sets.filter((set) => set.status === "completed").length;
  }, 0);

  return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
};

/**
 * יצירת מזהה ייחודי לסט
 */
export const generateSetId = (exerciseId: string, setIndex: number): string => {
  return `${exerciseId}_set_${setIndex}_${Date.now()}`;
};

/**
 * בדיקה אם אימון הושלם (כל הסטים בוצעו)
 */
export const isWorkoutCompleted = (exercises: WorkoutExercise[]): boolean => {
  return exercises.every((exercise) =>
    exercise.sets.every((set) => set.status === "completed")
  );
};

/**
 * חישוב זמן מנוחה מומלץ לפי סוג התרגיל
 */
export const getRecommendedRestTime = (exerciseType?: string): number => {
  switch (exerciseType?.toLowerCase()) {
    case "strength":
    case "powerlifting":
      return 180; // 3 דקות
    case "cardio":
    case "endurance":
      return 60; // דקה
    case "circuit":
      return 30; // 30 שניות
    default:
      return DEFAULT_REST_TIME; // 90 שניות
  }
};

// 🔄 נקה כל הטיימרים
export const clearAllTimers = (restTimer?: NodeJS.Timeout | null): void => {
  if (restTimer) {
    clearInterval(restTimer);
  }
};
