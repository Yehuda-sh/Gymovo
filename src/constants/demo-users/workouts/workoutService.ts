// src/constants/demo-users/workouts/workoutService.ts
// 🎯 שירות היסטוריית אימונים למשתמשי דמו

import { Workout } from "../../../types/workout";
import { DemoWorkoutData } from "./types";
import { aviWorkouts } from "./aviWorkouts";
import { mayaWorkouts } from "./mayaWorkouts";
import { yoniWorkouts } from "./yoniWorkouts";

/**
 * 🔄 ממיר DemoWorkoutData ל-Workout
 */
function convertDemoWorkoutToWorkout(demoWorkout: DemoWorkoutData): Workout {
  return {
    ...demoWorkout,
    date: demoWorkout.date.toISOString().split("T")[0], // ממיר Date ל-string
  };
}

/**
 * 🏋️ מאפה מבוסס מפתח למציאת היסטוריית אימונים לפי משתמש
 * מבטיח ביצועים מהירים וארגון נקי
 */
const workoutHistoriesByUserId: { [key: string]: DemoWorkoutData[] } = {
  "demo-user-avi": aviWorkouts,
  "demo-user-maya": mayaWorkouts,
  "demo-user-yoni": yoniWorkouts,
};

/**
 * 📊 מחזיר היסטוריית אימונים למשתמש דמו ספציפי
 *
 * @param userId - מזהה המשתמש
 * @returns מערך אימונים או מערך ריק אם לא נמצא
 *
 * @example
 * ```typescript
 * const aviHistory = getDemoWorkoutHistory("demo-user-avi");
 * console.log(aviHistory.length); // 4
 * ```
 */
export function getDemoWorkoutHistory(userId: string): Workout[] {
  if (!userId?.trim()) {
    console.warn("⚠️ getDemoWorkoutHistory: userId is required");
    return [];
  }

  const demoWorkouts = workoutHistoriesByUserId[userId];

  if (!demoWorkouts && __DEV__) {
    console.log(`🏋️ No demo workout history found for user: ${userId}`);
  }

  return (demoWorkouts || []).map(convertDemoWorkoutToWorkout);
}

/**
 * 📊 מחזיר רשימת כל מזהי המשתמשים שיש להם היסטוריית אימונים
 */
export function getAvailableWorkoutUserIds(): string[] {
  return Object.keys(workoutHistoriesByUserId);
}

/**
 * 🏋️ מחזיר את כל האימונים מכל המשתמשים כמערך מאוחד
 */
export function getAllDemoWorkouts(): Workout[] {
  return Object.values(workoutHistoriesByUserId)
    .flat()
    .map(convertDemoWorkoutToWorkout);
}

/**
 * ⭐ מחזיר אימונים לפי דירוג מינימלי
 */
export function getDemoWorkoutsByRating(minRating: number): Workout[] {
  return getAllDemoWorkouts().filter(
    (workout) => workout.rating && workout.rating >= minRating
  );
}

/**
 * 📅 מחזיר אימונים מתקופה מסוימת
 */
export function getDemoWorkoutsByDateRange(
  fromDate: Date,
  toDate: Date,
  userId?: string
): Workout[] {
  const workouts = userId
    ? getDemoWorkoutHistory(userId)
    : getAllDemoWorkouts();

  return workouts.filter((workout) => {
    if (!workout.date) return false;
    const workoutDate = new Date(workout.date);
    return workoutDate >= fromDate && workoutDate <= toDate;
  });
}

/**
 * 📊 סטטיסטיקות בסיסיות עבור משתמש
 */
export function getDemoWorkoutStats(userId: string) {
  const workouts = getDemoWorkoutHistory(userId);

  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalWeight: 0,
      averageRating: 0,
      averageDuration: 0,
    };
  }

  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalWeight = workouts.reduce(
    (sum, w) => sum + (w.totalWeight || 0),
    0
  );
  const totalRating = workouts.reduce((sum, w) => sum + (w.rating || 0), 0);

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    totalWeight,
    averageRating: totalRating / workouts.length,
    averageDuration: totalDuration / workouts.length,
  };
}
