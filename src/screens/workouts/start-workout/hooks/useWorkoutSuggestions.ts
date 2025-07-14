// src/screens/workouts/start-workout/hooks/useWorkoutSuggestions.ts

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWorkoutHistory, getPlansByUserId } from "../../../../data/storage";
import { useUserStore } from "../../../../stores/userStore";
import { Workout } from "../../../../types/workout";
import { Plan, PlanDay } from "../../../../types/plan";

interface WorkoutSuggestion {
  planId: string;
  planName: string;
  dayId: string;
  dayName: string;
  reason: string;
  confidence: number;
}

export const useWorkoutSuggestions = () => {
  const user = useUserStore((state) => state.user);
  const userId = user?.id || "guest";

  // Get recent workouts with proper typing
  const { data: recentWorkouts = [] } = useQuery<Workout[]>({
    queryKey: ["recentWorkoutsForSuggestions", userId],
    queryFn: () => getWorkoutHistory(userId),
  });

  // Get all plans with proper typing
  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["plansForSuggestions", userId],
    queryFn: () => getPlansByUserId(userId),
  });

  const suggestion = useMemo<WorkoutSuggestion | null>(() => {
    if (recentWorkouts.length === 0 || plans.length === 0) {
      return null;
    }

    // Get the last workout
    const lastWorkout = recentWorkouts[0];
    const daysSinceLastWorkout = Math.floor(
      (Date.now() - new Date(lastWorkout.date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Find the plan and day of the last workout
    const lastPlan = plans.find((p: Plan) => p.id === lastWorkout.planId);
    if (!lastPlan || !lastPlan.days) {
      return null;
    }

    const lastDayIndex = lastPlan.days.findIndex(
      (d: PlanDay) => d.id === lastWorkout.dayId
    );

    // Suggest the next day in the plan
    let nextDayIndex = (lastDayIndex + 1) % lastPlan.days.length;
    let suggestedPlan = lastPlan;
    let suggestedDay = lastPlan.days[nextDayIndex];

    // Calculate muscle groups from recent workouts
    const recentMuscleGroups = new Map<string, number>();
    recentWorkouts.slice(0, 3).forEach((workout: Workout) => {
      workout.exercises.forEach((exercise) => {
        const category = exercise.exercise?.category || "כללי";
        const count = recentMuscleGroups.get(category) || 0;
        recentMuscleGroups.set(category, count + 1);
      });
    });

    // Generate reason
    let reason = "";
    if (daysSinceLastWorkout === 0) {
      reason = "כדאי לקחת יום מנוחה, אבל אם אתה מרגיש טוב - קדימה!";
    } else if (daysSinceLastWorkout === 1) {
      reason = "יום מושלם להמשיך עם התוכנית!";
    } else if (daysSinceLastWorkout > 2) {
      reason = `לא התאמנת ${daysSinceLastWorkout} ימים, זמן לחזור לשגרה!`;
    }

    // Check if we should suggest a different muscle group
    const suggestedMuscleGroups = suggestedDay.exercises
      .map((e: any) => e.category || e.muscleGroup)
      .filter(Boolean);

    const overworkedMuscles = Array.from(recentMuscleGroups.entries())
      .filter(([_, count]) => count > 3)
      .map(([muscle]) => muscle);

    if (
      suggestedMuscleGroups.some((mg: string) => overworkedMuscles.includes(mg))
    ) {
      reason += " שים לב שהשרירים האלו עבדו הרבה לאחרונה.";
    }

    return {
      planId: suggestedPlan.id,
      planName: suggestedPlan.name,
      dayId: suggestedDay.id,
      dayName: suggestedDay.name,
      reason,
      confidence: 0.8,
    };
  }, [recentWorkouts, plans]);

  return {
    suggestion,
    isLoading: false,
  };
};
