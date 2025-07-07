// src/types/navigation.ts - עדכון עם תמיכה בהמשכת שאלון

import { QuizAnswers } from "../services/planGenerator";

export interface RegisterData {
  email: string;
  password: string;
  age: number;
  name?: string;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Quiz: {
    signupData: RegisterData;
    resumeFrom?: string; // מזהה השאלה להמשיך ממנה
    existingAnswers?: Partial<QuizAnswers>; // תשובות קיימות
  };
  Main: { screen?: string };
  SelectPlan: undefined;
  SelectWorkoutDay: { planId: string };
  ActiveWorkout: undefined;
  WorkoutSummary: { workoutData: any };
  ExerciseDetails: { exerciseId: string };
  CreateOrEditPlan: { planId?: string };
  EditWorkoutDay: { planId: string; dayId: string };
  ExercisesPicker: { planId: string; dayId: string };
  Settings: undefined;
};
