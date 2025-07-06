// File: src/types/navigation.ts
import { NavigatorScreenParams } from "@react-navigation/native";
import { RegisterData } from "../stores/userStore";
import { Exercise } from "./exercise";
import { Plan, PlanDay, PlanExercise } from "./plan";
import { AppTabsParamList } from "./tabs";
import { Workout } from "./workout";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Quiz: { signupData: Omit<RegisterData, "name"> };
  Main: NavigatorScreenParams<AppTabsParamList>;
  WorkoutSummary: { workout: Workout };
  ExerciseDetails: { exerciseId: string };
  Settings: undefined;
  ExercisesPicker: {
    initiallySelected: PlanExercise[];
    onDone: (selectedExercises: Exercise[]) => void;
  };
  SelectPlan: undefined;
  SelectWorkoutDay: { plan: Plan };
  ActiveWorkout: { plan: Plan; day: PlanDay };
  CreateOrEditPlan: { planId?: string };
  EditWorkoutDay: { dayId?: string };
};
