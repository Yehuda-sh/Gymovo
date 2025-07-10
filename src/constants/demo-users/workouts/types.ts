// src/constants/demo-users/workouts/types.ts
// 📝 טיפוסים עבור נתוני אימוני דמו

import { Workout } from "../../../types/workout";

/**
 * 🏋️ טיפוס מותאם לאימון דמו
 * מרחיב את הטיפוס הבסיסי עם תכונות נדרשות
 */
export interface DemoWorkoutData extends Workout {
  userId: string;
  date: Date;
  duration: number;
  exercises: any[]; // רשימה ריקה בנתוני הדמו
  rating: number;
  totalSets: number;
  completedSets: number;
  totalWeight: number;
  notes?: string;
}
