// src/constants/demo-users/workouts/types.ts
// 📝 טיפוסים עבור נתוני אימוני דמו

import { Workout } from "../../../types/workout";

/**
 * 🏋️ טיפוס מותאם לאימון דמו
 * מרחיב את הטיפוס הבסיסי עם תכונות נדרשות
 */
export interface DemoWorkoutData extends Omit<Workout, "date"> {
  userId: string;
  date: Date; // נשאר כ-Date עבור נתוני דמו
  duration: number;
  exercises: any[]; // רשימה ריקה בנתוני הדמו
  rating: number;
  totalSets: number;
  completedSets: number;
  totalWeight: number;
  notes?: string;
}
