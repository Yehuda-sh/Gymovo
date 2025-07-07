// src/hooks/useWorkoutHistory.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  deleteWorkoutFromHistory,
  getWorkoutHistory,
  saveWorkoutToHistory,
} from "../data/storage";
import { UserState, useUserStore } from "../stores/userStore";
import { Workout } from "../types/workout";

// 📊 Statistics Types
export interface WorkoutStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  currentStreak: number;
  totalVolume: number;
  weeklyVolume: number;
  averageRating: number;
  totalDuration: number;
  averageDuration: number;
  favoriteExercises: string[];
  progressTrend: "up" | "down" | "stable";
}

// 🔧 Filter Options
export interface WorkoutHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  rating?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  muscles?: string[];
  minDuration?: number;
  maxDuration?: number;
  exerciseName?: string;
}

// 📈 Sort Options
export type WorkoutSortBy =
  | "date-desc"
  | "date-asc"
  | "rating-desc"
  | "rating-asc"
  | "duration-desc"
  | "duration-asc"
  | "volume-desc"
  | "volume-asc";

// 🎯 Hook Options
export interface UseWorkoutHistoryOptions {
  limit?: number;
  filters?: WorkoutHistoryFilters;
  sortBy?: WorkoutSortBy;
  enableRealTime?: boolean;
  staleTime?: number;
  enableOptimisticUpdates?: boolean;
}

/**
 * 🚀 Enhanced Hook לניהול היסטוריית אימונים מתקדם
 *
 * Features:
 * - ✅ Statistics calculations
 * - ✅ Advanced filtering & sorting
 * - ✅ Optimistic updates
 * - ✅ Real-time synchronization
 * - ✅ Performance optimizations
 * - ✅ Error handling & retry
 * - ✅ Memory management
 */
export const useWorkoutHistory = (options: UseWorkoutHistoryOptions = {}) => {
  const {
    limit,
    filters,
    sortBy = "date-desc",
    enableRealTime = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    enableOptimisticUpdates = true,
  } = options;

  const userId = useUserStore((state: UserState) => state.user?.id);
  const queryClient = useQueryClient();

  // 📊 Query Key Generator
  const generateQueryKey = useCallback(() => {
    return ["workouts", userId, { limit, filters, sortBy }];
  }, [userId, limit, filters, sortBy]);

  // 🔍 Main Query
  const query = useQuery({
    queryKey: generateQueryKey(),
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      console.log("🔄 Fetching workout history...");
      const workouts = await getWorkoutHistory(userId, limit);

      // Apply filters
      let filteredWorkouts = workouts;
      if (filters) {
        filteredWorkouts = applyFilters(workouts, filters);
      }

      // Apply sorting
      filteredWorkouts = applySorting(filteredWorkouts, sortBy);

      console.log(`✅ Loaded ${filteredWorkouts.length} workouts`);
      return filteredWorkouts;
    },
    enabled: !!userId,
    staleTime,
    refetchOnWindowFocus: enableRealTime,
    refetchInterval: enableRealTime ? 30000 : false, // 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("❌ Failed to fetch workout history:", error);
    },
  });

  // 💾 Save Workout Mutation
  const saveWorkoutMutation = useMutation({
    mutationFn: async (workout: Workout) => {
      if (!userId) throw new Error("User not authenticated");

      const workoutToSave = {
        ...workout,
        completedAt: workout.completedAt || new Date().toISOString(),
        id: workout.id || `workout_${Date.now()}`,
      };

      await saveWorkoutToHistory(userId, workoutToSave);
      return workoutToSave;
    },
    onMutate: async (newWorkout) => {
      if (!enableOptimisticUpdates) return;

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: generateQueryKey() });

      // Snapshot previous value
      const previousWorkouts = queryClient.getQueryData<Workout[]>(
        generateQueryKey()
      );

      // Optimistically update
      if (previousWorkouts) {
        const optimisticWorkout = {
          ...newWorkout,
          completedAt: newWorkout.completedAt || new Date().toISOString(),
          id: newWorkout.id || `temp_${Date.now()}`,
        };

        queryClient.setQueryData<Workout[]>(generateQueryKey(), [
          optimisticWorkout,
          ...previousWorkouts,
        ]);
      }

      return { previousWorkouts };
    },
    onError: (error, variables, context) => {
      console.error("❌ Failed to save workout:", error);

      // Rollback on error
      if (context?.previousWorkouts) {
        queryClient.setQueryData(generateQueryKey(), context.previousWorkouts);
      }
    },
    onSuccess: (savedWorkout) => {
      console.log("✅ Workout saved successfully:", savedWorkout.name);

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
    },
  });

  // 🗑️ Delete Workout Mutation
  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId: string) => {
      if (!userId) throw new Error("User not authenticated");
      await deleteWorkoutFromHistory(userId, workoutId);
      return workoutId;
    },
    onMutate: async (workoutId) => {
      if (!enableOptimisticUpdates) return;

      await queryClient.cancelQueries({ queryKey: generateQueryKey() });
      const previousWorkouts = queryClient.getQueryData<Workout[]>(
        generateQueryKey()
      );

      if (previousWorkouts) {
        queryClient.setQueryData<Workout[]>(
          generateQueryKey(),
          previousWorkouts.filter((w) => w.id !== workoutId)
        );
      }

      return { previousWorkouts };
    },
    onError: (error, variables, context) => {
      console.error("❌ Failed to delete workout:", error);
      if (context?.previousWorkouts) {
        queryClient.setQueryData(generateQueryKey(), context.previousWorkouts);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
    },
  });

  // 📊 Statistics Calculation (Memoized for performance)
  const stats = useMemo((): WorkoutStats => {
    if (!query.data) {
      return {
        totalWorkouts: 0,
        weeklyWorkouts: 0,
        monthlyWorkouts: 0,
        currentStreak: 0,
        totalVolume: 0,
        weeklyVolume: 0,
        averageRating: 0,
        totalDuration: 0,
        averageDuration: 0,
        favoriteExercises: [],
        progressTrend: "stable",
      };
    }

    return calculateWorkoutStats(query.data);
  }, [query.data]);

  // 🔄 Refresh Function
  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["workouts", userId] });
  }, [queryClient, userId]);

  // 🧹 Clear Cache Function
  const clearCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ["workouts", userId] });
  }, [queryClient, userId]);

  // 📱 Prefetch Next Page (for pagination)
  const prefetchNextPage = useCallback(
    (nextLimit: number) => {
      if (!userId) return;

      queryClient.prefetchQuery({
        queryKey: ["workouts", userId, { limit: nextLimit, filters, sortBy }],
        queryFn: () => getWorkoutHistory(userId, nextLimit),
        staleTime: 60000, // 1 minute
      });
    },
    [queryClient, userId, filters, sortBy]
  );

  return {
    // 📊 Data
    workouts: query.data || [],
    stats,

    // 🔄 Loading States
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // 💾 Mutations
    saveWorkout: saveWorkoutMutation.mutate,
    deleteWorkout: deleteWorkoutMutation.mutate,
    isSaving: saveWorkoutMutation.isPending,
    isDeleting: deleteWorkoutMutation.isPending,

    // 🔧 Utilities
    refresh,
    clearCache,
    prefetchNextPage,

    // 📈 Advanced
    hasNextPage: query.data && limit ? query.data.length >= limit : false,
    isEmpty: query.data?.length === 0,
    queryKey: generateQueryKey(),
  };
};

// 🔍 Helper Functions

/**
 * Apply filters to workout array
 */
function applyFilters(
  workouts: Workout[],
  filters: WorkoutHistoryFilters
): Workout[] {
  return workouts.filter((workout) => {
    // Date range filter
    if (
      filters.dateFrom &&
      new Date(workout.date || workout.completedAt || 0) <
        new Date(filters.dateFrom)
    ) {
      return false;
    }
    if (
      filters.dateTo &&
      new Date(workout.date || workout.completedAt || 0) >
        new Date(filters.dateTo)
    ) {
      return false;
    }

    // Rating filter
    if (filters.rating && workout.rating !== filters.rating) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty && workout.difficulty !== filters.difficulty) {
      return false;
    }

    // Duration filter
    if (filters.minDuration && (workout.duration || 0) < filters.minDuration) {
      return false;
    }
    if (filters.maxDuration && (workout.duration || 0) > filters.maxDuration) {
      return false;
    }

    // Exercise name filter
    if (filters.exerciseName) {
      const hasExercise = workout.exercises.some((ex) =>
        ex.name.toLowerCase().includes(filters.exerciseName!.toLowerCase())
      );
      if (!hasExercise) return false;
    }

    // Muscles filter
    if (filters.muscles && filters.muscles.length > 0) {
      const workoutMuscles = workout.targetMuscles || [];
      const hasMatchingMuscle = filters.muscles.some((muscle) =>
        workoutMuscles.includes(muscle)
      );
      if (!hasMatchingMuscle) return false;
    }

    return true;
  });
}

/**
 * Apply sorting to workout array
 */
function applySorting(workouts: Workout[], sortBy: WorkoutSortBy): Workout[] {
  const sorted = [...workouts];

  switch (sortBy) {
    case "date-desc":
      return sorted.sort(
        (a, b) =>
          new Date(b.completedAt || b.date || 0).getTime() -
          new Date(a.completedAt || a.date || 0).getTime()
      );
    case "date-asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.completedAt || a.date || 0).getTime() -
          new Date(b.completedAt || b.date || 0).getTime()
      );
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case "rating-asc":
      return sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    case "duration-desc":
      return sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    case "duration-asc":
      return sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    case "volume-desc":
      return sorted.sort(
        (a, b) => calculateWorkoutVolume(b) - calculateWorkoutVolume(a)
      );
    case "volume-asc":
      return sorted.sort(
        (a, b) => calculateWorkoutVolume(a) - calculateWorkoutVolume(b)
      );
    default:
      return sorted;
  }
}

/**
 * Calculate total volume for a workout
 */
function calculateWorkoutVolume(workout: Workout): number {
  return workout.exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
      return setTotal + (set.weight || 0) * (set.reps || 0);
    }, 0);
    return total + exerciseVolume;
  }, 0);
}

/**
 * Calculate comprehensive workout statistics
 */
function calculateWorkoutStats(workouts: Workout[]): WorkoutStats {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Basic counts
  const totalWorkouts = workouts.length;
  const weeklyWorkouts = workouts.filter(
    (w) => new Date(w.completedAt || w.date || 0) >= oneWeekAgo
  ).length;
  const monthlyWorkouts = workouts.filter(
    (w) => new Date(w.completedAt || w.date || 0) >= oneMonthAgo
  ).length;

  // Volume calculations
  const totalVolume = workouts.reduce(
    (sum, w) => sum + calculateWorkoutVolume(w),
    0
  );
  const weeklyVolume = workouts
    .filter((w) => new Date(w.completedAt || w.date || 0) >= oneWeekAgo)
    .reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);

  // Duration calculations
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const averageDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

  // Rating calculation
  const ratedWorkouts = workouts.filter((w) => w.rating);
  const averageRating =
    ratedWorkouts.length > 0
      ? ratedWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) /
        ratedWorkouts.length
      : 0;

  // Current streak calculation
  const sortedWorkouts = workouts.sort(
    (a, b) =>
      new Date(b.completedAt || b.date || 0).getTime() -
      new Date(a.completedAt || a.date || 0).getTime()
  );

  let currentStreak = 0;
  let lastWorkoutDate = now;

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.completedAt || workout.date || 0);
    const daysDiff = Math.floor(
      (lastWorkoutDate.getTime() - workoutDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 2) {
      // Allow for one rest day
      currentStreak++;
      lastWorkoutDate = workoutDate;
    } else {
      break;
    }
  }

  // Favorite exercises
  const exerciseCount: { [key: string]: number } = {};
  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      exerciseCount[exercise.name] = (exerciseCount[exercise.name] || 0) + 1;
    });
  });

  const favoriteExercises = Object.entries(exerciseCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name);

  // Progress trend (comparing last 2 weeks)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const lastTwoWeeksVolume = workouts
    .filter((w) => {
      const date = new Date(w.completedAt || w.date || 0);
      return date >= oneWeekAgo && date <= now;
    })
    .reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);

  const previousTwoWeeksVolume = workouts
    .filter((w) => {
      const date = new Date(w.completedAt || w.date || 0);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    })
    .reduce((sum, w) => sum + calculateWorkoutVolume(w), 0);

  let progressTrend: "up" | "down" | "stable" = "stable";
  if (lastTwoWeeksVolume > previousTwoWeeksVolume * 1.1) {
    progressTrend = "up";
  } else if (lastTwoWeeksVolume < previousTwoWeeksVolume * 0.9) {
    progressTrend = "down";
  }

  return {
    totalWorkouts,
    weeklyWorkouts,
    monthlyWorkouts,
    currentStreak,
    totalVolume,
    weeklyVolume,
    averageRating,
    totalDuration,
    averageDuration,
    favoriteExercises,
    progressTrend,
  };
}

// 🚀 Specialized Hooks for specific use cases

/**
 * Hook for recent workouts only
 */
export const useRecentWorkouts = (days: number = 7) => {
  const dateFrom = new Date(
    Date.now() - days * 24 * 60 * 60 * 1000
  ).toISOString();

  return useWorkoutHistory({
    filters: { dateFrom },
    sortBy: "date-desc",
    limit: 20,
  });
};

/**
 * Hook for workout statistics only
 */
export const useWorkoutStats = () => {
  const { stats, isLoading, isError } = useWorkoutHistory({
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return { stats, isLoading, isError };
};

/**
 * Hook for searching workouts
 */
export const useWorkoutSearch = (searchTerm: string) => {
  return useWorkoutHistory({
    filters: {
      exerciseName: searchTerm,
    },
    sortBy: "date-desc",
    limit: 50,
  });
};
