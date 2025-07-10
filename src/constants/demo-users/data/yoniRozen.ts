// src/constants/demo-users/data/yoniRozen.ts
// 👤 נתוני יוני רוזן - משתמש דמו מתחיל

import type { DemoUserData } from "./types";

/**
 * 🌱 יוני רוזן - 24, מתחיל
 * בתחילת דרכו בעולם הכושר, מתמקד בכושר כללי ובניית בסיס
 */
export const yoniRozen: DemoUserData = {
  id: "demo-user-yoni",
  email: "yoni@gymovo.app",
  name: "יוני רוזן",
  age: 24,
  isGuest: false,
  experience: "beginner",
  goals: ["general_fitness", "muscle_gain"],
  createdAt: "2024-11-01T00:00:00Z",
  joinedAt: "2024-11-01T00:00:00Z",
  stats: {
    // מדדי ביצוע בסיסיים - התחלה צנועה
    workoutsCount: 15,
    totalDuration: 375, // 15 אימונים * 25 דקות ממוצע
    totalWeightLifted: 18000,
    totalCaloriesBurned: 3000,
    totalSets: 135,
    totalReps: 1350,

    // רצפים והתמדה - עדיין בבנייה
    streakDays: 3,
    longestStreak: 5,
    weeklyAverage: 2,
    monthlyWorkouts: 8,
    yearlyWorkouts: 15,
    lastWorkoutDate: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString(),

    // הישגים ראשוניים
    achievementsUnlocked: 2,
    personalRecordsCount: 1,
    plansCompleted: 0,
    challengesCompleted: 0,

    // דירוגים טובים למתחיל
    averageWorkoutRating: 4.0,
    totalWorkoutRatings: 12,

    // התפלגות קבוצות שרירים - דגש על כל הגוף ויסודות
    muscleGroupDistribution: {
      "כל הגוף": 50,
      רגליים: 20,
      חזה: 15,
      גב: 15,
    },
  },
};
