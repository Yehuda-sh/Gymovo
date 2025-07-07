// src/hooks/usePlans.ts - 🔧 hook משופר עם טיפול בשגיאות

import { useQuery } from "@tanstack/react-query";
import { demoPlans } from "../constants/demoPlans";
import { getPlansByUserId } from "../data/storage";
import { fetchPublicPlansWithFallback } from "../services/wgerApi";
import { UserState, useUserStore } from "../stores/userStore";
import { Plan } from "../types/plan";

export const usePlans = () => {
  const userId = useUserStore((state: UserState) => state.user?.id);

  // שליפת תוכניות ציבוריות עם fallback
  const {
    data: publicPlans = [],
    isLoading: isLoadingPublic,
    error: publicError,
    refetch: refetchPublic,
  } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlansWithFallback,
    staleTime: 1000 * 60 * 60, // 1 שעה
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // שליפת תוכניות אישיות
  const {
    data: userPlans = [],
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user-plans", userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        return await getPlansByUserId(userId);
      } catch (error) {
        console.warn("שגיאה בטעינת תוכניות משתמש:", error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 30, // 30 דקות
  });

  // איחוד התוכניות ומניעת כפילויות
  const combinedPlans: Plan[] = [
    ...(demoPlans || []),
    ...(userPlans || []),
    ...(publicPlans || []),
  ];

  // מניעת כפילויות על בסיס ID או שם
  const uniquePlans = Array.from(
    new Map(combinedPlans.map((plan) => [plan.id || plan.name, plan])).values()
  );

  // פונקציית refresh מאוחדת
  const refetchAll = () => {
    console.log("🔄 Refreshing all plans...");
    refetchPublic();
    if (userId) {
      refetchUser();
    }
  };

  // בדיקה אם יש שגיאות
  const hasErrors = publicError || userError;
  const isLoading = isLoadingPublic || isLoadingUser;

  // טיפול בשגיאות ציבוריות
  if (publicError) {
    console.log("🔄 Failed to load public plans, using demo:", publicError);
  }

  // סטטיסטיקות
  const stats = {
    total: uniquePlans.length,
    demo: demoPlans?.length || 0,
    user: userPlans?.length || 0,
    public: publicPlans?.length || 0,
    hasErrors: !!hasErrors,
  };

  console.log("📊 Plans Stats:", stats);

  return {
    plans: uniquePlans,
    isLoading,
    hasErrors,
    stats,
    refetch: refetchAll,

    // פונקציות נפרדות
    refetchPublic,
    refetchUser,

    // שגיאות מפורטות
    errors: {
      public: publicError,
      user: userError,
    },
  };
};
