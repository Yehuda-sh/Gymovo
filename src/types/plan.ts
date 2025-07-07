// src/types/plan.ts - עדכון עם metadata
export interface PlanExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface PlanDay {
  id: string;
  name: string;
  exercises: PlanExercise[];
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  creator: string;
  days: PlanDay[];
  metadata?: {
    goal?: string;
    experience?: string;
    equipment?: string[];
    injuries?: string[];
    generatedAt?: string;
    difficulty?: string;
    estimatedDuration?: number; // בדקות
    tags?: string[];
  };
}
