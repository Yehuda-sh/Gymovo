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
    resumeFrom?: string;
    existingAnswers?: Partial<QuizAnswers>;
  };

  // ✅ מסכי אימון
  StartWorkout: undefined;
  CreatePlan: undefined;
  ExerciseSelection: undefined;
  ActiveWorkout: undefined;

  // ✅ מסכים ראשיים
  Main: { screen?: string };
  // ❌ הסרתי: SelectPlan: undefined;
  SelectWorkoutDay: { planId: string };
  WorkoutSummary: { workoutData: any };
  ExerciseDetails: { exerciseId: string };

  // ✅ מסכי ניהול תוכניות
  CreateOrEditPlan: { planId?: string };
  EditWorkoutDay: { planId: string; dayId: string };
  ExercisesPicker: { planId: string; dayId: string };

  // ✅ הגדרות
  Settings: undefined;
};
