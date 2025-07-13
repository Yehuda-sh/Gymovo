// src/screens/workouts/start-workout/hooks/useWorkoutStart.ts
// Hook לניהול התחלת אימון עם validations ו-error handling

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { useWorkoutStore } from "../../../../stores/workoutStore";
import { useUserStore } from "../../../../stores/userStore";
import { RootStackParamList } from "../../../../types/navigation";
import { Plan, PlanDay } from "../../../../types/plan";
import { Workout, WorkoutExercise } from "../../../../types/workout";

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
  const activeWorkout = useWorkoutStore((state) => state.activeWorkout);
  const [isStarting, setIsStarting] = useState(false);

  // Helper function to create workout from plan exercise
  const createWorkoutFromPlanExercise = useCallback(
    (planEx: any, index: number): WorkoutExercise => {
      if ("sets" in planEx && typeof planEx.sets === "number") {
        return {
          id: `${planEx.id}_${index}`,
          name: planEx.name,
          exercise: {
            id: planEx.id,
            name: planEx.name,
            category: planEx.muscleGroup || "כללי",
          },
          sets: Array.from({ length: planEx.sets }, (_, i) => ({
            id: `${planEx.id}_set_${i}`,
            reps: planEx.reps || 10,
            weight: planEx.weight || 0,
            status: "pending" as const,
          })),
        };
      } else if ("sets" in planEx && Array.isArray(planEx.sets)) {
        return planEx;
      } else {
        return {
          id: `${planEx.id}_${index}`,
          name: planEx.name,
          exercise: {
            id: planEx.id,
            name: planEx.name,
            category: "כללי",
          },
          sets: Array.from({ length: 3 }, (_, i) => ({
            id: `${planEx.id}_set_${i}`,
            reps: 10,
            weight: 0,
            status: "pending" as const,
          })),
        };
      }
    },
    []
  );

  // Check if can start workout
  const canStartWorkout = useCallback(
    (plan: Plan | null, day: PlanDay | null): boolean => {
      if (!plan || !day) return false;
      if (!day.exercises || day.exercises.length === 0) return false;
      if (activeWorkout) return false; // Already have active workout
      return true;
    },
    [activeWorkout]
  );

  // Start workout from plan
  const startWorkout = useCallback(
    async (plan: Plan, day: PlanDay) => {
      if (!canStartWorkout(plan, day)) {
        Alert.alert("שגיאה", "לא ניתן להתחיל אימון");
        return;
      }

      setIsStarting(true);

      try {
        // Check for active workout
        if (activeWorkout) {
          Alert.alert(
            "אימון פעיל",
            "יש לך אימון פעיל. האם לסיים אותו ולהתחיל חדש?",
            [
              { text: "ביטול", style: "cancel" },
              {
                text: "סיים והתחל חדש",
                style: "destructive",
                onPress: () => proceedWithWorkout(),
              },
            ]
          );
          return;
        }

        await proceedWithWorkout();

        async function proceedWithWorkout() {
          // Create workout exercises
          const workoutExercises = day.exercises.map((exercise, index) =>
            createWorkoutFromPlanExercise(exercise, index)
          );

          // Create workout object
          const workout: Workout = {
            id: `workout_${Date.now()}`,
            name: `${plan.name} - ${day.name}`,
            date: new Date(),
            planId: plan.id,
            planDayId: day.id,
            exercises: workoutExercises,
            totalVolume: 0,
            totalSets: workoutExercises.reduce(
              (acc, ex) => acc + ex.sets.length,
              0
            ),
            completedSets: 0,
            notes: "",
            userId: useUserStore.getState().user?.id || "",
          };

          // Start workout in store
          startWorkoutStore(workout);

          // Haptic feedback
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );

          // Navigate to active workout
          navigation.navigate("ActiveWorkout", { workout });
        }
      } catch (error) {
        console.error("Error starting workout:", error);
        Alert.alert("שגיאה", "אירעה שגיאה בהתחלת האימון");
      } finally {
        setIsStarting(false);
      }
    },
    [
      activeWorkout,
      canStartWorkout,
      createWorkoutFromPlanExercise,
      navigation,
      startWorkoutStore,
    ]
  );

  // Start quick workout
  const startQuickWorkout = useCallback(
    async (exercises: WorkoutExercise[]) => {
      if (exercises.length === 0) {
        Alert.alert("שגיאה", "יש לבחור לפחות תרגיל אחד");
        return;
      }

      setIsStarting(true);

      try {
        // Create workout object
        const workout: Workout = {
          id: `workout_${Date.now()}`,
          name: "אימון מותאם אישית",
          date: new Date(),
          exercises,
          totalVolume: 0,
          totalSets: exercises.reduce((acc, ex) => acc + ex.sets.length, 0),
          completedSets: 0,
          notes: "",
          userId: useUserStore.getState().user?.id || "",
        };

        // Start workout
        startWorkoutStore(workout);

        // Haptic feedback
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );

        // Navigate
        navigation.navigate("ActiveWorkout", { workout });
      } catch (error) {
        console.error("Error starting quick workout:", error);
        Alert.alert("שגיאה", "אירעה שגיאה בהתחלת האימון");
      } finally {
        setIsStarting(false);
      }
    },
    [navigation, startWorkoutStore]
  );

  return {
    isStarting,
    startWorkout,
    startQuickWorkout,
    canStartWorkout,
  };
};
