// src/types/exercise.ts - תיקון הטיפוסים

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: string; // חזה, גב, רגליים וכו'
  targetMuscleGroups?: string[]; // ✅ תיקון: החזר ל-targetMuscleGroups
  difficulty?: DifficultyLevel; // ✅ תיקון: רק ערכים באנגלית
  equipment?: string[]; // ✅ תיקון: מערך של ציוד
  instructions?: string[]; // ✅ תיקון: רק מערך
  imageUrl?: string;
  videoUrl?: string;
  duration?: number; // בשניות עבור תרגילי זמן
  calories?: number; // קלוריות משוערות
}
