// src/hooks/useExercises.ts - Hook משופר לניהול תרגילים

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useMemo, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { wgerApi } from "../services/wgerApi";
import { Exercise } from "../types/exercise";
import { useNetworkStatus } from "../utils/network";
import { useUserStore } from "../stores/userStore";

// קבועים
const CACHE_CONFIG = {
  EXERCISES_LIST: 1000 * 60 * 60 * 24, // 24 שעות
  EXERCISE_DETAILS: 1000 * 60 * 60 * 24 * 7, // שבוע
  FAVORITES_KEY: "@gymovo_favorite_exercises",
  CUSTOM_EXERCISES_KEY: "@gymovo_custom_exercises",
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

interface UseExercisesReturn {
  // נתונים
  exercises: Exercise[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

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
  const { isConnected } = useNetworkStatus();
  const user = useUserStore((state) => state.user);

  // State
  const [favoriteExercises, setFavoriteExercises] = useState<Set<string>>(
    new Set()
  );
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);

  // טעינת תרגילים מה-API
  const {
    data: apiExercises = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: wgerApi.fetchAllExercises,
    staleTime: CACHE_CONFIG.EXERCISES_LIST,
    gcTime: CACHE_CONFIG.EXERCISES_LIST * 2,
    refetchOnWindowFocus: false,
    retry: isConnected ? 3 : 0,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

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

    const loadData = async () => {
      await loadFavorites();
      await loadCustomExercises();
    };
    loadData();
  }, [user?.id]);

  // שילוב כל התרגילים (API + מותאמים אישית)
  const exercises = useMemo(() => {
    return [...apiExercises, ...customExercises];
  }, [apiExercises, customExercises]);

  // החלפת מעדיף/לא מעדיף
  const toggleFavorite = useCallback(
    async (exerciseId: string) => {
      const newFavorites = new Set(favoriteExercises);

      if (newFavorites.has(exerciseId)) {
        newFavorites.delete(exerciseId);
      } else {
        newFavorites.add(exerciseId);
      }

      setFavoriteExercises(newFavorites);

      try {
        const key = `${CACHE_CONFIG.FAVORITES_KEY}_${user?.id || "guest"}`;
        await AsyncStorage.setItem(
          key,
          JSON.stringify(Array.from(newFavorites))
        );
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    },
    [favoriteExercises, user?.id]
  );

  // יצירת תרגיל מותאם אישית
  const createCustomExercise = useCallback(
    async (
      exercise: Omit<
        CustomExercise,
        "id" | "createdAt" | "createdBy" | "isCustom"
      >
    ) => {
      if (!exercise.name?.trim()) {
        Alert.alert("שגיאה", "חובה להזין שם לתרגיל");
        return;
      }

      const newExercise: CustomExercise = {
        ...exercise,
        id: `custom_${Date.now()}`,
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
      } catch (error) {
        console.error("Error saving custom exercises:", error);
      }

      Alert.alert("הצלחה", "התרגיל נוצר בהצלחה!");
    },
    [customExercises, user?.id]
  );

  // עדכון תרגיל מותאם אישית
  const updateCustomExercise = useCallback(
    async (exerciseId: string, updates: Partial<Exercise>) => {
      const exerciseIndex = customExercises.findIndex(
        (e) => e.id === exerciseId
      );

      if (exerciseIndex === -1) {
        Alert.alert("שגיאה", "התרגיל לא נמצא");
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
      } catch (error) {
        console.error("Error saving custom exercises:", error);
      }
    },
    [customExercises, user?.id]
  );

  // מחיקת תרגיל מותאם אישית
  const deleteCustomExercise = useCallback(
    async (exerciseId: string) => {
      Alert.alert("מחיקת תרגיל", "האם אתה בטוח שברצונך למחוק את התרגיל?", [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            const updatedExercises = customExercises.filter(
              (e) => e.id !== exerciseId
            );
            setCustomExercises(updatedExercises);

            try {
              const key = `${CACHE_CONFIG.CUSTOM_EXERCISES_KEY}_${
                user?.id || "guest"
              }`;
              await AsyncStorage.setItem(key, JSON.stringify(updatedExercises));
            } catch (error) {
              console.error("Error saving custom exercises:", error);
            }

            // הסרה גם מהמעדפים
            const newFavorites = new Set(favoriteExercises);
            newFavorites.delete(exerciseId);
            setFavoriteExercises(newFavorites);

            try {
              const favKey = `${CACHE_CONFIG.FAVORITES_KEY}_${
                user?.id || "guest"
              }`;
              await AsyncStorage.setItem(
                favKey,
                JSON.stringify(Array.from(newFavorites))
              );
            } catch (error) {
              console.error("Error saving favorites:", error);
            }
          },
        },
      ]);
    },
    [customExercises, favoriteExercises, user?.id]
  );

  // חיפוש תרגילים
  const searchExercises = useCallback(
    (query: string): Exercise[] => {
      if (!query.trim()) return exercises;

      const searchTerm = query.toLowerCase().trim();
      return exercises.filter((exercise) => {
        return (
          exercise.name.toLowerCase().includes(searchTerm) ||
          exercise.description?.toLowerCase().includes(searchTerm) ||
          exercise.category?.toLowerCase().includes(searchTerm) ||
          exercise.targetMuscleGroups?.some((muscle) =>
            muscle.toLowerCase().includes(searchTerm)
          ) ||
          exercise.equipment?.some((equip) =>
            equip.toLowerCase().includes(searchTerm)
          )
        );
      });
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

  // קבלת תרגילים קשורים
  const getRelatedExercises = useCallback(
    (exerciseId: string): Exercise[] => {
      const exercise = getExerciseById(exerciseId);
      if (!exercise) return [];

      // מחפשים תרגילים עם אותם שרירים או קטגוריה
      return exercises
        .filter((e) => {
          if (e.id === exerciseId) return false;

          const sameMuscles = e.targetMuscleGroups?.some((muscle) =>
            exercise.targetMuscleGroups?.includes(muscle)
          );
          const sameCategory = e.category === exercise.category;
          const sameEquipment = e.equipment?.some((equip) =>
            exercise.equipment?.includes(equip)
          );

          return sameMuscles || sameCategory || sameEquipment;
        })
        .slice(0, 6); // מגבילים ל-6 תרגילים
    },
    [exercises, getExerciseById]
  );

  // תרגילים מומלצים (לפי היסטוריה או פופולריות)
  const getSuggestedExercises = useCallback((): Exercise[] => {
    // בגרסה מלאה - לפי היסטוריית אימונים
    // כרגע מחזירים תרגילים מגוונים
    const categories = ["חזה", "גב", "רגליים", "כתפיים", "ליבה"];
    const suggested: Exercise[] = [];

    for (const category of categories) {
      const categoryExercises = exercises.filter(
        (e) => e.category === category
      );
      if (categoryExercises.length > 0) {
        suggested.push(categoryExercises[0]);
      }
    }

    return suggested.slice(0, 5);
  }, [exercises]);

  // תרגילים פופולריים
  const getPopularExercises = useCallback((): Exercise[] => {
    // בגרסה מלאה - לפי סטטיסטיקות שימוש
    // כרגע מחזירים תרגילים בסיסיים נפוצים
    const popularNames = [
      "לחיצת חזה",
      "סקוואט",
      "דדליפט",
      "מתח רחב",
      "לחיצת כתפיים",
      "כפיפות בטן",
    ];

    return exercises
      .filter((e) => popularNames.some((name) => e.name.includes(name)))
      .slice(0, 10);
  }, [exercises]);

  // תרגילים אחרונים שנעשה בהם שימוש
  const getRecentlyUsedExercises = useCallback((): Exercise[] => {
    // בגרסה מלאה - מהיסטוריית אימונים
    // כרגע מחזירים רשימה ריקה
    return [];
  }, []);

  return {
    // נתונים
    exercises,
    isLoading,
    isError,
    error: error as Error | null,

    // מעדפים ומותאמים אישית
    favoriteExercises,
    customExercises,

    // פעולות
    refetch,
    toggleFavorite,
    createCustomExercise,
    deleteCustomExercise,
    updateCustomExercise,

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

// Hook לפרטי תרגיל בודד
export const useExerciseDetails = (exerciseId: string) => {
  const { isConnected } = useNetworkStatus();

  return useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: () => wgerApi.fetchExerciseById(exerciseId),
    staleTime: CACHE_CONFIG.EXERCISE_DETAILS,
    gcTime: CACHE_CONFIG.EXERCISE_DETAILS * 2,
    enabled: !!exerciseId && isConnected === true,
    retry: 2,
  });
};

// Export ברירת מחדל
export default useExercises;
