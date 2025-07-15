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
    totalWorkouts: 78,
    totalTime: 5460, // 78 אימונים * 70 דקות ממוצע
    totalVolume: 120000,
    favoriteExercises: [],
    // מדדי ביצוע בסיסיים - מאמנת אינטנסיבית
    workoutsCount: 78,
    totalDuration: 5460,
    totalWeightLifted: 120000,
    totalCaloriesBurned: 21000,
    totalSets: 1248,
    totalReps: 12480,
    streakDays: 20,
    longestStreak: 22,
    weeklyAverage: 5,
    monthlyWorkouts: 20,
    yearlyWorkouts: 78,
    lastWorkoutDate: new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000
    ).toISOString(),
    achievementsUnlocked: 12,
    personalRecordsCount: 5,
    plansCompleted: 3,
    challengesCompleted: 2,
    strengthGain: 18,
    muscleGain: 4.1,
    fatLoss: 2.8,
    enduranceImprovement: 10,
    averageWorkoutRating: 4.7,
    totalWorkoutRatings: 70,
    goalsAchieved: 3,
    goalsInProgress: 1,
    muscleGroupDistribution: {
      חזה: 20,
      גב: 20,
      רגליים: 30,
      כתפיים: 15,
      זרועות: 15,
    },
  },
};
