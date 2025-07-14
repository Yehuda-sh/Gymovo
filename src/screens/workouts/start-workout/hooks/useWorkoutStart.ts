// src/screens/workouts/start-workout/hooks/useWorkoutStart.ts

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useWorkoutStore } from "../../../../stores/workoutStore";
import { RootStackParamList } from "../../../../types/navigation";
import { Plan, PlanDay, PlanExercise } from "../../../../types/plan";
import { WorkoutExercise } from "../../../../types/workout";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UseWorkoutStartReturn {
  isStarting: boolean;
  startWorkout: (plan: Plan, day: PlanDay) => Promise<void>;
  startQuickWorkout: (exercises: WorkoutExercise[]) => Promise<void>;
  canStartWorkout: (plan: Plan | null, day: PlanDay | null) => boolean;
}

export const useWorkoutStart = (): UseWorkoutStartReturn => {
  const navigation = useNavigation<NavigationProp>();
  const startWorkoutStore = useWorkoutStore((state) => state.startWorkout);
  const [isStarting, setIsStarting] = useState(false);

  // Helper function to create workout exercise from plan exercise
  const createWorkoutExercise = useCallback(
    (planEx: PlanExercise, index: number): WorkoutExercise => {
      return {
        id: `${planEx.id}_${Date.now()}_${index}`,
        name: planEx.name,
        exercise: {
          id: planEx.id,
          name: planEx.name,
          category: planEx.muscleGroup || planEx.targetMuscles?.[0] || "כללי",
        },
        sets: Array.from({ length: planEx.sets || 3 }, (_, i) => ({
          id: `${planEx.id}_set_${i}_${Date.now()}`,
          reps: planEx.targetReps || planEx.reps || 10,
          weight: 0,
          status: "pending" as const,
        })),
      };
    },
    []
  );

  // Start workout with plan and day
  const startWorkout = useCallback(
    async (plan: Plan, day: PlanDay) => {
      try {
        setIsStarting(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Convert plan exercises to workout exercises
        const workoutExercises: WorkoutExercise[] = day.exercises.map(
          (exercise, index) => createWorkoutExercise(exercise, index)
        );

        // Start workout in store
        startWorkoutStore({
          planId: plan.id,
          planName: plan.name,
          dayId: day.id,
          dayName: day.name,
          exercises: workoutExercises,
        });

        // Navigate to active workout
        navigation.navigate("ActiveWorkout");
      } catch (error) {
        console.error("Failed to start workout:", error);
        Alert.alert("שגיאה", "לא הצלחנו להתחיל את האימון");
      } finally {
        setIsStarting(false);
      }
    },
    [navigation, startWorkoutStore, createWorkoutExercise]
  );

  // Start quick workout without plan
  const startQuickWorkout = useCallback(
    async (exercises: WorkoutExercise[]) => {
      try {
        setIsStarting(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        startWorkoutStore({
          planId: "quick",
          planName: "אימון מותאם אישית",
          dayId: "quick",
          dayName: "אימון חופשי",
          exercises,
        });

        navigation.navigate("ActiveWorkout");
      } catch (error) {
        console.error("Failed to start quick workout:", error);
        Alert.alert("שגיאה", "לא הצלחנו להתחיל את האימון");
      } finally {
        setIsStarting(false);
      }
    },
    [navigation, startWorkoutStore]
  );

  // Check if can start workout
  const canStartWorkout = useCallback(
    (plan: Plan | null, day: PlanDay | null): boolean => {
      return !!(plan && day && day.exercises?.length > 0);
    },
    []
  );

  return {
    isStarting,
    startWorkout,
    startQuickWorkout,
    canStartWorkout,
  };
};
