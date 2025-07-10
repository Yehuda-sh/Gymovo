// src/constants/demoUsers.ts
// 🏗️ מרכז ייצוא מאוחד למערכת משתמשי הדמו המרופקטרת

/**
 * 🔄 גרסה משודרגת של מערכת משתמשי הדמו
 * מרופקטרת למודולים נפרדים לקריאות ותחזוקה טובה יותר
 * מקיימת תאימות לאחור מלאה עם הקוד הקיים
 *
 * המקור הוחלף מקובץ מונוליתי של 942 שורות
 * למבנה מודולרי מאורגן ב-20+ קבצים נפרדים
 */

// 👥 ייצוא מרכזי של כל הפונקציונליות
export {
  // נתוני משתמשים בסיסיים
  demoUsers,

  // פונקציות מרכזיות - תאימות לאחור מלאה
  getDemoPlanForUser,
  getDemoWorkoutHistory,
  getDemoUserById,
  getDemoUserByEmail,
  isDemoUser,
  getDemoUserStats,

  // טיפוסים
  type DemoUserData,
  type DemoPlanConfig,
  type DemoWorkoutData,

  // ייצוא מודולים מלאים
  DemoData,
  DemoPlans,
  DemoWorkouts,
  DemoUtils,

  // API מאוחד
  createDemoUsersAPI,
  type DemoUsersAPI,
} from "./demo-users";

/**
 * 🎉 Export ברירת מחדל למערכת מאוחדת
 * מספק גישה נוחה לכל הפונקציונליות במקום אחד
 */
export { default } from "./demo-users";

/**
 * 🔧 Instance global ל-development
 * מאפשר גישה קלה למערכת משתמשי הדמו מה-console
 * זמין כ-__DEMO_USERS_API__ ב-global scope
 */
