// src/hooks/usePlans.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getPlansByUserId, savePlan, deletePlan } from "../data/storage";
import { fetchPublicPlans } from "../services/wgerApi";
import { getDemoPlanForUser } from "../constants/demoUsers";
import { useUserStore } from "../stores/userStore";
import { Plan } from "../types/plan";

/**
 * Hook לניהול תוכניות אימון
 * כולל טעינה, שמירה ומחיקה של תוכניות
 */
export const usePlans = () => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const [plans, setPlans] = useState<Plan[]>([]);

  // שליפת תוכניות המשתמש
  const {
    data: userPlans,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["plans", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

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
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 דקות
  });

  // שליפת תוכניות ציבוריות
  const { data: publicPlans } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
    staleTime: 1000 * 60 * 30, // 30 דקות
    retry: 2,
  });

  // עדכון state כשהנתונים משתנים
  useEffect(() => {
    const allPlans = [...(userPlans || []), ...(publicPlans || [])];
    setPlans(allPlans);
  }, [userPlans, publicPlans]);

  // Mutation לשמירת תוכנית
  const createPlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");
      return await savePlan(user.id, plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
    },
  });

  // Mutation למחיקת תוכנית
  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!user?.id) throw new Error("משתמש לא מחובר");
      return await deletePlan(user.id, planId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", user?.id] });
    },
  });

  return {
    plans,
    isLoading,
    isError,
    refetch,
    createPlan: createPlanMutation.mutate,
    deletePlan: deletePlanMutation.mutate,
    isCreating: createPlanMutation.isPending,
    isDeleting: deletePlanMutation.isPending,
  };
};
