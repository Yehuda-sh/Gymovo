// src/hooks/useExercises.ts - Hook משופר לניהול תרגילים

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { wgerApi } from "../services/wgerApi";
import { Exercise } from "../types/exercise";
import { useNetworkStatus } from "./useNetworkStatus"; // 🔧 שינוי ה-import
import { useUserStore } from "../stores/userStore";
import { Toast } from "../components/common/Toast"; // 🎨 הוספת Toast

// קבועים
const CACHE_CONFIG = {
  EXERCISES_LIST: 1000 * 60 * 60 * 24, // 24 שעות
  EXERCISE_DETAILS: 1000 * 60 * 60 * 24 * 7, // שבוע
  FAVORITES_KEY: "@gymovo_favorite_exercises",
  CUSTOM_EXERCISES_KEY: "@gymovo_custom_exercises",
  RECENT_EXERCISES_KEY: "@gymovo_recent_exercises", // 🚀 הוספת מפתח לאחרונים
} as const;

// טיפוסים נוספים
interface ExerciseFilters {
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  searchQuery?: string;
  onlyFavorites?: boolean;
  onlyCustom?: boolean;
}

interface CustomExercise extends Omit<Exercise, "id"> {
  id: string;
  isCustom: true;
  createdBy: string;
  createdAt: string;
}

// 🚀 טיפוס לתרגיל אחרון
interface RecentExercise {
  exerciseId: string;
  lastUsed: string;
  frequency: number;
}

interface UseExercisesReturn {
  // נתונים
  exercises: Exercise[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefreshing: boolean; // 🔧 הוספת מצב רענון

  // מעדפים ומותאמים אישית
  favoriteExercises: Set<string>;
  customExercises: CustomExercise[];

  // פעולות
  refetch: () => void;
  toggleFavorite: (exerciseId: string) => Promise<void>;
  createCustomExercise: (
    exercise: Omit<
      CustomExercise,
      "id" | "createdAt" | "createdBy" | "isCustom"
    >
  ) => Promise<void>;
  deleteCustomExercise: (exerciseId: string) => Promise<void>;
  updateCustomExercise: (
    exerciseId: string,
    updates: Partial<Exercise>
  ) => Promise<void>;
  trackExerciseUse: (exerciseId: string) => Promise<void>; // 🚀 מעקב שימוש

  // חיפוש וסינון
  searchExercises: (query: string) => Exercise[];
  filterExercises: (filters: ExerciseFilters) => Exercise[];
  getExercisesByMuscle: (muscle: string) => Exercise[];
  getExercisesByEquipment: (equipment: string) => Exercise[];
  getExercisesByCategory: (category: string) => Exercise[];

  // כלי עזר
  getExerciseById: (id: string) => Exercise | undefined;
  getRelatedExercises: (exerciseId: string) => Exercise[];
  getSuggestedExercises: () => Exercise[];
  getRecentlyUsedExercises: () => Exercise[];
  getPopularExercises: () => Exercise[];
}

/**
 * Hook מתקדם לניהול תרגילים
 * כולל תמיכה במעדפים, תרגילים מותאמים אישית, סינון וחיפוש
 */
export const useExercises = (): UseExercisesReturn => {
  const queryClient = useQueryClient();
  const { isConnected, isSlowConnection, connectionDescription } =
    useNetworkStatus({
      showToasts: false,
    });
  const user = useUserStore((state) => state.user);

  // State
  const [favoriteExercises, setFavoriteExercises] = useState<Set<string>>(
    new Set()
  );
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [recentExercises, setRecentExercises] = useState<RecentExercise[]>([]); // 🚀

  // טעינת תרגילים מה-API עם error handling משופר
  const {
    data: apiExercises = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      try {
        // 🔧 הודעה על חיבור איטי
        if (isSlowConnection) {
          Toast.show(`טוען תרגילים ב${connectionDescription}...`);
        }

        const data = await wgerApi.fetchAllExercises();

        // 🎨 בעתיד: העשרת נתונים עם תמונות מ-AI
        // enrichExercisesWithAI(data);

        return data;
      } catch (error) {
        if (!isConnected) {
          throw new Error("NO_CONNECTION");
        }
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.EXERCISES_LIST,
    gcTime: CACHE_CONFIG.EXERCISES_LIST * 2,
    refetchOnWindowFocus: false,
    retry: isConnected ? 3 : 0,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // 🔧 Offline support
    networkMode: "offlineFirst",
  });

  // 🔧 טיפול בשגיאות
  useEffect(() => {
    if (isError && error) {
      if (error.message === "NO_CONNECTION") {
        Toast.show("התרגילים יטענו כשתתחבר לאינטרנט");
      } else {
        Toast.error("שגיאה בטעינת התרגילים");
      }
    }
  }, [isError, error]);

  // טעינת מעדפים מהאחסון המקומי
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const key = `${CACHE_CONFIG.FAVORITES_KEY}_${user?.id || "guest"}`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setFavoriteExercises(new Set(JSON.parse(stored)));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    const loadCustomExercises = async () => {
      try {
        const key = `${CACHE_CONFIG.CUSTOM_EXERCISES_KEY}_${
          user?.id || "guest"
        }`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setCustomExercises(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading custom exercises:", error);
      }
    };

    // 🚀 טעינת תרגילים אחרונים
    const loadRecentExercises = async () => {
      try {
        const key = `${CACHE_CONFIG.RECENT_EXERCISES_KEY}_${
          user?.id || "guest"
        }`;
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          setRecentExercises(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading recent exercises:", error);
      }
    };

    const loadData = async () => {
      await Promise.all([
        loadFavorites(),
        loadCustomExercises(),
        loadRecentExercises(),
      ]);
    };
    loadData();
  }, [user?.id]);

  // שילוב כל התרגילים (API + מותאמים אישית)
  const exercises = useMemo(() => {
    return [...apiExercises, ...customExercises];
  }, [apiExercises, customExercises]);

  // החלפת מעדיף/לא מעדיף עם אנימציה
  const toggleFavorite = useCallback(
    async (exerciseId: string) => {
      const newFavorites = new Set(favoriteExercises);

      if (newFavorites.has(exerciseId)) {
        newFavorites.delete(exerciseId);
        // 🎨 בעתיד: אנימציית הסרה
      } else {
        newFavorites.add(exerciseId);
        // 🎨 בעתיד: אנימציית הוספה עם haptic feedback
      }

      setFavoriteExercises(newFavorites);

      try {
        const key = `${CACHE_CONFIG.FAVORITES_KEY}_${user?.id || "guest"}`;
        await AsyncStorage.setItem(
          key,
          JSON.stringify(Array.from(newFavorites))
        );

        // 🎨 הודעה חלקה
        const exercise = exercises.find((e) => e.id === exerciseId);
        if (exercise) {
          Toast.show(
            newFavorites.has(exerciseId)
              ? `${exercise.name} נוסף למועדפים ⭐`
              : `${exercise.name} הוסר מהמועדפים`
          );
        }
      } catch (error) {
        console.error("Error saving favorites:", error);
        Toast.error("שגיאה בשמירת המועדפים");
      }
    },
    [favoriteExercises, user?.id, exercises]
  );

  // 🚀 מעקב אחר שימוש בתרגיל
  const trackExerciseUse = useCallback(
    async (exerciseId: string) => {
      const updatedRecent = [...recentExercises];
      const existingIndex = updatedRecent.findIndex(
        (r) => r.exerciseId === exerciseId
      );

      if (existingIndex >= 0) {
        updatedRecent[existingIndex].lastUsed = new Date().toISOString();
        updatedRecent[existingIndex].frequency += 1;
      } else {
        updatedRecent.push({
          exerciseId,
          lastUsed: new Date().toISOString(),
          frequency: 1,
        });
      }

      // שמור רק 20 אחרונים
      updatedRecent.sort(
        (a, b) =>
          new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
      );
      const trimmed = updatedRecent.slice(0, 20);

      setRecentExercises(trimmed);

      try {
        const key = `${CACHE_CONFIG.RECENT_EXERCISES_KEY}_${
          user?.id || "guest"
        }`;
        await AsyncStorage.setItem(key, JSON.stringify(trimmed));
      } catch (error) {
        console.error("Error saving recent exercises:", error);
      }
    },
    [recentExercises, user?.id]
  );

  // יצירת תרגיל מותאם אישית משופר
  const createCustomExercise = useCallback(
    async (
      exercise: Omit<
        CustomExercise,
        "id" | "createdAt" | "createdBy" | "isCustom"
      >
    ) => {
      if (!exercise.name?.trim()) {
        Toast.error("חובה להזין שם לתרגיל");
        return;
      }

      // 🔧 בדיקות נוספות
      if (!exercise.category) {
        Toast.error("חובה לבחור קטגוריה");
        return;
      }

      const newExercise: CustomExercise = {
        ...exercise,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        isCustom: true,
        createdBy: user?.id || "guest",
        createdAt: new Date().toISOString(),
      };

      const updatedExercises = [...customExercises, newExercise];
      setCustomExercises(updatedExercises);

      try {
        const key = `${CACHE_CONFIG.CUSTOM_EXERCISES_KEY}_${
          user?.id || "guest"
        }`;
        await AsyncStorage.setItem(key, JSON.stringify(updatedExercises));

        // 🎨 הודעת הצלחה משופרת
        Toast.success(`התרגיל "${newExercise.name}" נוצר בהצלחה! 💪`);

        // 🚀 Prefetch לפרטי התרגיל
        queryClient.setQueryData(["exercise", newExercise.id], newExercise);
      } catch (error) {
        console.error("Error saving custom exercises:", error);
        Toast.error("שגיאה בשמירת התרגיל");
      }
    },
    [customExercises, user?.id, queryClient]
  );

  // עדכון תרגיל מותאם אישית
  const updateCustomExercise = useCallback(
    async (exerciseId: string, updates: Partial<Exercise>) => {
      const exerciseIndex = customExercises.findIndex(
        (e) => e.id === exerciseId
      );

      if (exerciseIndex === -1) {
        Toast.error("התרגיל לא נמצא");
        return;
      }

      const updatedExercises = [...customExercises];
      updatedExercises[exerciseIndex] = {
        ...updatedExercises[exerciseIndex],
        ...updates,
      };

      setCustomExercises(updatedExercises);

      try {
        const key = `${CACHE_CONFIG.CUSTOM_EXERCISES_KEY}_${
          user?.id || "guest"
        }`;
        await AsyncStorage.setItem(key, JSON.stringify(updatedExercises));

        Toast.success("התרגיל עודכן בהצלחה");

        // 🚀 עדכון במטמון
        queryClient.setQueryData(
          ["exercise", exerciseId],
          updatedExercises[exerciseIndex]
        );
      } catch (error) {
        console.error("Error saving custom exercises:", error);
        Toast.error("שגיאה בעדכון התרגיל");
      }
    },
    [customExercises, user?.id, queryClient]
  );

  // מחיקת תרגיל מותאם אישית משופרת
  const deleteCustomExercise = useCallback(
    async (exerciseId: string) => {
      Alert.alert("מחיקת תרגיל", "האם אתה בטוח שברצונך למחוק את התרגיל?", [
        {
          text: "ביטול",
          style: "cancel",
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            const deletedExercise = customExercises.find(
              (e) => e.id === exerciseId
            );

            const updatedExercises = customExercises.filter(
              (e) => e.id !== exerciseId
            );
            setCustomExercises(updatedExercises);

            try {
              const key = `${CACHE_CONFIG.CUSTOM_EXERCISES_KEY}_${
                user?.id || "guest"
              }`;
              await AsyncStorage.setItem(key, JSON.stringify(updatedExercises));

              // הסרה גם מהמעדפים
              const newFavorites = new Set(favoriteExercises);
              newFavorites.delete(exerciseId);
              setFavoriteExercises(newFavorites);

              const favKey = `${CACHE_CONFIG.FAVORITES_KEY}_${
                user?.id || "guest"
              }`;
              await AsyncStorage.setItem(
                favKey,
                JSON.stringify(Array.from(newFavorites))
              );

              // 🎨 הודעת מחיקה
              Toast.show(`התרגיל "${deletedExercise?.name}" נמחק`);

              // 🚀 הסרה מהמטמון
              queryClient.removeQueries({
                queryKey: ["exercise", exerciseId],
              });
            } catch (error) {
              console.error("Error deleting exercise:", error);
              Toast.error("שגיאה במחיקת התרגיל");
            }
          },
        },
      ]);
    },
    [customExercises, favoriteExercises, user?.id, queryClient]
  );

  // חיפוש תרגילים משופר
  const searchExercises = useCallback(
    (query: string): Exercise[] => {
      if (!query.trim()) return exercises;

      const searchTerm = query.toLowerCase().trim();

      // 🚀 חיפוש חכם עם ניקוד
      return exercises
        .map((exercise) => {
          let score = 0;
          const name = exercise.name.toLowerCase();
          const description = exercise.description?.toLowerCase() || "";

          // התאמה מדויקת בשם
          if (name === searchTerm) score += 100;
          else if (name.startsWith(searchTerm)) score += 50;
          else if (name.includes(searchTerm)) score += 30;

          // התאמה בתיאור
          if (description.includes(searchTerm)) score += 20;

          // התאמה בשרירים
          if (
            exercise.targetMuscleGroups?.some((muscle) =>
              muscle.toLowerCase().includes(searchTerm)
            )
          )
            score += 15;

          // התאמה בציוד
          if (
            exercise.equipment?.some((equip) =>
              equip.toLowerCase().includes(searchTerm)
            )
          )
            score += 10;

          return { exercise, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ exercise }) => exercise);
    },
    [exercises]
  );

  // סינון תרגילים מתקדם
  const filterExercises = useCallback(
    (filters: ExerciseFilters): Exercise[] => {
      let filtered = exercises;

      // סינון לפי קטגוריה
      if (filters.category) {
        filtered = filtered.filter((e) => e.category === filters.category);
      }

      // סינון לפי קבוצת שרירים
      if (filters.muscleGroup) {
        filtered = filtered.filter((e) =>
          e.targetMuscleGroups?.includes(filters.muscleGroup!)
        );
      }

      // סינון לפי ציוד
      if (filters.equipment) {
        filtered = filtered.filter((e) =>
          e.equipment?.includes(filters.equipment!)
        );
      }

      // סינון לפי רמת קושי
      if (filters.difficulty) {
        filtered = filtered.filter((e) => e.difficulty === filters.difficulty);
      }

      // חיפוש טקסט
      if (filters.searchQuery) {
        const searchResults = searchExercises(filters.searchQuery);
        filtered = filtered.filter((e) => searchResults.includes(e));
      }

      // רק מעדפים
      if (filters.onlyFavorites) {
        filtered = filtered.filter((e) => favoriteExercises.has(e.id));
      }

      // רק מותאמים אישית
      if (filters.onlyCustom) {
        filtered = filtered.filter((e) => (e as any).isCustom);
      }

      return filtered;
    },
    [exercises, favoriteExercises, searchExercises]
  );

  // קבלת תרגילים לפי שריר
  const getExercisesByMuscle = useCallback(
    (muscle: string): Exercise[] => {
      return exercises.filter((e) => e.targetMuscleGroups?.includes(muscle));
    },
    [exercises]
  );

  // קבלת תרגילים לפי ציוד
  const getExercisesByEquipment = useCallback(
    (equipment: string): Exercise[] => {
      return exercises.filter((e) => e.equipment?.includes(equipment));
    },
    [exercises]
  );

  // קבלת תרגילים לפי קטגוריה
  const getExercisesByCategory = useCallback(
    (category: string): Exercise[] => {
      return exercises.filter((e) => e.category === category);
    },
    [exercises]
  );

  // קבלת תרגיל לפי ID
  const getExerciseById = useCallback(
    (id: string): Exercise | undefined => {
      return exercises.find((e) => e.id === id);
    },
    [exercises]
  );

  // קבלת תרגילים קשורים משופר
  const getRelatedExercises = useCallback(
    (exerciseId: string): Exercise[] => {
      const exercise = getExerciseById(exerciseId);
      if (!exercise) return [];

      // 🚀 אלגוריתם חכם יותר
      return exercises
        .filter((e) => e.id !== exerciseId)
        .map((e) => {
          let relevanceScore = 0;

          // אותם שרירים
          const commonMuscles =
            e.targetMuscleGroups?.filter((muscle) =>
              exercise.targetMuscleGroups?.includes(muscle)
            ).length || 0;
          relevanceScore += commonMuscles * 3;

          // אותה קטגוריה
          if (e.category === exercise.category) relevanceScore += 2;

          // אותו ציוד
          const commonEquipment =
            e.equipment?.filter((equip) => exercise.equipment?.includes(equip))
              .length || 0;
          relevanceScore += commonEquipment;

          // אותה רמת קושי
          if (e.difficulty === exercise.difficulty) relevanceScore += 1;

          return { exercise: e, score: relevanceScore };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map(({ exercise }) => exercise);
    },
    [exercises, getExerciseById]
  );

  // תרגילים מומלצים חכמים
  const getSuggestedExercises = useCallback((): Exercise[] => {
    // 🚀 המלצות מבוססות על היסטוריה ומעדפים
    const suggestions: Exercise[] = [];

    // 1. תרגילים מועדפים שלא השתמשת בהם לאחרונה
    const recentIds = recentExercises.map((r) => r.exerciseId);
    const unusedFavorites = exercises.filter(
      (e) => favoriteExercises.has(e.id) && !recentIds.includes(e.id)
    );
    suggestions.push(...unusedFavorites.slice(0, 2));

    // 2. תרגילים פופולריים מקטגוריות שונות
    const categories = ["חזה", "גב", "רגליים", "כתפיים", "ליבה"];
    for (const category of categories) {
      const categoryExercises = exercises.filter(
        (e) => e.category === category && !suggestions.includes(e)
      );
      if (categoryExercises.length > 0) {
        suggestions.push(categoryExercises[0]);
      }
    }

    // 3. תרגילים דומים לאחרונים
    if (recentExercises.length > 0) {
      const lastUsed = getExerciseById(recentExercises[0].exerciseId);
      if (lastUsed) {
        const related = getRelatedExercises(lastUsed.id).filter(
          (e) => !suggestions.includes(e)
        );
        suggestions.push(...related.slice(0, 2));
      }
    }

    return suggestions.slice(0, 8);
  }, [
    exercises,
    favoriteExercises,
    recentExercises,
    getExerciseById,
    getRelatedExercises,
  ]);

  // תרגילים פופולריים משופר
  const getPopularExercises = useCallback((): Exercise[] => {
    // 🚀 שילוב של פופולריות גלובלית ואישית
    const popularByFrequency = recentExercises
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5)
      .map((r) => exercises.find((e) => e.id === r.exerciseId))
      .filter(Boolean) as Exercise[];

    const popularNames = [
      "לחיצת חזה",
      "סקוואט",
      "דדליפט",
      "מתח רחב",
      "לחיצת כתפיים",
      "כפיפות בטן",
    ];

    const popularGlobal = exercises
      .filter((e) => popularNames.some((name) => e.name.includes(name)))
      .filter((e) => !popularByFrequency.includes(e));

    return [...popularByFrequency, ...popularGlobal].slice(0, 10);
  }, [exercises, recentExercises]);

  // תרגילים אחרונים שנעשה בהם שימוש
  const getRecentlyUsedExercises = useCallback((): Exercise[] => {
    return recentExercises
      .sort(
        (a, b) =>
          new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
      )
      .map((r) => exercises.find((e) => e.id === r.exerciseId))
      .filter(Boolean) as Exercise[];
  }, [recentExercises, exercises]);

  return {
    // נתונים
    exercises,
    isLoading,
    isError,
    error: error as Error | null,
    isRefreshing: isRefetching, // 🔧 הוספה

    // מעדפים ומותאמים אישית
    favoriteExercises,
    customExercises,

    // פעולות
    refetch,
    toggleFavorite,
    createCustomExercise,
    deleteCustomExercise,
    updateCustomExercise,
    trackExerciseUse, // 🚀 הוספה

    // חיפוש וסינון
    searchExercises,
    filterExercises,
    getExercisesByMuscle,
    getExercisesByEquipment,
    getExercisesByCategory,

    // כלי עזר
    getExerciseById,
    getRelatedExercises,
    getSuggestedExercises,
    getRecentlyUsedExercises,
    getPopularExercises,
  };
};

// Hook לפרטי תרגיל בודד - כבר קיים ב-useExerciseDetails.ts
// אז נייצא רק לצורך תאימות לאחור
export { useExerciseDetails } from "./useExerciseDetails";

// Export ברירת מחדל
export default useExercises;
