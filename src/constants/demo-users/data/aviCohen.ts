// src/constants/demo-users/data/aviCohen.ts
// 👤 נתוני אבי כהן - משתמש דמו מתקדם בינוני

import type { DemoUserData } from "./types";

/**
 * 💪 אבי כהן - 28, מתקדם בינוני
 * מתמחה בבניית כוח ומסה עם חלוקה למקבוצות שרירים
 */
export const aviCohen: DemoUserData = {
  id: "demo-user-avi",
  email: "avi@gymovo.app",
  name: "אבי כהן",
  age: 28,
  isGuest: false,
  experience: "intermediate",
  goals: ["muscle_gain", "strength"],
  createdAt: "2024-10-01T00:00:00Z",
  joinedAt: "2024-10-01T00:00:00Z",
  stats: {
    // מדדי ביצוע בסיסיים
    workoutsCount: 45,
    totalDuration: 3375, // 45 אימונים * 75 דקות ממוצע
    totalWeightLifted: 85000,
    totalCaloriesBurned: 13500,
    totalSets: 810,
    totalReps: 8100,

    // רצפים והתמדה
    streakDays: 12,
    longestStreak: 15,
    weeklyAverage: 4,
    monthlyWorkouts: 16,
    yearlyWorkouts: 45,
    lastWorkoutDate: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(),

    // הישגים ופיתוח
    achievementsUnlocked: 8,
    personalRecordsCount: 3,
    plansCompleted: 2,
    challengesCompleted: 1,

    // התקדמות פיזית
    strengthGain: 15, // 15% עלייה במשקלים
    muscleGain: 3.2, // 3.2 ק"ג שרירים
    fatLoss: 2.1, // 2.1 ק"ג שומן
    enduranceImprovement: 8, // 8% שיפור בסיבולת

    // דירוגים ומשוב
    averageWorkoutRating: 4.5,
    totalWorkoutRatings: 40,

    // יעדים
    goalsAchieved: 2,
    goalsInProgress: 1,

    // התפלגות קבוצות שרירים - מתמחה בחלוקה קלאסית
    muscleGroupDistribution: {
      חזה: 25,
      גב: 25,
      רגליים: 20,
      כתפיים: 15,
      זרועות: 15,
    },
  },
};
