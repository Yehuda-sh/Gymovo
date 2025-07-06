// src/hooks/usePlans.ts

import { useQuery } from "@tanstack/react-query";
import { demoPlans } from "../constants/demoPlans";
import { getPlansByUserId } from "../data/storage";
import { fetchPublicPlans } from "../services/wgerApi";
import { UserState, useUserStore } from "../stores/userStore";

/**
 * Hook מורכב המשלב נתונים ממספר מקורות:
 * דמו, תוכניות משתמש מקומיות, ותוכניות ציבוריות מה-API.
 */
export const usePlans = () => {
  const userId = useUserStore((state: UserState) => state.user?.id);

  // שליפת תוכניות ציבוריות
  const {
    data: publicPlans,
    isLoading: isLoadingPublic,
    refetch: refetchPublic,
  } = useQuery({
    queryKey: ["public-plans"],
    queryFn: fetchPublicPlans,
    staleTime: 1000 * 60 * 60,
  });

  // שליפת תוכניות אישיות
  const {
    data: userPlans,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user-plans", userId],
    queryFn: () => getPlansByUserId(userId!),
    enabled: !!userId,
  });

  // איחוד התוכניות ממספר מקורות ומניעת כפילויות
  const combinedPlans = [
    ...(demoPlans || []),
    ...(userPlans || []),
    ...(publicPlans || []),
  ];
  const uniquePlans = Array.from(
    new Map(combinedPlans.map((plan) => [plan.name, plan])).values()
  );

  // התיקון: חשיפת פונקציית refetch מאוחדת
  // שתרענן גם את התוכניות הציבוריות וגם את של המשתמש
  const refetchAll = () => {
    refetchPublic();
    if (userId) {
      refetchUser();
    }
  };

  return {
    plans: uniquePlans,
    isLoading: isLoadingPublic || isLoadingUser,
    refetch: refetchAll, // חשיפת הפונקציה המאוחדת
  };
};
