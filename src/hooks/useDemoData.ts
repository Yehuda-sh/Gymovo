// src/hooks/useDemoData.ts - גרסה פשוטה וזמינה ללא תלות בפונקציות חיצוניות

import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { Workout } from "../types/workout";
import { User } from "../types/user";

interface DemoStats {
  totalWorkouts: number;
  totalDuration: number;
  totalVolume: number;
  averageRating: number;
  streak: number;
  thisWeekWorkouts: number;
  lastWorkout: Workout | null;
}

// ✅ נתוני דמו מקומיים (פתרון זמני עד לתיקון קובץ demoUsers)
const generateMockDemoData = (
  userId: string
): { workouts: Workout[]; stats: DemoStats } => {
  const mockWorkouts: Workout[] = [
    {
      id: `demo-workout-1-${userId}`,
      name: "אימון חזה וכתפיים",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // אתמול
      duration: 45,
      exercises: [],
      rating: 4,
      results: {
        totalWeight: 2500,
        completedSets: 12,
        totalSets: 12,
      },
    },
    {
      id: `demo-workout-2-${userId}`,
      name: "אימון גב ויד קדמית",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // לפני 3 ימים
      duration: 50,
      exercises: [],
      rating: 5,
      results: {
        totalWeight: 2800,
        completedSets: 10,
        totalSets: 10,
      },
    },
    {
      id: `demo-workout-3-${userId}`,
      name: "אימון רגליים",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // לפני 5 ימים
      duration: 60,
      exercises: [],
      rating: 4,
      results: {
        totalWeight: 3200,
        completedSets: 14,
        totalSets: 15,
      },
    },
  ];

  const stats: DemoStats = {
    totalWorkouts: mockWorkouts.length,
    totalDuration: mockWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    totalVolume: mockWorkouts.reduce(
      (sum, w) => sum + (w.results?.totalWeight || 0),
      0
    ),
    averageRating:
      mockWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) /
      mockWorkouts.length,
    streak: 2, // ימים רצופים
    thisWeekWorkouts: 2, // אימונים השבוע
    lastWorkout: mockWorkouts[0],
  };

  return { workouts: mockWorkouts, stats };
};

export const useDemoData = () => {
  const user = useUserStore((state) => state.user);
  const [demoStats, setDemoStats] = useState<DemoStats | null>(null);
  const [demoWorkouts, setDemoWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // בדוק אם זה משתמש דמו
  const isDemoUser = user?.id?.startsWith("demo-user-") ?? false;

  useEffect(() => {
    if (!isDemoUser || !user) {
      setIsLoading(false);
      return;
    }

    const loadDemoData = async () => {
      try {
        setIsLoading(true);

        // יצירת נתוני דמו מקומיים
        const { workouts, stats } = generateMockDemoData(user.id);

        setDemoWorkouts(workouts);
        setDemoStats(stats);

        console.log(`📊 Generated demo data for ${user.name}:`, {
          workouts: workouts.length,
          stats,
        });
      } catch (error) {
        console.error("Failed to generate demo data:", error);
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
      } finally {
        setIsLoading(false);
      }
    };

    loadDemoData();
  }, [user?.id, isDemoUser]); // ✅ תיקון dependency array

  // פונקציה לרענון נתונים
  const refreshDemoData = () => {
    if (!isDemoUser || !user) return;

    try {
      const { workouts, stats } = generateMockDemoData(user.id);
      setDemoWorkouts(workouts);
      setDemoStats(stats);
    } catch (error) {
      console.error("Failed to refresh demo data:", error);
    }
  };

  return {
    isDemoUser,
    demoStats,
    demoWorkouts,
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

// ✅ פונקציית עזר לבדיקה אם משתמש הוא דמו
export const isDemoUser = (user: User | null): boolean => {
  return user?.id?.startsWith("demo-user-") ?? false;
};

// ✅ טיפוס עזר עבור משתמש דמו
export type DemoUser = User & {
  id: `demo-user-${string}`;
};
