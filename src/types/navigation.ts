// src/types/navigation.ts - קובץ מלא ומעודכן

import { QuizAnswers } from "../services/planGenerator";
import { Exercise } from "./exercise";
import { Plan, PlanDay } from "./plan";
import { Workout } from "./workout";

export interface RegisterData {
  email: string;
  password: string;
  age: number;
  name?: string;
}

export type RootStackParamList = {
  // Auth Stack - מסכי הרשמה והתחברות
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ConvertGuest: undefined; // מסך חדש להמרת אורח
  Quiz: {
    signupData?: RegisterData;
    resumeFrom?: string;
    existingAnswers?: Partial<QuizAnswers>;
  };

  // Main App - מסך ראשי עם טאבים
  Main: {
    screen?: string;
  };

  // Workout Screens - מסכי אימון
  StartWorkout: {
    planId?: string;
    dayId?: string;
  };
  ActiveWorkout: {
    workout: Workout;
    plan?: Plan;
  };
  WorkoutSummary: {
    workout: Workout;
    workoutData?: any; // תאימות לאחור
  };
  SelectWorkoutDay: {
    planId: string;
  };

  // Exercise Screens - מסכי תרגילים
  ExerciseDetails: {
    exerciseId: string;
  };
  ExerciseSelection: {
    selectedIds?: string[];
    onSelect?: (exercises: Exercise[]) => void;
  };
  ExercisesPicker: {
    onSelect?: (exercises: Exercise[]) => void;
    selectedExercises?: Exercise[];
    planId?: string;
    dayId?: string;
  };

  // Plan Management - ניהול תוכניות
  CreatePlan: undefined; // תאימות לאחור
  CreateOrEditPlan: {
    planId?: string;
  };
  EditWorkoutDay: {
    planId: string;
    dayId: string;
  };

  // Settings - הגדרות
  Settings: undefined;
};
