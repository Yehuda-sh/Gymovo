// src/hooks/useWorkoutHistory.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import {
  getWorkoutHistory,
  saveWorkoutToHistory,
  deleteWorkoutFromHistory,
} from "../data/storage";
import { useUserStore } from "../stores/userStore";
import { Workout } from "../types/workout";

// מחייבים לייצא את הטיפוסים האלה כי WorkoutsScreen משתמש בהם
export type WorkoutSortBy =
  | "date-desc"
  | "date-asc"
  | "rating-desc"
  | "rating-asc"
  | "duration-desc"
  | "duration-asc"
  | "volume-desc"
  | "volume-asc";

export interface WorkoutHistoryFilters {
  dateRange?: { start: string; end: string };
  minRating?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  minDuration?: number;
  maxDuration?: number;
  targetMuscles?: string[];
}

/**
 * Hook לניהול היסטוריית אימונים
 * כולל סינון, מיון וסטטיסטיקות
 */
export const useWorkoutHistory = ({
  filters,
  sortBy = "date-desc",
  enableOptimisticUpdates = true,
}: {
  filters?: WorkoutHistoryFilters;
  sortBy?: WorkoutSortBy;
  enableOptimisticUpdates?: boolean;
} = {}) => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  // שליפת היסטוריית אימונים
  const {
    data: allWorkouts = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["workoutHistory", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getWorkoutHistory(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 דקות
  });

  // סינון האימונים
  const filteredWorkouts = useMemo(() => {
    let workouts = [...allWorkouts];

    if (filters) {
      // סינון לפי תאריכים
      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        workouts = workouts.filter((w) => {
          // בדיקה שיש תאריך תקף
          const workoutDateStr = w.completedAt || w.date;
          if (!workoutDateStr) return false;

          const workoutDate = new Date(workoutDateStr);
          return workoutDate >= startDate && workoutDate <= endDate;
        });
      }

      // סינון לפי דירוג
      if (filters.minRating) {
        workouts = workouts.filter(
          (w) => (w.rating || 0) >= filters.minRating!
        );
      }

      // סינון לפי רמת קושי
      if (filters.difficulty) {
        workouts = workouts.filter((w) =>
          w.exercises.some((e) => e.exercise.difficulty === filters.difficulty)
        );
      }

      // סינון לפי משך אימון
      if (filters.minDuration) {
        workouts = workouts.filter(
          (w) => (w.duration || 0) >= filters.minDuration!
        );
      }
      if (filters.maxDuration) {
        workouts = workouts.filter(
          (w) => (w.duration || 0) <= filters.maxDuration!
        );
      }

      // סינון לפי קבוצות שרירים
      if (filters.targetMuscles && filters.targetMuscles.length > 0) {
        workouts = workouts.filter((w) =>
          w.exercises.some((e) =>
            filters.targetMuscles?.includes(e.exercise.primaryMuscle || "")
          )
        );
      }
    }

    return workouts;
  }, [allWorkouts, filters]);

  // מיון האימונים
  const sortedWorkouts = useMemo(() => {
    const sorted = [...filteredWorkouts];

    switch (sortBy) {
      case "date-desc":
        sorted.sort((a, b) => {
          const dateA = new Date(a.completedAt || a.date || 0).getTime();
          const dateB = new Date(b.completedAt || b.date || 0).getTime();
          return dateB - dateA;
        });
        break;
      case "date-asc":
        sorted.sort((a, b) => {
          const dateA = new Date(a.completedAt || a.date || 0).getTime();
          const dateB = new Date(b.completedAt || b.date || 0).getTime();
          return dateA - dateB;
        });
        break;
      case "rating-desc":
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-asc":
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "duration-desc":
        sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
      case "duration-asc":
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case "volume-desc":
        sorted.sort((a, b) => {
          const volumeA = calculateWorkoutVolume(a);
          const volumeB = calculateWorkoutVolume(b);
          return volumeB - volumeA;
        });
        break;
      case "volume-asc":
        sorted.sort((a, b) => {
          const volumeA = calculateWorkoutVolume(a);
          const volumeB = calculateWorkoutVolume(b);
          return volumeA - volumeB;
        });
        break;
    }

    return sorted;
  }, [filteredWorkouts, sortBy]);

  // חישוב סטטיסטיקות
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyWorkouts = allWorkouts.filter((w) => {
      const workoutDateStr = w.completedAt || w.date;
      if (!workoutDateStr) return false;
      return new Date(workoutDateStr) >= weekAgo;
    });

    const totalDuration = allWorkouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0
    );

    const totalRatings = allWorkouts.filter((w) => w.rating).length;
    const averageRating =
      totalRatings > 0
        ? allWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) /
          totalRatings
        : 0;

    return {
      totalWorkouts: allWorkouts.length,
      weeklyWorkouts: weeklyWorkouts.length,
      totalDuration,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  }, [allWorkouts]);

  // מחיקת אימון
  const deleteWorkout = async (workoutId: string) => {
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      // Optimistic update
      if (enableOptimisticUpdates) {
        queryClient.setQueryData(
          ["workoutHistory", user.id],
          (oldData: Workout[] | undefined) => {
            if (!oldData) return [];
            return oldData.filter((w) => w.id !== workoutId);
          }
        );
      }

      await deleteWorkoutFromHistory(user.id, workoutId);

      if (!enableOptimisticUpdates) {
        await refetch();
      }
    } catch (error) {
      console.error("Failed to delete workout:", error);
      // Revert optimistic update
      if (enableOptimisticUpdates) {
        await refetch();
      }
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    workouts: sortedWorkouts,
    isLoading,
    isError,
    refresh: refetch,
    deleteWorkout,
    isDeleting,
    stats,
  };
};

// Helper function לחישוב נפח אימון
function calculateWorkoutVolume(workout: Workout): number {
  let totalVolume = 0;

  workout.exercises?.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.status === "completed" || set.completedAt) {
        totalVolume += (set.weight || 0) * (set.reps || 0);
      }
    });
  });

  return totalVolume;
}

// Hook לשליפת אימון בודד - אם תצטרך בעתיד
export const useWorkoutById = (workoutId: string) => {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: ["workout", workoutId],
    queryFn: async () => {
      if (!user?.id || !workoutId) return null;

      // חיפוש האימון בהיסטוריה
      const history = await getWorkoutHistory(user.id);
      return history.find((w) => w.id === workoutId) || null;
    },
    enabled: !!user?.id && !!workoutId,
  });
};
