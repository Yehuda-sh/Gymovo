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

  // קבלת אימונים מה-store עם memoization
  const workouts = useMemo(() => {
    return workoutStore.workouts || [];
  }, [workoutStore.workouts]);

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
      return workoutDate >= weekAgo;
    });

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
      weeklyWorkouts: weeklyWorkouts.length,
      totalDuration,
      averageRating,
    };
  }, [workouts]);

  // סינון אימונים לפי פילטרים
  const filteredWorkouts = useMemo(() => {
    let filtered = [...workouts];

    // סינון לפי תקופה
    if (filters.dateRange) {
      const now = new Date();
      let startDate: Date;

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
        default:
          startDate = new Date(0);
      }

      if (filters.dateRange !== "all") {
        filtered = filtered.filter((w) => {
          if (!w.date) return false;
          const workoutDate =
            w.date instanceof Date ? w.date : new Date(w.date);
          return workoutDate >= startDate;
        });
      }
    }

    // סינון לפי דירוג מינימלי
    if (filters.minRating) {
      filtered = filtered.filter((w) => (w.rating || 0) >= filters.minRating!);
    }

    // סינון לפי משך מינימלי
    if (filters.minDuration) {
      filtered = filtered.filter(
        (w) => (w.duration || 0) >= filters.minDuration!
      );
    }

    // סינון לפי תוכנית
    if (filters.planId) {
      filtered = filtered.filter((w) => w.planId === filters.planId);
    }

    // סינון לפי סוג תרגיל
    if (filters.exerciseType) {
      filtered = filtered.filter((w) =>
        w.exercises.some(
          (e) => e.exercise?.name?.includes(filters.exerciseType!) || false
        )
      );
    }

    // מיון
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
        case "date-asc":
          return (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
        case "duration-desc":
          return (b.duration || 0) - (a.duration || 0);
        case "duration-asc":
          return (a.duration || 0) - (b.duration || 0);
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-asc":
          return (a.rating || 0) - (b.rating || 0);
        case "volume-desc":
        case "volume-asc":
          // חישוב נפח כולל
          const getVolume = (workout: Workout) =>
            workout.exercises.reduce(
              (total, ex) =>
                total +
                ex.sets.reduce(
                  (setTotal, set) =>
                    setTotal + (set.weight || 0) * (set.reps || 0),
                  0
                ),
              0
            );

          const volA = getVolume(a);
          const volB = getVolume(b);
          return sortBy === "volume-desc" ? volB - volA : volA - volB;
        default:
          return 0;
      }
    });

    return filtered;
  }, [workouts, filters, sortBy]);

  // ספירת פילטרים פעילים
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange) count++;
    if (filters.planId) count++;
    if (filters.exerciseType) count++;
    if (filters.minDuration) count++;
    if (filters.minRating) count++;
    return count;
  }, [filters]);

  // Action handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // כאן ניתן להוסיף לוגיקה לרענון נתונים מהשרת
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate API call
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleWorkoutPress = useCallback(
    (workout: Workout) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // נווט למסך סיכום אימון
      navigation.navigate("WorkoutSummary", { workoutData: workout });
    },
    [navigation]
  );

  const handleWorkoutLongPress = useCallback(
    (workout: Workout) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert("אפשרויות", undefined, [
        {
          text: "שתף",
          onPress: async () => {
            try {
              await Share.share({
                message: `סיימתי אימון ב-Gymovo! 💪\n${
                  workout.duration
                } דקות\n${workout.totalWeight || 0}ק"ג`,
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

  const handleStartWorkout = useCallback(() => {
    navigation.navigate("StartWorkout");
  }, [navigation]);

  const handleSortPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const sortOptions: { label: string; value: WorkoutSortBy }[] = [
      { label: "תאריך - חדש לישן", value: "date-desc" },
      { label: "תאריך - ישן לחדש", value: "date-asc" },
      { label: "משך - ארוך לקצר", value: "duration-desc" },
      { label: "משך - קצר לארוך", value: "duration-asc" },
      { label: "דירוג - גבוה לנמוך", value: "rating-desc" },
      { label: "דירוג - נמוך לגבוה", value: "rating-asc" },
      { label: "נפח - גבוה לנמוך", value: "volume-desc" },
      { label: "נפח - נמוך לגבוה", value: "volume-asc" },
    ];

    Alert.alert("מיין לפי", undefined, [
      ...sortOptions.map((option) => ({
        text: option.label,
        onPress: () => setSortBy(option.value),
      })),
      { text: "ביטול", style: "cancel" },
    ]);
  }, []);

  const getSortLabel = useCallback((sort: WorkoutSortBy): string => {
    const labels: Record<WorkoutSortBy, string> = {
      "date-desc": "תאריך ↓",
      "date-asc": "תאריך ↑",
      "duration-desc": "משך ↓",
      "duration-asc": "משך ↑",
      "rating-desc": "דירוג ↓",
      "rating-asc": "דירוג ↑",
      "volume-desc": "נפח ↓",
      "volume-asc": "נפח ↑",
      "reps-desc": "חזרות ↓",
      "reps-asc": "חזרות ↑",
    };
    return labels[sort];
  }, []);

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
