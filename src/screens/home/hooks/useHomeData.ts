// src/screens/home/hooks/useHomeData.ts
// Hook לניהול נתוני דשבורד הבית

import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

import { getPlansByUserId, getWorkoutHistory } from "../../../data/storage";
import { User } from "../../../types/user";
import { Workout } from "../../../types/workout";
import { DashboardData } from "../types";

/**
 * Hook to manage home screen data loading and state
 */
export const useHomeData = (user: User | null) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔢 חישוב רצף אימונים
  const calculateStreak = useCallback((workouts: Workout[]): number => {
    if (!workouts.length) return 0;

    const sortedWorkouts = [...workouts]
      .filter((w) => w.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt!).getTime() -
          new Date(a.completedAt!).getTime()
      );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.completedAt!);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, []);

  // 📊 טעינת נתוני דשבורד
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [workouts, plans] = await Promise.all([
        getWorkoutHistory(user.id),
        getPlansByUserId(user.id),
      ]);

      // חישוב סטטיסטיקות שבועיות
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyWorkouts = workouts.filter((w) => {
        if (!w.completedAt) return false;
        return new Date(w.completedAt) >= weekAgo;
      });

      const weeklyStats = {
        completedWorkouts: weeklyWorkouts.length,
        totalWeightLifted: weeklyWorkouts.reduce(
          (total, workout) =>
            total +
            (workout.exercises?.reduce(
              (wTotal, exercise) =>
                wTotal +
                exercise.sets.reduce(
                  (sTotal, set) => sTotal + (set.weight || 0) * (set.reps || 0),
                  0
                ),
              0
            ) || 0),
          0
        ),
        totalDuration: weeklyWorkouts.reduce(
          (total, workout) => total + (workout.duration || 0),
          0
        ),
        streak: calculateStreak(workouts),
      };

      // בחירת תוכנית מומלצת
      const activePlans = plans.filter((p) => p.isActive);
      const todaysWorkout = activePlans[0]; // בעתיד: לוגיקה חכמה יותר

      setDashboardData({
        recentWorkouts: workouts.slice(0, 5),
        activePlans,
        weeklyStats,
        todaysWorkout,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      Alert.alert("שגיאה", "לא הצלחנו לטעון את הנתונים");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, calculateStreak]);

  // טעינה ראשונית
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // רענון
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    dashboardData,
    loading,
    refreshing,
    onRefresh,
  };
};
