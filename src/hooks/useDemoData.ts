// src/hooks/useDemoData.ts - ✅ Hook מעודכן לשימוש בקובץ demoUsers המרכזי

import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { Workout } from "../types/workout";
import { User } from "../types/user";
import { Plan } from "../types/plan";
import {
  getDemoWorkoutHistory,
  getDemoUserStats,
  getDemoPlanForUser,
  isDemoUser as checkIsDemoUser,
} from "../constants/demoUsers";

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
  const [demoPlan, setDemoPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // בדוק אם זה משתמש דמו
  const isDemoUser = user?.id ? checkIsDemoUser(user.id) : false;

  useEffect(() => {
    if (!isDemoUser || !user) {
      setIsLoading(false);
      return;
    }

    const loadDemoData = async () => {
      try {
        setIsLoading(true);

        // טען נתונים מהקובץ המרכזי
        const workouts = getDemoWorkoutHistory(user.id);
        const stats = getDemoUserStats(user.id);
        const plan = getDemoPlanForUser(user.id);

        // המר את הסטטיסטיקות לפורמט המתאים
        const demoStatsFormatted: DemoStats = {
          totalWorkouts: stats?.totalWorkouts || 0,
          totalDuration: stats?.totalDuration || 0,
          totalVolume: stats?.totalVolume || 0,
          averageRating: stats?.averageRating || 0,
          streak: stats?.streak || 0,
          thisWeekWorkouts: stats?.thisWeekWorkouts || 0,
          lastWorkout: workouts.length > 0 ? workouts[0] : null,
        };

        setDemoWorkouts(workouts);
        setDemoStats(demoStatsFormatted);
        setDemoPlan(plan);

        console.log(`📊 Loaded demo data for ${user.name}:`, {
          workouts: workouts.length,
          stats: demoStatsFormatted,
          hasPlan: !!plan,
        });
      } catch (error) {
        console.error("Failed to load demo data:", error);
        // הגדר ערכי ברירת מחדל במקרה של שגיאה
        setDemoStats({
          totalWorkouts: 0,
          totalDuration: 0,
          totalVolume: 0,
          averageRating: 0,
          streak: 0,
          thisWeekWorkouts: 0,
          lastWorkout: null,
        });
        setDemoWorkouts([]);
        setDemoPlan(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, [user?.id, isDemoUser]);

  // פונקציה לרענון נתונים
  const refreshDemoData = () => {
    if (!isDemoUser || !user) return;

    try {
      const workouts = getDemoWorkoutHistory(user.id);
      const stats = getDemoUserStats(user.id);
      const plan = getDemoPlanForUser(user.id);

      const demoStatsFormatted: DemoStats = {
        totalWorkouts: stats?.totalWorkouts || 0,
        totalDuration: stats?.totalDuration || 0,
        totalVolume: stats?.totalVolume || 0,
        averageRating: stats?.averageRating || 0,
        streak: stats?.streak || 0,
        thisWeekWorkouts: stats?.thisWeekWorkouts || 0,
        lastWorkout: workouts.length > 0 ? workouts[0] : null,
      };

      setDemoWorkouts(workouts);
      setDemoStats(demoStatsFormatted);
      setDemoPlan(plan);
    } catch (error) {
      console.error("Failed to refresh demo data:", error);
    }
  };

  return {
    isDemoUser,
    demoStats,
    demoWorkouts,
    demoPlan,
    isLoading,
    refreshDemoData,
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

// Hook לתוכנית אימון של משתמש דמו
export const useDemoPlan = () => {
  const { isDemoUser, demoPlan, isLoading } = useDemoData();

  if (!isDemoUser) {
    return {
      plan: null,
      isLoading: false,
      isDemoUser: false,
    };
  }

  return {
    plan: demoPlan,
    isLoading,
    isDemoUser: true,
  };
};

// Hook לאימונים של משתמש דמו
export const useDemoWorkouts = () => {
  const { isDemoUser, demoWorkouts, isLoading } = useDemoData();

  if (!isDemoUser) {
    return {
      workouts: [],
      isLoading: false,
      isDemoUser: false,
    };
  }

  return {
    workouts: demoWorkouts,
    isLoading,
    isDemoUser: true,
  };
};

// ✅ פונקציית עזר לבדיקה אם משתמש הוא דמו
export const isDemoUser = (user: User | null): boolean => {
  return user?.id ? checkIsDemoUser(user.id) : false;
};

// ✅ טיפוס עזר עבור משתמש דמו
export type DemoUser = User & {
  id: `demo-user-${string}`;
};
