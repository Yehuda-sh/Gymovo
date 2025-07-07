// src/hooks/useDemoData.ts - Hook לניהול נתוני דמו

import { useEffect, useState } from "react";
import {
  demoUsers,
  getDemoUserStats,
  getDemoWorkoutHistory,
} from "../constants/demoUsers";
import { useUserStore } from "../stores/userStore";
import { Workout } from "../types/workout";

interface DemoStats {
  totalWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  averageRating: number;
  streak: number;
  thisWeekWorkouts: number;
  lastWorkout: Workout | null;
}

export const useDemoData = () => {
  const user = useUserStore((state) => state.user);
  const [demoStats, setDemoStats] = useState<DemoStats | null>(null);
  const [demoWorkouts, setDemoWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // בדוק אם זה משתמש דמו
  const isDemoUser =
    user && demoUsers.some((demoUser) => demoUser.id === user.id);

  useEffect(() => {
    if (!isDemoUser || !user) {
      setIsLoading(false);
      return;
    }

    const loadDemoData = async () => {
      try {
        setIsLoading(true);

        // טען נתוני דמו
        const workouts = getDemoWorkoutHistory(user.id);
        const stats = getDemoUserStats(user.id);

        setDemoWorkouts(workouts);
        setDemoStats(stats);

        console.log(`📊 Loaded demo data for ${user.name}:`, {
          workouts: workouts.length,
          stats,
        });
      } catch (error) {
        console.error("Failed to load demo data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, [user?.id, isDemoUser]);

  return {
    isDemoUser,
    demoStats,
    demoWorkouts,
    isLoading,
    // פונקציה לרענון נתונים
    refreshDemoData: () => {
      if (isDemoUser && user) {
        const workouts = getDemoWorkoutHistory(user.id);
        const stats = getDemoUserStats(user.id);
        setDemoWorkouts(workouts);
        setDemoStats(stats);
      }
    },
  };
};

// Hook נוסף לסטטיסטיקות דמו בלבד
export const useDemoStats = () => {
  const { isDemoUser, demoStats, isLoading } = useDemoData();

  if (!isDemoUser) {
    return {
      stats: null,
      isLoading: false,
      isDemoUser: false,
    };
  }

  return {
    stats: demoStats,
    isLoading,
    isDemoUser: true,
  };
};
