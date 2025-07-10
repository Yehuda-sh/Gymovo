// src/constants/demo-users/data/users.ts
// 👥 רשימה מאוחדת של כל משתמשי הדמו

import { aviCohen } from "./aviCohen";
import { mayaLevi } from "./mayaLevi";
import { yoniRozen } from "./yoniRozen";
import type { DemoUserData } from "./types";

/**
 * 📊 מערך מאוחד של כל משתמשי הדמו
 * מכיל 3 משתמשים מייצגים ברמות שונות:
 * - אבי כהן: בינוני, מתמחה בכוח ומסה
 * - מאיה לוי: מתקדמת, מתמחה בסיבולת וירידה במשקל
 * - יוני רוזן: מתחיל, כושר כללי
 */
export const demoUsers: DemoUserData[] = [aviCohen, mayaLevi, yoniRozen];

// Freeze the array to prevent accidental mutations
Object.freeze(demoUsers);
