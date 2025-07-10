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

    const weeklyWorkouts = workouts.filter(
      (w) => w.date && w.date >= weekAgo
    ).length;
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
        filtered = filtered.filter((w) => w.date && w.date >= startDate);
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
      switch (sortBy) {
        case "date-desc":
          return b.date!.getTime() - a.date!.getTime();
        case "date-asc":
          return a.date!.getTime() - b.date!.getTime();
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
                message: `סיימתי אימון ${workout.name}! 💪\nזמן: ${workout.duration} דקות\nתרגילים: ${workout.completedExercises}/${workout.totalExercises}`,
              });
            } catch (error) {
              console.error(error);
            }
          },
        },
        {
          text: "מחק",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "מחיקת אימון",
              "האם אתה בטוח שברצונך למחוק את האימון?",
              [
                { text: "ביטול", style: "cancel" },
                {
                  text: "מחק",
                  style: "destructive",
                  onPress: () => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    workoutStore.deleteWorkout(workout.id);
                  },
                },
              ]
            );
          },
        },
        { text: "ביטול", style: "cancel" },
      ]);
    },
    [workoutStore]
  );

  // מעבר למסך התחלת אימון חדש
  const handleStartWorkout = useCallback(() => {
    navigation.navigate("StartWorkout");
  }, [navigation]);

  // החלפת אופן המיון בלחיצה על כפתור המיון
  const handleSortPress = useCallback(() => {
    const sortOptions: WorkoutSortBy[] = [
      "date-desc",
      "date-asc",
      "rating-desc",
      "rating-asc",
      "duration-desc",
      "duration-asc",
    ];

    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    setSortBy(sortOptions[nextIndex]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [sortBy]);

  // פונקציה להמרת סוג המיון לטקסט ידידותי
  const getSortLabel = useCallback((sort: WorkoutSortBy) => {
    switch (sort) {
      case "date-desc":
        return "חדש ביותר";
      case "date-asc":
        return "ישן ביותר";
      case "rating-desc":
        return "דירוג גבוה";
      case "rating-asc":
        return "דירוג נמוך";
      case "duration-desc":
        return "ארוך ביותר";
      case "duration-asc":
        return "קצר ביותר";
      default:
        return "מיון";
    }
  }, []);

  // הסרת סינון ספציפי
  const removeFilter = useCallback(
    (key: keyof WorkoutHistoryFilters) => {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    },
    [filters]
  );

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
