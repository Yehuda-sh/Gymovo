// src/data/storage/workouts/search.ts
// 🔍 חיפוש מתקדם באימונים

import { Workout } from "../../../types/workout";
import { withRetry, StorageError } from "../core";
import { getWorkoutHistory } from "./history";

/**
 * 🔍 חיפוש אימונים לפי קריטריונים מתקדמים
 * מספק חיפוש טקסט, תאריכים, דירוגים ומשך זמן
 */
export async function searchWorkouts(
  userId: string,
  searchCriteria: {
    query?: string;
    exerciseName?: string;
    dateFrom?: string;
    dateTo?: string;
    rating?: number;
    minDuration?: number;
    maxDuration?: number;
  }
): Promise<Workout[]> {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "searchWorkouts");
  }

  return withRetry(
    async () => {
      const allWorkouts = await getWorkoutHistory(userId);

      const filteredWorkouts = allWorkouts.filter((workout) => {
        // Text search in workout name and notes
        if (searchCriteria.query) {
          const query = searchCriteria.query.toLowerCase();
          const matchesName = workout.name.toLowerCase().includes(query);
          const matchesNotes =
            workout.notes?.toLowerCase().includes(query) || false;
          const matchesExercise = workout.exercises.some((ex) =>
            ex.name.toLowerCase().includes(query)
          );

          if (!matchesName && !matchesNotes && !matchesExercise) {
            return false;
          }
        }

        // Exercise name search
        if (searchCriteria.exerciseName) {
          const hasExercise = workout.exercises.some((ex) =>
            ex.name
              .toLowerCase()
              .includes(searchCriteria.exerciseName!.toLowerCase())
          );
          if (!hasExercise) return false;
        }

        // Date range
        if (searchCriteria.dateFrom || searchCriteria.dateTo) {
          const workoutDate = new Date(
            workout.completedAt || workout.date || 0
          );

          if (
            searchCriteria.dateFrom &&
            workoutDate < new Date(searchCriteria.dateFrom)
          ) {
            return false;
          }
          if (
            searchCriteria.dateTo &&
            workoutDate > new Date(searchCriteria.dateTo)
          ) {
            return false;
          }
        }

        // Rating filter
        if (searchCriteria.rating && workout.rating !== searchCriteria.rating) {
          return false;
        }

        // Duration filters
        if (
          searchCriteria.minDuration &&
          (workout.duration || 0) < searchCriteria.minDuration
        ) {
          return false;
        }
        if (
          searchCriteria.maxDuration &&
          (workout.duration || 0) > searchCriteria.maxDuration
        ) {
          return false;
        }

        return true;
      });

      if (__DEV__) {
        console.log(
          `🔍 Search found ${filteredWorkouts.length} workouts for criteria:`,
          searchCriteria
        );
      }

      return filteredWorkouts;
    },
    "searchWorkouts",
    userId
  );
}

/**
 * 🎯 חיפוש מהיר לפי שם תרגיל
 */
export async function findWorkoutsByExercise(
  userId: string,
  exerciseName: string
): Promise<Workout[]> {
  return searchWorkouts(userId, { exerciseName });
}

/**
 * 📅 חיפוש אימונים בטווח תאריכים
 */
export async function findWorkoutsByDateRange(
  userId: string,
  dateFrom: string,
  dateTo: string
): Promise<Workout[]> {
  return searchWorkouts(userId, { dateFrom, dateTo });
}

/**
 * ⭐ חיפוש אימונים לפי דירוג
 */
export async function findWorkoutsByRating(
  userId: string,
  minRating: number
): Promise<Workout[]> {
  const allWorkouts = await getWorkoutHistory(userId);
  return allWorkouts.filter(
    (workout) => workout.rating && workout.rating >= minRating
  );
}
