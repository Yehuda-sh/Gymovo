// src/hooks/usePlans.ts - Hook משופר לניהול תוכניות אימון

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { getPlansByUserId, savePlan, deletePlan } from "../data/storage";
import { fetchPublicPlans } from "../services/wgerApi";
import { getDemoPlanForUser } from "../constants/demoUsers";
import { useUserStore } from "../stores/userStore";
import { Plan, PlanProgress, PlanStats } from "../types/plan";
import { useNetworkStatus } from "../utils/networkUtils";

// קבועים לניהול cache
const CACHE_TIME = {
  USER_PLANS: 1000 * 60 * 5, // 5 דקות
  PUBLIC_PLANS: 1000 * 60 * 30, // 30 דקות
} as const;

// טיפוסים נוספים
interface PlansState {
  plans: Plan[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  createPlan: (plan: Plan) => void;
  updatePlan: (plan: Plan) => void;
  deletePlan: (planId: string) => void;
  duplicatePlan: (planId: string) => void;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  searchPlans: (query: string) => Plan[];
  getActivePlan: () => Plan | undefined;
  getPlanProgress: (planId: string) => PlanProgress | undefined;
  getPlanStats: (planId: string) => PlanStats | undefined;
}

/**
 * Hook משופר לניהול תוכניות אימון
 * כולל טעינה, שמירה, עדכון, מחיקה ופונקציות עזר נוספות
 */
export const usePlans = (): PlansState => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { isConnected } = useNetworkStatus();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [planProgress, setPlanProgress] = useState<Map<string, PlanProgress>>(
    new Map()
  );
  const [planStats, setPlanStats] = useState<Map<string, PlanStats>>(new Map());

  // שליפת תוכניות המשתמש
  const {
    data: userPlans,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["plans", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      try {
        const storedPlans = await getPlansByUserId(user.id);

        // הוספת תוכנית דמו אם קיימת
        const demoPlan = getDemoPlanForUser(user.id);
        if (demoPlan) {
          const allPlans = [...storedPlans];
          const exists = allPlans.some((p) => p.id === demoPlan.id);
          if (!exists) {
            allPlans.push(demoPlan);
          }
          return allPlans;
        }

        return storedPlans;
      } catch (error) {
        console.error("Error loading user plans:", error);
        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: CACHE_TIME.USER_PLANS,
    cacheTime: CACHE_TIME.USER_PLANS * 2,
    retry: 2,
    retryDelay: 1000,
  });

  // שליפת תוכניות ציבוריות
  const {
    data: publicPlans,
    isLoading: isLoadingPublic,
    isError: isErrorPublic,
  } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
    staleTime: CACHE_TIME.PUBLIC_PLANS,
    cacheTime: CACHE_TIME.PUBLIC_PLANS * 2,
    retry: isConnected ? 2 : 0, // אל תנסה אם אין רשת
    enabled: isConnected, // טען רק אם יש רשת
  });

  // עדכון state כשהנתונים משתנים
  useEffect(() => {
    const allPlans = [...(userPlans || []), ...(publicPlans || [])];
    setPlans(allPlans);
  }, [userPlans, publicPlans]);

  // Mutation לשמירת תוכנית חדשה
  const createPlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");

      // וידוא שיש שם לתוכנית
      if (!plan.name?.trim()) {
        throw new Error("חובה להזין שם לתוכנית");
      }

      return await savePlan(user.id, plan);
    },
    onSuccess: (_, plan) => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("הצלחה", `התוכנית "${plan.name}" נשמרה בהצלחה`);
    },
    onError: (error: Error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("שגיאה", error.message || "שמירת התוכנית נכשלה");
    },
  });

  // Mutation לעדכון תוכנית קיימת
  const updatePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");

      // עדכון התאריך
      plan.updatedAt = new Date().toISOString();

      return await savePlan(user.id, plan);
    },
    onSuccess: (_, plan) => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onError: (error: Error) => {
      Alert.alert("שגיאה", "עדכון התוכנית נכשל");
    },
  });

  // Mutation למחיקת תוכנית
  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");

      // בדיקה אם זו תוכנית דמו
      const plan = plans.find((p) => p.id === planId);
      if (plan?.isTemplate) {
        throw new Error("לא ניתן למחוק תוכנית דמו");
      }

      return await deletePlan(user.id, planId);
    },
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // מחיקת progress ו-stats
      planProgress.delete(planId);
      planStats.delete(planId);
    },
    onError: (error: Error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("שגיאה", error.message || "מחיקת התוכנית נכשלה");
    },
  });

  // פונקציה לשכפול תוכנית
  const duplicatePlan = useCallback(
    (planId: string) => {
      const planToDuplicate = plans.find((p) => p.id === planId);
      if (!planToDuplicate) {
        Alert.alert("שגיאה", "התוכנית לא נמצאה");
        return;
      }

      const duplicatedPlan: Plan = {
        ...planToDuplicate,
        id: `plan_${Date.now()}`,
        name: `${planToDuplicate.name} (עותק)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isTemplate: false,
        isPublic: false,
      };

      createPlanMutation.mutate(duplicatedPlan);
    },
    [plans, createPlanMutation]
  );

  // חיפוש תוכניות
  const searchPlans = useCallback(
    (query: string): Plan[] => {
      if (!query.trim()) return plans;

      const searchTerm = query.toLowerCase();
      return plans.filter((plan) => {
        return (
          plan.name.toLowerCase().includes(searchTerm) ||
          plan.description?.toLowerCase().includes(searchTerm) ||
          plan.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
          plan.difficulty?.toLowerCase().includes(searchTerm)
        );
      });
    },
    [plans]
  );

  // קבלת התוכנית הפעילה
  const getActivePlan = useCallback((): Plan | undefined => {
    return plans.find((plan) => plan.isActive);
  }, [plans]);

  // קבלת התקדמות בתוכנית
  const getPlanProgress = useCallback(
    (planId: string): PlanProgress | undefined => {
      // בגרסה מלאה - לטעון מ-storage
      return planProgress.get(planId);
    },
    [planProgress]
  );

  // קבלת סטטיסטיקות תוכנית
  const getPlanStats = useCallback(
    (planId: string): PlanStats | undefined => {
      // בגרסה מלאה - לחשב מהיסטוריית אימונים
      return planStats.get(planId);
    },
    [planStats]
  );

  // פונקציית refetch משולבת
  const refetch = useCallback(() => {
    refetchUser();
    if (isConnected) {
      queryClient.invalidateQueries({ queryKey: ["public-plans"] });
    }
  }, [refetchUser, isConnected, queryClient]);

  // חישוב מצבי טעינה ושגיאה
  const isLoading = isLoadingUser || isLoadingPublic;
  const isError = isErrorUser || isErrorPublic;
  const error = userError || null;

  return {
    plans,
    isLoading,
    isError,
    error,
    refetch,
    createPlan: createPlanMutation.mutate,
    updatePlan: updatePlanMutation.mutate,
    deletePlan: deletePlanMutation.mutate,
    duplicatePlan,
    isCreating: createPlanMutation.isPending,
    isDeleting: deletePlanMutation.isPending,
    isUpdating: updatePlanMutation.isPending,
    searchPlans,
    getActivePlan,
    getPlanProgress,
    getPlanStats,
  };
};

// Export נוסף להתאימות לאחור
export default usePlans;
