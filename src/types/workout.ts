// src/types/workout.ts
import { Exercise } from "./exercise";

export interface WorkoutSet {
  id?: string;
  weight?: number;
  reps?: number;
  duration?: number; // 🆕 למשך זמן (פלאנק, וכו')
  rest?: number; // 🆕 זמן מנוחה
  status?: "pending" | "completed";
  completed?: boolean; // 🆕 סטטוס השלמה
}

export interface WorkoutExercise {
  id: string;
  name: string; // 🆕 שם התרגיל
  exercise?: Exercise;
  sets: WorkoutSet[];
  category?: string; // 🆕 קטגוריה
  instructions?: string; // 🆕 הוראות
}

export interface Workout {
  id: string;
  name: string;
  date?: string; // ISO
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number; // 1-5

  // 🆕 שדות חדשים לשלב 1
  completedAt?: string;
  duration?: number; // משך האימון בדקות
  estimatedDuration?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  targetMuscles?: string[];
}
