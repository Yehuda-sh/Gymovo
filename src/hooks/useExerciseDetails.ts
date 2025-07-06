// src/hooks/useExerciseDetails.ts

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchExerciseInfoById } from "../services/wgerApi";
import { Exercise } from "../types/exercise";

/**
 * Hook לשליפת פרטים של תרגיל ספציפי.
 * מבצע אופטימיזציה: תחילה מחפש במטמון (cache) של רשימת התרגילים המלאה,
 * ורק אם לא נמצא, פונה ל-API לשליפת המידע.
 * @param exerciseId מזהה התרגיל
 */
export const useExerciseDetails = (exerciseId: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: () => fetchExerciseInfoById(exerciseId),
    initialData: () => {
      // ניסיון למצוא את התרגיל במטמון של שאילתת 'exercises'
      const allExercises = queryClient.getQueryData<Exercise[]>(["exercises"]);
      if (allExercises) {
        const foundExercise = allExercises.find((ex) => ex.id === exerciseId);
        if (foundExercise) {
          // אם נמצא, אין צורך בקריאת רשת והמסך נטען מיידית
          return foundExercise;
        }
      }
      return undefined;
    },
  });
};
