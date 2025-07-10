// src/constants/demo-users/index.ts
// 👥 מערכת משתמשי דמו מרופקטרת - ייצוא מרכזי

/**
 * 🎯 מערכת משתמשי דמו מחולקת למודולים
 * מספקת תאימות לאחור מלאה עם הקוד הקיים
 *
 * המבנה:
 * - data/: נתוני משתמשים סטטיים
 * - plans/: תוכניות אימון מותאמות
 * - workouts/: היסטוריית אימונים
 * - utils/: פונקציות עזר וחיפוש
 */

// 📂 נתוני משתמשים - import לפני שימוש
import { demoUsers } from "./data";
import type { DemoUserData } from "./data";

// 📋 תוכניות אימון - import לפני שימוש
import { getDemoPlanForUser } from "./plans";
import type { DemoPlanConfig } from "./plans";

// 🏋️ היסטוריית אימונים - import לפני שימוש
import { getDemoWorkoutHistory } from "./workouts";
import type { DemoWorkoutData } from "./workouts";

// 🛠️ כלי עזר - import לפני שימוש
import {
  getDemoUserById,
  getDemoUserByEmail,
  isDemoUser,
  getDemoUserStats,
} from "./utils";

// Re-export everything for backward compatibility
export {
  // נתוני משתמשים - ייצוא ישיר לתאימות לאחור
  demoUsers,
  type DemoUserData,

  // תוכניות אימון - פונקציה מרכזית + ייצוא נוסף
  getDemoPlanForUser,
  type DemoPlanConfig,

  // היסטוריית אימונים - פונקציה מרכזית + ייצוא נוסף
  getDemoWorkoutHistory,
  type DemoWorkoutData,

  // כלי עזר - פונקציות עזר מרכזיות
  getDemoUserById,
  getDemoUserByEmail,
  isDemoUser,
  getDemoUserStats,
};

// 🎯 ייצוא מודולים מלאים למתפתחים מתקדמים
export * as DemoData from "./data";
export * as DemoPlans from "./plans";
export * as DemoWorkouts from "./workouts";
export * as DemoUtils from "./utils";

/**
 * 🔧 Interface מאוחד לכל מערכת משתמשי הדמו
 * מספק גישה מובנת לכל הפונקציונליות
 */
export interface DemoUsersAPI {
  // נתוני משתמשים
  users: typeof demoUsers;

  // פונקציות מרכזיות
  getUserById: typeof getDemoUserById;
  getUserByEmail: typeof getDemoUserByEmail;
  isPlanForUser: typeof getDemoPlanForUser;
  getWorkoutHistory: typeof getDemoWorkoutHistory;
  getUserStats: typeof getDemoUserStats;
  isDemoUser: typeof isDemoUser;
}

/**
 * 🏭 Factory function ליצירת API מאוחד
 * מספק interface נוח לשימוש במערכת הדמו
 */
export function createDemoUsersAPI(): DemoUsersAPI {
  return {
    users: demoUsers,
    getUserById: getDemoUserById,
    getUserByEmail: getDemoUserByEmail,
    isPlanForUser: getDemoPlanForUser,
    getWorkoutHistory: getDemoWorkoutHistory,
    getUserStats: getDemoUserStats,
    isDemoUser,
  };
}

/**
 * 🔧 Instance global ל-development
 * מאפשר גישה קלה למערכת משתמשי הדמו מה-console
 */
if (__DEV__) {
  (global as any).__DEMO_USERS_API__ = createDemoUsersAPI();
  console.log("🔧 Demo Users API available globally as __DEMO_USERS_API__");
}

/**
 * 🎉 Export ברירת מחדל למערכת מאוחדת
 */
export default createDemoUsersAPI();
