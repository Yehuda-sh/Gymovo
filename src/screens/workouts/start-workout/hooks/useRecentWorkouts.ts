// src/screens/workouts/start-workout/hooks/useRecentWorkouts.ts

import { useQuery } from "@tanstack/react-query";
import { getWorkoutHistory } from "../../../../data/storage";
import { useUserStore } from "../../../../stores/userStore";
import { Workout } from "../../../../types/workout";

interface RecentWorkout {
  id: string;
  planName: string;
  dayName: string;
  date: Date;
  duration: number;
  exerciseCount: number;
}

export const useRecentWorkouts = (limit = 5) => {
  const user = useUserStore((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["recentWorkouts", user?.id, limit],
    queryFn: async () => {
      const userId = user?.id || "guest";
      const workouts = await getWorkoutHistory(userId);

      // Sort by date and take the most recent
      return workouts
        .sort((a: Workout, b: Workout) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        })
        .slice(0, limit)
        .map(
          (workout: Workout): RecentWorkout => ({
            id: workout.id,
            planName: workout.planName,
            dayName: workout.dayName,
            date: new Date(workout.date),
            duration: workout.duration,
            exerciseCount: workout.exercises.length,
          })
        );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    recentWorkouts: data || [],
    isLoading,
    error,
  };
};
