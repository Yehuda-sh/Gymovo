// src/utils/idGenerator.ts - 🆔 מחולל זיהויים ייחודיים

/**
 * יצירת זיהוי ייחודי מבוסס timestamp ומספר אקראי
 * @returns string - זיהוי ייחודי
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * יצירת זיהוי קצר יותר לשימוש פנימי
 * @returns string - זיהוי קצר
 */
export const generateShortId = (): string => {
  return Math.random().toString(36).substr(2, 8);
};

/**
 * יצירת זיהוי לשימוש בworkout sets
 * @param prefix - קידומת לזיהוי
 * @returns string - זיהוי עם קידומת
 */
export const generateSetId = (prefix: string = "set"): string => {
  return `${prefix}_${generateShortId()}`;
};

/**
 * יצירת זיהוי עבור תרגילים באימון
 * @param exerciseId - זיהוי התרגיל הבסיסי
 * @returns string - זיהוי תרגיל באימון
 */
export const generateWorkoutExerciseId = (exerciseId: string): string => {
  return `${exerciseId}_${generateShortId()}`;
};

/**
 * בדיקה אם זיהוי הוא תקני
 * @param id - הזיהוי לבדיקה
 * @returns boolean - האם הזיהוי תקני
 */
export const isValidId = (id: string): boolean => {
  return typeof id === "string" && id.length > 0 && !id.includes(" ");
};

/**
 * יצירת זיהוי עבור תוכניות אימון
 * @param prefix - קידומת (plan, day, exercise)
 * @returns string - זיהוי מלא
 */
export const generatePlanId = (prefix: string = "plan"): string => {
  return `${prefix}_${Date.now()}_${generateShortId()}`;
};

/**
 * ניקוי זיהוי מתווים לא חוקיים
 * @param id - זיהוי לניקוי
 * @returns string - זיהוי נקי
 */
export const sanitizeId = (id: string): string => {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
};
