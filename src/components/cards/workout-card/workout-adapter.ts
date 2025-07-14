// src/components/cards/workout-card/workout-adapter.ts
// פונקציות עזר להתאמת נתוני workout ממקורות שונים

import { Workout } from "../../../types/workout";

/**
 * Extended workout type for display purposes
 * כולל שדות נוספים שיכולים להגיע ממקורות שונים
 */
export interface DisplayWorkout extends Partial<Workout> {
  // Required fields from Workout
  id: string;
  exercises: any[];
  date: string;

  // Optional display fields
  name?: string;
  completedAt?: string;
  rating?: number;
  difficulty?: string;
  targetMuscles?: string[];
  completedExercises?: number;
  totalExercises?: number;
  isCompleted?: boolean;
}

/**
 * מתאם workout רגיל ל-DisplayWorkout
 */
export function adaptWorkoutForDisplay(workout: Workout): DisplayWorkout {
  return {
    ...workout,
    name: workout.planName || "אימון",
    completedAt: workout.endTime,
    rating: undefined, // יכול להגיע ממקור אחר
    difficulty: undefined, // יכול להגיע מה-plan
    targetMuscles: extractTargetMuscles(workout),
    completedExercises: countCompletedExercises(workout),
    totalExercises: workout.exercises?.length || 0,
    isCompleted: workout.status === "completed",
  };
}

/**
 * מתאם workout מ-history ל-DisplayWorkout
 */
export function adaptHistoryWorkoutForDisplay(workout: any): DisplayWorkout {
  return {
    id: workout.id,
    exercises: workout.exercises || [],
    date: workout.date || workout.completedAt,
    planName: workout.planName,
    dayName: workout.dayName,
    duration: workout.duration,
    status: workout.status,

    // Display fields
    name: workout.name || workout.planName || "אימון",
    completedAt: workout.completedAt || workout.endTime,
    rating: workout.rating,
    difficulty: workout.difficulty,
    targetMuscles: workout.targetMuscles || extractTargetMuscles(workout),
    completedExercises:
      workout.completedExercises || countCompletedExercises(workout),
    totalExercises: workout.totalExercises || workout.exercises?.length || 0,
    isCompleted: workout.isCompleted || workout.status === "completed",
  };
}

/**
 * מחלץ שרירי מטרה מתוך האימון
 */
function extractTargetMuscles(workout: any): string[] {
  const muscles = new Set<string>();

  workout.exercises?.forEach((exercise: any) => {
    if (exercise.exercise?.primaryMuscle) {
      muscles.add(exercise.exercise.primaryMuscle);
    }
    if (exercise.targetMuscles) {
      exercise.targetMuscles.forEach((muscle: string) => muscles.add(muscle));
    }
    if (exercise.muscleGroup) {
      muscles.add(exercise.muscleGroup);
    }
  });

  return Array.from(muscles);
}

/**
 * סופר תרגילים שהושלמו
 */
function countCompletedExercises(workout: any): number {
  if (workout.completedExercises !== undefined) {
    return workout.completedExercises;
  }

  let completed = 0;
  workout.exercises?.forEach((exercise: any) => {
    const hasCompletedSets = exercise.sets?.some(
      (set: any) => set.status === "completed"
    );
    if (hasCompletedSets) {
      completed++;
    }
  });

  return completed;
}

/**
 * ממזג נתוני workout עם נתונים נוספים
 */
export function mergeWorkoutData(
  workout: Workout,
  additionalData?: Partial<DisplayWorkout>
): DisplayWorkout {
  const adapted = adaptWorkoutForDisplay(workout);
  return {
    ...adapted,
    ...additionalData,
  };
}
