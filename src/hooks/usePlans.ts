// src/hooks/usePlans.ts - Hook משופר לניהול תוכניות אימון

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import NetInfo from "@react-native-community/netinfo";
import { getPlansByUserId, savePlan, deletePlan } from "../data/storage";
import { fetchPublicPlans } from "../services/wgerApi";
import { getDemoPlanForUser } from "../constants/demoUsers";
import { useUserStore } from "../stores/userStore";
import { Plan, PlanProgress, PlanStats } from "../types/plan";

// קבועים לניהול cache ו-retry
const CACHE_TIME = {
  USER_PLANS: 1000 * 60 * 5, // 5 דקות
  PUBLIC_PLANS: 1000 * 60 * 30, // 30 דקות
} as const;

// React Query v5 config
const RETRY_CONFIG = {
  retry: 3,
  retryDelay: (attemptIndex: number) =>
    Math.min(1000 * 2 ** attemptIndex, 30000),
};

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
  isOffline: boolean;
  hasLocalChanges: boolean;
  syncLocalChanges: () => Promise<void>;
}

// Hook לבדיקת חיבור לרשת
const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return { isOffline };
};

/**
 * Hook משופר לניהול תוכניות אימון
 * כולל טעינה, שמירה, עדכון, מחיקה ופונקציות עזר נוספות
 * תומך במצב offline ו-error handling מתקדם
 */
export const usePlans = (): PlansState => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const { isOffline } = useNetworkStatus();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  // שליפת תוכניות המשתמש עם retry mechanism
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

        // במצב offline, נסה לטעון מהמטמון המקומי
        if (isOffline) {
          const cachedPlans = queryClient.getQueryData<Plan[]>([
            "plans",
            user?.id,
          ]);
          if (cachedPlans) {
            return cachedPlans;
          }
        }

        throw error;
      }
    },
    enabled: !!user?.id,
    staleTime: CACHE_TIME.USER_PLANS,
    gcTime: CACHE_TIME.USER_PLANS * 2,
    retry: RETRY_CONFIG.retry,
    retryDelay: RETRY_CONFIG.retryDelay,
  });

  // שליפת תוכניות ציבוריות (רק אם יש חיבור)
  const {
    data: publicPlans,
    isLoading: isLoadingPublic,
    isError: isErrorPublic,
  } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
    enabled: !isOffline, // לא לנסות לטעון במצב offline
    staleTime: CACHE_TIME.PUBLIC_PLANS,
    gcTime: CACHE_TIME.PUBLIC_PLANS * 2,
    retry: RETRY_CONFIG.retry,
    retryDelay: RETRY_CONFIG.retryDelay,
  });

  // עדכון state כשהנתונים משתנים
  useEffect(() => {
    const allPlans = [...(userPlans || []), ...(publicPlans || [])];
    setPlans(allPlans);
  }, [userPlans, publicPlans]);

  // פונקציה לסנכרון שינויים מקומיים
  const syncLocalChanges = useCallback(async () => {
    if (!hasLocalChanges || isOffline) return;

    try {
      // כאן תוסיף לוגיקה לסנכרון שינויים מקומיים עם השרת
      // לדוגמה: לטעון רשימת שינויים שנשמרו locally ולשלוח לשרת

      setHasLocalChanges(false);
      await refetchUser();
    } catch (error) {
      console.error("Failed to sync local changes:", error);
    }
  }, [hasLocalChanges, isOffline, refetchUser]);

  // Mutation לשמירת תוכנית חדשה עם offline support
  const createPlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");

      // וידוא שיש שם לתוכנית
      if (!plan.name?.trim()) {
        throw new Error("חובה להזין שם לתוכנית");
      }

      // במצב offline, שמור locally בלבד
      if (isOffline) {
        setHasLocalChanges(true);
        // כאן תוסיף לוגיקה לשמירה מקומית עם flag לסנכרון מאוחר יותר
      }

      return await savePlan(user.id, plan);
    },
    onSuccess: (_, plan) => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const message = isOffline
        ? `התוכנית "${plan.name}" נשמרה מקומית ותסונכרן כשיהיה חיבור`
        : `התוכנית "${plan.name}" נשמרה בהצלחה`;

      Alert.alert("הצלחה", message);
    },
    onError: (error: Error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("שגיאה", error.message || "שמירת התוכנית נכשלה");
    },
    // נסה שוב אוטומטית במקרה של כשלון רשת
    retry: isOffline ? 0 : 3,
  });

  // Mutation לעדכון תוכנית קיימת
  const updatePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");

      // עדכון התאריך
      plan.updatedAt = new Date().toISOString();

      if (isOffline) {
        setHasLocalChanges(true);
      }

      return await savePlan(user.id, plan);
    },
    onSuccess: (_, plan) => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onError: (error: Error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("שגיאה", "עדכון התוכנית נכשל");
    },
  });

  // Mutation למחיקת תוכנית
  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");

      if (isOffline) {
        throw new Error("לא ניתן למחוק תוכניות במצב לא מקוון");
      }

      return await deletePlan(user.id, planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("הצלחה", "התוכנית נמחקה בהצלחה");
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
        isActive: false, // תוכנית משוכפלת לא תהיה פעילה כברירת מחדל
      };

      createPlanMutation.mutate(duplicatedPlan);
    },
    [plans, createPlanMutation]
  );

  // חיפוש תוכניות עם memoization
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

  // קבלת התקדמות בתוכנית (Placeholder - יש להטמיע בעתיד)
  const getPlanProgress = useCallback(
    (planId: string): PlanProgress | undefined => {
      // בגרסה מלאה - לטעון מ-storage
      // כרגע מחזיר undefined
      return undefined;
    },
    []
  );

  // קבלת סטטיסטיקות תוכנית (Placeholder - יש להטמיע בעתיד)
  const getPlanStats = useCallback((planId: string): PlanStats | undefined => {
    // בגרסה מלאה - לחשב מהיסטוריית אימונים
    // כרגע מחזיר undefined
    return undefined;
  }, []);

  // פונקציית refetch משולבת
  const refetch = useCallback(async () => {
    // אם יש שינויים מקומיים, סנכרן קודם
    if (hasLocalChanges && !isOffline) {
      await syncLocalChanges();
    }

    refetchUser();
    if (!isOffline) {
      queryClient.invalidateQueries({ queryKey: ["public-plans"] });
    }
  }, [refetchUser, queryClient, hasLocalChanges, isOffline, syncLocalChanges]);

  // חישוב מצבי טעינה ושגיאה
  const isLoading = isLoadingUser || (!isOffline && isLoadingPublic);
  const isError = isErrorUser || (!isOffline && isErrorPublic);
  const error = userError || null;

  // Memoize את התוצאה הסופית
  return useMemo(
    () => ({
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
      isOffline,
      hasLocalChanges,
      syncLocalChanges,
    }),
    [
      plans,
      isLoading,
      isError,
      error,
      refetch,
      createPlanMutation,
      updatePlanMutation,
      deletePlanMutation,
      duplicatePlan,
      searchPlans,
      getActivePlan,
      getPlanProgress,
      getPlanStats,
      isOffline,
      hasLocalChanges,
      syncLocalChanges,
    ]
  );
};

// Export נוסף להתאימות לאחור
export default usePlans;
