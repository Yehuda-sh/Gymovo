// src/constants/demo-users/data/mayaLevi.ts
// 👤 נתוני מאיה לוי - משתמשת דמו מתקדמת

import type { DemoUserData } from "./types";

/**
 * 🏃‍♀️ מאיה לוי - 32, מתקדמת
 * מתמחה בירידה במשקל וסיבולת עם אימוני HIIT
 */
export const mayaLevi: DemoUserData = {
  id: "demo-user-maya",
  email: "maya@gymovo.app",
  name: "מאיה לוי",
  age: 32,
  isGuest: false,
  experience: "advanced",
  goals: ["weight_loss", "endurance"],
  createdAt: "2024-09-15T00:00:00Z",
  joinedAt: "2024-09-15T00:00:00Z",
  stats: {
    // מדדי ביצוע בסיסיים - מאמנת אינטנסיבית
    workoutsCount: 78,
    totalDuration: 3510, // 78 אימונים * 45 דקות ממוצע
    totalWeightLifted: 95000,
    totalCaloriesBurned: 23400,
    totalSets: 1248,
    totalReps: 15600,

    // רצפים והתמדה מעולים
    streakDays: 23,
    longestStreak: 30,
    weeklyAverage: 6,
    monthlyWorkouts: 24,
    yearlyWorkouts: 78,
    lastWorkoutDate: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(),

    // הישגים מתקדמים
    achievementsUnlocked: 15,
    personalRecordsCount: 5,
    plansCompleted: 3,
    challengesCompleted: 4,

    // דירוגים גבוהים
    averageWorkoutRating: 4.8,
    totalWorkoutRatings: 75,

    // התפלגות קבוצות שרירים - דגש על כל הגוף ופונקציונליות
    muscleGroupDistribution: {
      "כל הגוף": 40,
      רגליים: 25,
      ליבה: 20,
      חזה: 10,
      גב: 5,
    },
  },
};
