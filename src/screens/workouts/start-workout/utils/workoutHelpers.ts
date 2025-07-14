// src/screens/workouts/start-workout/utils/workoutHelpers.ts

import { Plan, PlanDay } from "../../../../types/plan";
import { Exercise } from "../../../../types/exercise";

export const getMuscleGroupsFromDay = (day: PlanDay): string[] => {
  const muscleGroups = new Set<string>();
  day.exercises?.forEach((exercise) => {
    if (exercise.muscleGroup) {
      muscleGroups.add(exercise.muscleGroup);
    }
  });
  return Array.from(muscleGroups);
};

export const getWorkoutDuration = (exerciseCount: number): number => {
  // Estimate: 3 minutes per exercise (including rest)
  return exerciseCount * 3;
};

export const getPlanDifficulty = (
  plan: Plan
): "beginner" | "intermediate" | "advanced" => {
  const difficulty = plan.difficulty?.toLowerCase();
  if (difficulty?.includes("מתחיל")) return "beginner";
  if (difficulty?.includes("מתקדם")) return "advanced";
  return "intermediate";
};
