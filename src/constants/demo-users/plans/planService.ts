// src/constants/demo-users/plans/planService.ts
// 🎯 שירות תוכניות אימון למשתמשי דמו - גרסה נקייה

import { Plan } from "../../../types/plan";

/**
 * 🔍 מחזיר תוכנית אימון מותאמת למשתמש דמו
 *
 * עכשיו מחזיר null - משתמשי דמו ישתמשו בתוכניות הבסיס
 * או יקבלו תוכנית AI אישית מהשאלון
 *
 * @param userId - מזהה המשתמש
 * @returns null - אין יותר תוכניות דמו מובנות
 */
export function getDemoPlanForUser(userId: string): Plan | null {
  // משתמשי דמו יקבלו תוכניות כמו כל משתמש רגיל:
  // 1. גישה ל-3 תוכניות הבסיס
  // 2. אפשרות למלא שאלון ולקבל תוכנית AI אישית
  return null;
}

/**
 * 📊 מחזיר רשימת כל מזהי המשתמשים שיש להם תוכניות
 */
export function getAvailablePlanUserIds(): string[] {
  return []; // אין יותר תוכניות דמו מובנות
}

/**
 * 📋 מחזיר את כל התוכניות הזמינות כמערך
 */
export function getAllDemoPlans(): Plan[] {
  return []; // אין יותר תוכניות דמו מובנות
}

/**
 * 🔍 חיפוש תוכניות לפי רמת קושי
 */
export function getDemoPlansByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): Plan[] {
  return []; // אין יותר תוכניות דמו מובנות
}

/**
 * 🏷️ חיפוש תוכניות לפי טאגים
 */
export function getDemoPlansByTags(tags: string[]): Plan[] {
  return []; // אין יותר תוכניות דמו מובנות
}
