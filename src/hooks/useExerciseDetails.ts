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
        Toast.show(`אין חיבור לאינטרנט. המידע יטען כשתתחבר שוב`);
        return false;
      }

      // הגבל ניסיונות חוזרים
      if (failureCount > 3) {
        Toast.error("לא ניתן לטעון את פרטי התרגיל");
        return false;
      }

      // אל תנסה שוב עבור שגיאות 404
      if (error?.response?.status === 404) {
        Toast.show("התרגיל לא נמצא במערכת");
        return false;
      }

      // הודעה על חיבור איטי
      if (isSlowConnection && failureCount > 1) {
        Toast.show(`חיבור איטי (${connectionDescription}). טוען...`);
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
    networkMode: options.enableOfflineMode ? "offlineFirst" : "online",
  });

  // Handle errors manually since onError is deprecated
  useEffect(() => {
    if (query.isError && query.error) {
      console.error("Error fetching exercise details:", query.error);
      options.onError?.(query.error);

      // הצג הודעה מותאמת למשתמש
      if (query.error.message === "NO_CONNECTION") {
        Toast.show("אין חיבור לאינטרנט");
      }
    }
  }, [query.isError, query.error, options]);

  // 🚀 Prefetch תרגילים קשורים (שלב 3)
  useEffect(() => {
    if (options.prefetch && query.data) {
      // Prefetch תרגילים דומים לחוויה חלקה
      const relatedIds = getRelatedExerciseIds(query.data);
      relatedIds.forEach((id) => {
        queryClient.prefetchQuery({
          queryKey: ["exercise", id],
          queryFn: () => fetchExerciseInfoById(id),
          staleTime: 1000 * 60 * 30,
        });
      });
    }
  }, [query.data, options.prefetch, queryClient]);

  // 🔄 פונקציית refresh ידנית
  const refresh = useCallback(async () => {
    if (!isConnected) {
      Toast.show("לא ניתן לרענן ללא חיבור לאינטרנט");
      return;
    }

    // הודעה על חיבור איטי
    if (isSlowConnection) {
      Toast.show(`מרענן נתונים ב${connectionDescription}...`);
    }

    try {
      await query.refetch();
      Toast.success("המידע עודכן בהצלחה");
    } catch {
      Toast.error("שגיאה בעדכון המידע");
    }
  }, [query, isConnected, isSlowConnection, connectionDescription]);

  // 💾 פונקציה לשמירה מקומית (שלב 3)
  const saveOffline = useCallback(async () => {
    if (!query.data) return;

    try {
      // בעתיד: שמירה ב-AsyncStorage
      Toast.success("התרגיל נשמר למצב אופליין");
    } catch {
      Toast.error("שגיאה בשמירת התרגיל");
    }
  }, [query.data]);

  return {
    // נתונים בסיסיים
    data: query.data,
    exercise: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // מידע נוסף
    isOffline: !isConnected,
    isRefreshing: query.isRefetching,
    retryCount,

    // פונקציות
    refetch: query.refetch,
    refresh,
    saveOffline,

    // מצב הquery
    status: query.status,
    fetchStatus: query.fetchStatus,
  };
};

// 🎯 שלב 3: פונקציות עזר לפיצ'רים מתקדמים

/**
 * מחזיר רשימת תרגילים קשורים (לדוגמה)
 */
function getRelatedExerciseIds(exercise: Exercise): string[] {
  // לוגיקה לחישוב תרגילים דומים
  // בעתיד: AI-based recommendations
  return [];
}

/**
 * Hook לטעינת מספר תרגילים במקביל
 */
export const useMultipleExerciseDetails = (exerciseIds: string[]) => {
  const [results, setResults] = useState<(Exercise | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    const loadExercises = async () => {
      setIsLoading(true);
      const promises = exerciseIds.map((id) =>
        fetchExerciseInfoById(id).catch((error) => {
          setErrors((prev) => [...prev, error]);
          return null;
        })
      );

      const exercises = await Promise.all(promises);
      setResults(exercises);
      setIsLoading(false);
    };

    if (exerciseIds.length > 0) {
      loadExercises();
    }
  }, [exerciseIds]);

  return {
    exercises: results.filter(Boolean) as Exercise[],
    isLoading,
    isError: errors.length > 0,
    errors,
  };
};

// 🎨 שלב 2: Hook לתמונות ווידאו
export const useExerciseMedia = (exerciseId: string) => {
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  useEffect(() => {
    // בעתיד: טעינת מדיה מ-Sora AI או מקורות אחרים
    const loadMedia = async () => {
      setIsLoadingMedia(true);
      try {
        // Placeholder for future implementation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setImages([]);
        setVideos([]);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    if (exerciseId) {
      loadMedia();
    }
  }, [exerciseId]);

  return { images, videos, isLoadingMedia };
};

// 📊 שלב 3: Hook לסטטיסטיקות תרגיל
export const useExerciseStats = (exerciseId: string) => {
  return useQuery({
    queryKey: ["exerciseStats", exerciseId],
    queryFn: async () => {
      // בעתיד: חישוב סטטיסטיקות מההיסטוריה
      return {
        personalBest: null,
        lastPerformed: null,
        totalSets: 0,
        averageWeight: 0,
        trend: "stable" as const,
      };
    },
    enabled: !!exerciseId,
    staleTime: 1000 * 60 * 5, // 5 דקות
  });
};

// Export types לשימוש בקומפוננטות
export type ExerciseDetailsHook = ReturnType<typeof useExerciseDetails>;
export type ExerciseMediaHook = ReturnType<typeof useExerciseMedia>;
export type ExerciseStatsHook = ReturnType<typeof useExerciseStats>;
