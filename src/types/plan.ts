// File: src/types/plan.ts
export interface PlanExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
}

export interface PlanDay {
  id: string;
  name: string; // דוג': "יום א' - חזה ויד קדמית"
  exercises: PlanExercise[];
}

export interface Plan {
  id: string;
  name: string;
  description?: string;
  days: PlanDay[];
  creator?: string; // מי יצר (userId, או "demo")
}
