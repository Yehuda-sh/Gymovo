// src/constants/demo-users/data/yoniRozen.ts
// 👤 נתוני יוני רוזן - משתמש דמו מתחיל

import type { DemoUserData } from "./types";

/**
 * 🌱 יוני רוזן - 24, מתחיל
 * בתחילת דרכו בעולם הכושר, השלים שאלון והתוכנית נבנתה לו אוטומטית
 */
export const yoniRozen: DemoUserData = {
  id: "demo-user-yoni",
  email: "yoni@gymovo.app",
  name: "יוני רוזן",
  age: 24,
  isGuest: false,
  experience: "beginner",
  goals: ["hypertrophy", "muscle_gain"], // עודכן לפי השאלון
  createdAt: "2024-11-01T00:00:00Z",
  joinedAt: "2024-11-01T00:00:00Z",
  // 🎯 יוני השלים שאלון: hypertrophy, beginner, gym, 3 days/week
  stats: {
    // מדדי ביצוע משופרים - אחרי התוכנית החדשה
    workoutsCount: 18, // +3 אימונים
    totalDuration: 540, // 18 אימונים * 30 דקות ממוצע (שיפור)
    totalWeightLifted: 22000, // +4000
    totalCaloriesBurned: 3600, // +600
    totalSets: 180, // +45
    totalReps: 1800, // +450

    // רצפים והתמדה - שיפור אחרי התוכנית
    streakDays: 5, // +2
    longestStreak: 7, // +2
    weeklyAverage: 3, // +1 (מ-2 ל-3)
    monthlyWorkouts: 12, // +4
    yearlyWorkouts: 18, // +3
    lastWorkoutDate: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000
    ).toISOString(), // אתמול

    // הישגים משופרים
    achievementsUnlocked: 3, // +1
    personalRecordsCount: 2, // +1
    plansCompleted: 0, // עדיין מתחיל
    challengesCompleted: 1, // +1

    // התקדמות פיזית משופרת
    strengthGain: 18, // +6% שיפור
    muscleGain: 2.5, // +0.7 ק"ג
    fatLoss: 3.1, // +0.8 ק"ג
    enduranceImprovement: 35, // +10% שיפור

    // דירוגים משופרים
    averageWorkoutRating: 4.3, // +0.3
    totalWorkoutRatings: 15, // +3

    // יעדים משופרים
    goalsAchieved: 2, // +1
    goalsInProgress: 1, // -1

    // התפלגות חדשה - מאוזנת יותר לפי התוכנית
    muscleGroupDistribution: {
      "כל הגוף": 40, // -10 (פחות דומיננטי)
      חזה: 20, // +5
      גב: 20, // +5
      רגליים: 20, // קבוע
    },
  },
};
