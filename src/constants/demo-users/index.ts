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

// 📂 נתוני משתמשים - ייצוא ישיר לתאימות לאחור
export { demoUsers } from "./data";
export type { DemoUserData } from "./data";

// 📋 תוכניות אימון - פונקציה מרכזית + ייצוא נוסף
export { getDemoPlanForUser } from "./plans";
export type { DemoPlanConfig } from "./plans";

// 🏋️ היסטוריית אימונים - פונקציה מרכזית + ייצוא נוסף
export { getDemoWorkoutHistory } from "./workouts";
export type { DemoWorkoutData } from "./workouts";

// 🛠️ כלי עזר - פונקציות עזר מרכזיות
export {
  getDemoUserById,
  getDemoUserByEmail,
  isDemoUser,
  getDemoUserStats,
} from "./utils";

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
