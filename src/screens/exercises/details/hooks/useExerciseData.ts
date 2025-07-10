// src/screens/exercises/details/hooks/useExerciseData.ts
// Hook לניהול מצב ונתונים של התרגיל

import { useExerciseDetails } from "../../../../hooks/useExerciseDetails";
import { useWorkoutStore } from "../../../../stores/workoutStore";
import { Toast } from "../../../../components/common/Toast";
import { ExerciseDataHook } from "../types";

export const useExerciseData = (
  exerciseId: string,
  onNavigateBack: () => void
): ExerciseDataHook => {
  // שימוש ב-Hook לשליפת פרטי התרגיל (מהמטמון או מהרשת)
  const { data: exercise, isLoading, isError } = useExerciseDetails(exerciseId);

  // שימוש ב-Store לניהול האימון
  const addExerciseToWorkout = useWorkoutStore((state) => state.addExercise);

  // פונקציה להוספת התרגיל לאימון הפעיל הנוכחי
  const handleAddToWorkout = () => {
    if (exercise) {
      addExerciseToWorkout(exercise);
      Toast.show(`${exercise.name} נוסף לאימון!`);
      onNavigateBack();
    }
  };

  return {
    exercise: exercise || null,
    isLoading,
    isError,
    handleAddToWorkout,
  };
};
