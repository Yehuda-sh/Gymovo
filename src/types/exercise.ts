// src/types/exercise.ts - מעודכן אם צריך
export interface Exercise {
  id: string;
  name: string;
  category: string;
  description?: string;
  instructions?: string;
  imageUrl?: string;
  videoUrl?: string;
  targetMuscles?: string[];
  equipment?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
}
