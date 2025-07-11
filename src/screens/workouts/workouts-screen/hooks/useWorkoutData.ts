// src/screens/workouts/workouts-screen/hooks/useWorkoutData.ts
// הוק מותאם לניהול נתוני אימונים - מנהל state, סינון, מיון ואירועים

import { useCallback, useMemo, useState } from "react";
import { Alert, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { Workout, WorkoutSortBy } from "../../../../types/workout";
import { RootStackParamList } from "../../../../types/navigation";
import { useWorkoutStore } from "../../../../stores/workoutStore";
import {
  WorkoutHistoryFilters,
  WorkoutStats,
} from "../../../../components/workout-history";

export interface UseWorkoutDataReturn {
  // State
  filters: WorkoutHistoryFilters;
  sortBy: WorkoutSortBy;
  refreshing: boolean;
  showFilterModal: boolean;
  showStats: boolean;

  // Data
  workouts: Workout[];
  filteredWorkouts: Workout[];
  stats: WorkoutStats;
  activeFiltersCount: number;
  isLoading: boolean;
  isError: boolean;

  // Actions
  setFilters: (filters: WorkoutHistoryFilters) => void;
  setSortBy: (sortBy: WorkoutSortBy) => void;
  setShowFilterModal: (show: boolean) => void;
  setShowStats: (show: boolean) => void;
  handleRefresh: () => Promise<void>;
  handleWorkoutPress: (workout: Workout) => void;
  handleWorkoutLongPress: (workout: Workout) => void;
  handleStartWorkout: () => void;
  handleSortPress: () => void;
  getSortLabel: (sort: WorkoutSortBy) => string;
  removeFilter: (key: keyof WorkoutHistoryFilters) => void;
}

/**
 * הוק מותאם לניהול נתוני היסטוריית אימונים
 * מנהל את כל הלוגיקה העסקית של המסך
 */
export const useWorkoutData = (): UseWorkoutDataReturn => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const workoutStore = useWorkoutStore();

  // State management
  const [filters, setFilters] = useState<WorkoutHistoryFilters>({});
  const [sortBy, setSortBy] = useState<WorkoutSortBy>("date-desc");
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // קבלת אימונים מה-store
  const workouts = workoutStore.workouts || [];
  const isLoading = false; // ניתן להוסיף loading state ל-store
  const isError = false; // ניתן להוסיף error state ל-store

  // חישוב סטטיסטיקות בזמן אמת
  const stats = useMemo((): WorkoutStats => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // ✅ תיקון: המרת תאריכים ל-Date objects
    const weeklyWorkouts = workouts.filter((w) => {
      if (!w.date) return false;
      const workoutDate = w.date instanceof Date ? w.date : new Date(w.date);
      return !isNaN(workoutDate.getTime()) && workoutDate >= weekAgo;
    }).length;

    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0
    );
    const ratingsCount = workouts.filter((w) => w.rating).length;
    const averageRating =
      ratingsCount > 0
        ? workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / ratingsCount
        : 0;

    return {
      totalWorkouts: workouts.length,
      weeklyWorkouts,
      totalDuration,
      averageRating,
    };
  }, [workouts]);

  // סינון ומיון אימונים לפי הגדרות המשתמש
  const filteredWorkouts = useMemo(() => {
    let filtered = [...workouts];

    // החלת סינונים
    if (filters.dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "3months":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }

      if (filters.dateRange !== "all") {
        // ✅ תיקון: המרת תאריכים לפני השוואה
        filtered = filtered.filter((w) => {
          if (!w.date) return false;
          const workoutDate =
            w.date instanceof Date ? w.date : new Date(w.date);
          return !isNaN(workoutDate.getTime()) && workoutDate >= startDate;
        });
      }
    }

    if (filters.minRating) {
      filtered = filtered.filter((w) => (w.rating || 0) >= filters.minRating!);
    }

    if (filters.minDuration) {
      filtered = filtered.filter(
        (w) => w.duration && w.duration >= filters.minDuration!
      );
    }

    // החלת מיון
    filtered.sort((a, b) => {
      // ✅ תיקון: המרת תאריכים לפני מיון
      const getDateValue = (workout: Workout): number => {
        if (!workout.date) return 0;
        const date =
          workout.date instanceof Date ? workout.date : new Date(workout.date);
        return !isNaN(date.getTime()) ? date.getTime() : 0;
      };

      switch (sortBy) {
        case "date-desc":
          return getDateValue(b) - getDateValue(a);
        case "date-asc":
          return getDateValue(a) - getDateValue(b);
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "duration-desc":
          return (b.duration || 0) - (a.duration || 0);
        case "duration-asc":
          return (a.duration || 0) - (b.duration || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [workouts, filters, sortBy]);

  // חישוב מספר הסינונים הפעילים
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => filters[key as keyof WorkoutHistoryFilters] !== undefined
    ).length;
  }, [filters]);

  // פונקציה לרענון הרשימה
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // טיפול בלחיצה על אימון - מעבר למסך סיכום
  const handleWorkoutPress = useCallback(
    (workout: Workout) => {
      navigation.navigate("WorkoutSummary", { workoutData: workout });
    },
    [navigation]
  );

  // טיפול בלחיצה ארוכה על אימון - תפריט פעולות
  const handleWorkoutLongPress = useCallback(
    (workout: Workout) => {
      Alert.alert("אפשרויות אימון", "מה תרצה לעשות?", [
        {
          text: "שתף",
          onPress: async () => {
            try {
              await Share.share({
                message: `סיימתי אימון ${workout.name}!\n💪 ${workout.exercises.length} תרגילים\n⏱️ ${workout.duration} דקות`,
                title: workout.name,
              });
            } catch (error) {
              console.error("Share error:", error);
            }
          },
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            Alert.alert("מחיקת אימון", "האם אתה בטוח?", [
              { text: "ביטול", style: "cancel" },
              {
                text: "מחק",
                style: "destructive",
                onPress: () => {
                  workoutStore.deleteWorkout(workout.id);
                  console.log("Workout deleted");
                },
              },
            ]);
          },
        },
        { text: "ביטול", style: "cancel" },
      ]);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
    [workoutStore]
  );

  // מעבר למסך התחלת אימון
  const handleStartWorkout = useCallback(() => {
    navigation.navigate("StartWorkout");
  }, [navigation]);

  // טיפול בשינוי מיון
  const handleSortPress = useCallback(() => {
    const sortOptions: WorkoutSortBy[] = [
      "date-desc",
      "date-asc",
      "rating-desc",
      "duration-desc",
    ];

    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [sortBy]);

  // קבלת תווית למיון
  const getSortLabel = useCallback((sort: WorkoutSortBy): string => {
    switch (sort) {
      case "date-desc":
        return "חדש לישן";
      case "date-asc":
        return "ישן לחדש";
      case "rating-desc":
        return "דירוג גבוה";
      case "rating-asc":
        return "דירוג נמוך";
      case "duration-desc":
        return "ארוך לקצר";
      case "duration-asc":
        return "קצר לארוך";
      default:
        return "";
    }
  }, []);

  // הסרת פילטר בודד
  const removeFilter = useCallback((key: keyof WorkoutHistoryFilters) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    // State
    filters,
    sortBy,
    refreshing,
    showFilterModal,
    showStats,

    // Data
    workouts,
    filteredWorkouts,
    stats,
    activeFiltersCount,
    isLoading,
    isError,

    // Actions
    setFilters,
    setSortBy,
    setShowFilterModal,
    setShowStats,
    handleRefresh,
    handleWorkoutPress,
    handleWorkoutLongPress,
    handleStartWorkout,
    handleSortPress,
    getSortLabel,
    removeFilter,
  };
};
