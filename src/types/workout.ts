// src/types/workout.ts
import { Exercise } from "./exercise";

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  status: "pending" | "completed";
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number; // 1-5
}
