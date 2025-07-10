// src/constants/demo-users/plans/types.ts
// 📝 טיפוסים עבור תוכניות אימון דמו

import { Plan } from "../../../types/plan";

/**
 * 🎯 קונפיגורציה לתוכנית דמו
 * מרחיב את הטיפוס הבסיסי עם מאפיינים נוספים
 */
export interface DemoPlanConfig extends Plan {
  creator: "Gymovo AI";
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
