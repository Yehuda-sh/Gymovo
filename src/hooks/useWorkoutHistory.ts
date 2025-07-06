// src/hooks/useWorkoutHistory.ts

import { useQuery } from "@tanstack/react-query";
import { getWorkoutHistory } from "../data/storage";
import { UserState, useUserStore } from "../stores/userStore";

/**
 * Hook לשליפת היסטוריית האימונים של משתמש מחובר מהאחסון המקומי.
 * ה-Hook יפעל רק אם קיים מזהה משתמש.
 */
export const useWorkoutHistory = () => {
  const userId = useUserStore((state: UserState) => state.user?.id);

  return useQuery({
    queryKey: ["workouts", userId],
    queryFn: () => getWorkoutHistory(userId!),
    enabled: !!userId,
  });
};
