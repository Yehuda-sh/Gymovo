// src/hooks/useExerciseDetails.ts

import { useQuery } from "@tanstack/react-query";
import { fetchExerciseInfoById } from "../services/wgerApi";
import { Exercise } from "../types/exercise";

/**
 * Hook לשליפת פרטי תרגיל ספציפי
 * @param exerciseId - מזהה התרגיל
 * @returns פרטי התרגיל, מצב טעינה ושגיאה
 */
export const useExerciseDetails = (exerciseId: string) => {
  return useQuery<Exercise | null, Error>({
    queryKey: ["exercise", exerciseId],
    queryFn: () => fetchExerciseInfoById(exerciseId),
    enabled: !!exerciseId, // רק אם יש exerciseId
    staleTime: 1000 * 60 * 30, // 30 דקות
    gcTime: 1000 * 60 * 60, // שעה (במקום cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
