// src/constants/demo-users/plans/planService.ts
// 🎯 שירות תוכניות אימון למשתמשי דמו

import { Plan } from "../../../types/plan";
import { aviPlan } from "./aviPlan";
import { mayaPlan } from "./mayaPlan";
import { yoniPlan } from "./yoniPlan";

/**
 * 📋 מאפה מבוסס מפתח למציאת תוכניות לפי משתמש
 * מבטיח ביצועים מהירים וארגון נקי
 */
const plansByUserId: { [key: string]: Plan } = {
  "demo-user-avi": aviPlan,
  "demo-user-maya": mayaPlan,
  "demo-user-yoni": yoniPlan,
};

/**
 * 🔍 מחזיר תוכנית אימון מותאמת למשתמש דמו ספציפי
 *
 * @param userId - מזהה המשתמש
 * @returns תוכנית אימון או null אם לא נמצאה
 *
 * @example
 * ```typescript
 * const aviPlan = getDemoPlanForUser("demo-user-avi");
 * console.log(aviPlan?.name); // "Push/Pull/Legs - אבי"
 * ```
 */
export function getDemoPlanForUser(userId: string): Plan | null {
  if (!userId?.trim()) {
    console.warn("⚠️ getDemoPlanForUser: userId is required");
    return null;
  }

  const plan = plansByUserId[userId];

  if (!plan && __DEV__) {
    console.log(`📋 No demo plan found for user: ${userId}`);
  }

  return plan || null;
}

/**
 * 📊 מחזיר רשימת כל מזהי המשתמשים שיש להם תוכניות
 */
export function getAvailablePlanUserIds(): string[] {
  return Object.keys(plansByUserId);
}

/**
 * 📋 מחזיר את כל התוכניות הזמינות כמערך
 */
export function getAllDemoPlans(): Plan[] {
  return Object.values(plansByUserId);
}

/**
 * 🔍 חיפוש תוכניות לפי רמת קושי
 */
export function getDemoPlansByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): Plan[] {
  return getAllDemoPlans().filter((plan) => plan.difficulty === difficulty);
}

/**
 * 🏷️ חיפוש תוכניות לפי טאגים
 */
export function getDemoPlansByTags(tags: string[]): Plan[] {
  return getAllDemoPlans().filter((plan) =>
    plan.tags?.some((tag) => tags.includes(tag))
  );
}
