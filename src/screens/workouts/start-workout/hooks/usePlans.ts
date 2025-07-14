// src/screens/workouts/start-workout/hooks/usePlans.ts

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { Alert } from "react-native";
import { Plan } from "../../../../types/plan";
import { plansService } from "../../../../services/plans.service";
import * as Haptics from "expo-haptics";
import { useUserStore } from "@/src/stores/userStore";

export const usePlans = () => {
  // const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const {
    data: plans = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const user = useUserStore.getState().user;
      return plansService.getPlans(user?.id || "guest");
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // onError: (error: Error) => {
    //   console.error("Failed to fetch plans:", error);
    //   // Could send to crash reporting service here
    // },
  });

  const refresh = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
  }, [refetch]);

  const selectPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
  }, []);

  const errorMessage = error
    ? "לא הצלחנו לטעון את התוכניות. אנא בדוק את החיבור לאינטרנט."
    : null;

  return {
    plans,
    isLoading,
    isRefreshing: isRefetching,
    isError,
    error: errorMessage,
    selectedPlan,
    refresh,
    selectPlan,
  };
};
