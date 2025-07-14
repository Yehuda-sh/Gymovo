// src/hooks/useExerciseDetails.ts

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchExerciseInfoById } from "../services/wgerApi";
import { Exercise } from "../types/exercise";
import { Toast } from "../components/common/Toast";
import { useCallback, useEffect, useState } from "react";
import { useNetworkStatus } from "./useNetworkStatus";

// 🎯 שלב 1: Error handling ו-retry mechanism משופרים
interface UseExerciseDetailsOptions {
  onError?: (error: Error) => void;
  prefetch?: boolean;
  enableOfflineMode?: boolean;
}

/**
 * Hook משופר לשליפת פרטי תרגיל עם תמיכה מלאה בשגיאות ו-offline
 * @param exerciseId - מזהה התרגיל
 * @param options - אפשרויות נוספות
 * @returns פרטי התרגיל, מצב טעינה, שגיאה ופונקציות עזר
 */
export const useExerciseDetails = (
  exerciseId: string,
  options: UseExerciseDetailsOptions = {}
) => {
  const queryClient = useQueryClient();
  const { isConnected, isSlowConnection, connectionDescription } =
    useNetworkStatus({
      showToasts: false, // נטפל בהודעות בעצמנו
    });
  const [retryCount, setRetryCount] = useState(0);

  // 🔧 שלב 1A: Retry mechanism מתוחכם
  const retryFn = useCallback(
    (failureCount: number, error: any) => {
      // אל תנסה שוב אם אין רשת
      if (!isConnected) {
        // תיקון: שימוש ב-info במקום show
        Toast.info("אין חיבור לאינטרנט", "המידע יטען כשתתחבר שוב");
        return false;
      }

      // הגבל ניסיונות חוזרים
      if (failureCount > 3) {
        // תיקון: שימוש ב-error כמו שצריך
        Toast.error("שגיאה", "לא ניתן לטעון את פרטי התרגיל");
        return false;
      }

      // אל תנסה שוב עבור שגיאות 404
      if (error?.response?.status === 404) {
        // תיקון: שימוש ב-warning
        Toast.warning("התרגיל לא נמצא", "התרגיל לא קיים במערכת");
        return false;
      }

      // הודעה על חיבור איטי
      if (isSlowConnection && failureCount > 1) {
        // תיקון: שימוש ב-info
        Toast.info("חיבור איטי", `${connectionDescription}. טוען...`);
      }

      setRetryCount(failureCount);
      return true;
    },
    [isConnected, isSlowConnection, connectionDescription]
  );

  // Query הראשי עם אופטימיזציות
  const query = useQuery<Exercise | null, Error>({
    queryKey: ["exercise", exerciseId],
    queryFn: async () => {
      try {
        const data = await fetchExerciseInfoById(exerciseId);

        // 🎨 שלב 2: העשרת הנתונים (בעתיד)
        // כאן נוסיף העשרת נתונים כמו תמונות מ-AI, וידאו הדרכה וכו'

        return data;
      } catch (error) {
        // 🔧 טיפול בשגיאות מתוחכם
        if (!isConnected) {
          throw new Error("NO_CONNECTION");
        }
        throw error;
      }
    },
    enabled: !!exerciseId && (isConnected || options.enableOfflineMode),

    // ⚡ שלב 1A: אופטימיזציה של React Query
    staleTime: 1000 * 60 * 30, // 30 דקות - המידע נשאר "טרי"
    gcTime: 1000 * 60 * 60 * 24, // 24 שעות - שמור במטמון

    retry: retryFn,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),

    // 📱 שלב 1A: Offline support בסיסי
    networkMode: options.enableOfflineMode ? "always" : "online",
  });

  // 🔧 טיפול בשגיאות חיצוני
  useEffect(() => {
    if (query.isError && options.onError) {
      options.onError(query.error as Error);
    }
  }, [query.isError, query.error, options]);

  // 🚀 שלב 3: Prefetch תרגילים קשורים
  const prefetchRelatedExercises = useCallback(
    async (muscleGroups: string[]) => {
      if (!isConnected || isSlowConnection) return;

      // Prefetch תרגילים לאותן קבוצות שרירים
      for (const muscle of muscleGroups) {
        await queryClient.prefetchQuery({
          queryKey: ["exercises", { muscleGroup: muscle }],
          queryFn: () => fetchExercisesByMuscleGroup(muscle),
          staleTime: 1000 * 60 * 30,
        });
      }
    },
    [queryClient, isConnected, isSlowConnection]
  );

  // 🎯 שלב 4: פונקציות עזר
  const invalidateExercise = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["exercise", exerciseId] });
  }, [queryClient, exerciseId]);

  const updateExerciseCache = useCallback(
    (updater: (prev: Exercise | null) => Exercise | null) => {
      queryClient.setQueryData(["exercise", exerciseId], updater);
    },
    [queryClient, exerciseId]
  );

  // אם התרגיל נטען, prefetch תרגילים קשורים
  useEffect(() => {
    if (query.data?.targetMuscleGroups && !query.isLoading) {
      prefetchRelatedExercises(query.data.targetMuscleGroups);
    }
  }, [query.data, query.isLoading, prefetchRelatedExercises]);

  return {
    ...query,
    retryCount,
    invalidateExercise,
    updateExerciseCache,
    isOffline: !isConnected,
    isSlowConnection,
  };
};

// 🎨 שלב 5: Hooks נוספים לפיצ'רים מתקדמים
export const useExerciseMedia = (exerciseId: string) => {
  return useQuery({
    queryKey: ["exercise-media", exerciseId],
    queryFn: () => fetchExerciseMedia(exerciseId),
    enabled: !!exerciseId,
    staleTime: 1000 * 60 * 60 * 24, // 24 שעות - מדיה לא משתנה
  });
};

export const useExerciseStats = (exerciseId: string) => {
  return useQuery({
    queryKey: ["exercise-stats", exerciseId],
    queryFn: () => fetchExerciseStats(exerciseId),
    enabled: !!exerciseId,
    staleTime: 1000 * 60 * 5, // 5 דקות
  });
};

// Export types לשימוש בקומפוננטות
export type ExerciseDetailsHook = ReturnType<typeof useExerciseDetails>;
export type ExerciseMediaHook = ReturnType<typeof useExerciseMedia>;
export type ExerciseStatsHook = ReturnType<typeof useExerciseStats>;

// Helper functions שצריך להוסיף ל-wgerApi
async function fetchExercisesByMuscleGroup(
  muscle: string
): Promise<Exercise[]> {
  // יש להוסיף את הפונקציה הזו ב-wgerApi.ts
  throw new Error("Not implemented");
}

async function fetchExerciseMedia(exerciseId: string): Promise<any> {
  // יש להוסיף את הפונקציה הזו ב-wgerApi.ts
  throw new Error("Not implemented");
}

async function fetchExerciseStats(exerciseId: string): Promise<any> {
  // יש להוסיף את הפונקציה הזו ב-wgerApi.ts
  throw new Error("Not implemented");
}
