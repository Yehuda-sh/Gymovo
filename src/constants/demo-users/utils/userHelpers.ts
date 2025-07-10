// src/constants/demo-users/utils/userHelpers.ts
// 🔧 פונקציות עזר לניהול משתמשי דמו

import { User } from "../../../types/user";
import { demoUsers } from "../data/users";
import { getDemoWorkoutHistory } from "../workouts/workoutService";

/**
 * 🔍 מחפש משתמש דמו לפי מזהה
 *
 * @param id - מזהה המשתמש
 * @returns משתמש או undefined אם לא נמצא
 *
 * @example
 * ```typescript
 * const avi = getDemoUserById("demo-user-avi");
 * console.log(avi?.name); // "אבי כהן"
 * ```
 */
export function getDemoUserById(id: string): User | undefined {
  if (!id?.trim()) {
    console.warn("⚠️ getDemoUserById: id is required");
    return undefined;
  }

  return demoUsers.find((user) => user.id === id);
}

/**
 * 📧 מחפש משתמש דמו לפי כתובת אימייל
 *
 * @param email - כתובת האימייל
 * @returns משתמש או undefined אם לא נמצא
 *
 * @example
 * ```typescript
 * const maya = getDemoUserByEmail("maya@gymovo.app");
 * console.log(maya?.name); // "מאיה לוי"
 * ```
 */
export function getDemoUserByEmail(email: string): User | undefined {
  if (!email?.trim()) {
    console.warn("⚠️ getDemoUserByEmail: email is required");
    return undefined;
  }

  return demoUsers.find((user) => user.email === email);
}

/**
 * ✅ בודק אם מזהה משתמש שייך למשתמש דמו
 *
 * @param userId - מזהה המשתמש לבדיקה
 * @returns true אם זה משתמש דמו, false אחרת
 *
 * @example
 * ```typescript
 * console.log(isDemoUser("demo-user-avi")); // true
 * console.log(isDemoUser("real-user-123")); // false
 * ```
 */
export function isDemoUser(userId: string): boolean {
  if (!userId?.trim()) {
    return false;
  }

  return userId.startsWith("demo-user-");
}

/**
 * 📊 מחזיר סטטיסטיקות מפורטות של משתמש דמו
 * כולל חישובים דינמיים מהיסטוריית האימונים
 *
 * @param userId - מזהה המשתמש
 * @returns אובייקט סטטיסטיקות או null אם המשתמש לא נמצא
 */
export function getDemoUserStats(userId: string) {
  if (!userId?.trim()) {
    console.warn("⚠️ getDemoUserStats: userId is required");
    return null;
  }

  const user = demoUsers.find((u) => u.id === userId);
  if (!user) {
    console.warn(`⚠️ Demo user not found: ${userId}`);
    return null;
  }

  const workouts = getDemoWorkoutHistory(userId);
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalVolume = workouts.reduce(
    (sum, w) => sum + (w.totalWeight || 0),
    0
  );
  const averageRating =
    workouts.length > 0
      ? workouts.reduce((sum, w) => sum + (w.rating || 0), 0) / workouts.length
      : 0;

  // חישוב אימונים השבוע
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekWorkouts = workouts.filter((w) => {
    if (!w.date) return false;

    try {
      const workoutDate = new Date(w.date);
      if (isNaN(workoutDate.getTime())) return false;
      return workoutDate > weekAgo;
    } catch {
      console.warn("Invalid date in workout:", w.date);
      return false;
    }
  }).length;

  return {
    // נתונים בסיסיים
    totalWorkouts: workouts.length,
    totalDuration,
    totalVolume,
    averageRating: Math.round(averageRating * 10) / 10, // עיגול לעשיריה

    // נתונים מהפרופיל
    streak: user.stats?.streakDays || 0,
    longestStreak: user.stats?.longestStreak || 0,
    weeklyAverage: user.stats?.weeklyAverage || 0,

    // נתונים מחושבים
    thisWeekWorkouts,
    averageDuration:
      workouts.length > 0 ? Math.round(totalDuration / workouts.length) : 0,
    averageVolume:
      workouts.length > 0 ? Math.round(totalVolume / workouts.length) : 0,

    // נתוני הישגים
    achievements: user.stats?.achievementsUnlocked || 0,
    personalRecords: user.stats?.personalRecordsCount || 0,
    plansCompleted: user.stats?.plansCompleted || 0,
    challengesCompleted: user.stats?.challengesCompleted || 0,
  };
}

/**
 * 📝 מחזיר רשימת כל מזהי המשתמשים הדמו
 */
export function getAllDemoUserIds(): string[] {
  return demoUsers.map((user) => user.id);
}

/**
 * 🎯 מחזיר משתמשים לפי רמת ניסיון
 */
export function getDemoUsersByExperience(
  experience: "beginner" | "intermediate" | "advanced"
): User[] {
  return demoUsers.filter((user) => user.experience === experience);
}

/**
 * 🥅 מחזיר משתמשים לפי מטרות
 */
export function getDemoUsersByGoals(goals: string[]): User[] {
  return demoUsers.filter((user) =>
    user.goals?.some((goal) => goals.includes(goal))
  );
}

/**
 * ✅ מאמת שמזהה משתמש הוא משתמש דמו תקין
 */
export function validateDemoUserId(userId: string): boolean {
  return isDemoUser(userId) && getAllDemoUserIds().includes(userId);
}
