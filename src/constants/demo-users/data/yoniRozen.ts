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
    totalWorkouts: 18,
    totalTime: 1260, // 18 אימונים * 70 דקות ממוצע
    totalVolume: 25000,
    favoriteExercises: [],
    // מדדי ביצוע משופרים - אחרי התוכנית החדשה
    workoutsCount: 18, // +3 אימונים
    totalDuration: 1260, // 18 אימונים * 70 דקות ממוצע
    totalWeightLifted: 25000, // +4000
    totalCaloriesBurned: 4200, // +600
    totalSets: 288, // +45
    totalReps: 2880, // +450

    // רצפים והתמדה - שיפור אחרי התוכנית
    streakDays: 5, // +2
    longestStreak: 7, // +2
    weeklyAverage: 2, // +1 (מ-2 ל-3)
    monthlyWorkouts: 8, // +4
    yearlyWorkouts: 18, // +3
    lastWorkoutDate: new Date(
      Date.now() - 3 * 24 * 60 * 60 * 1000
    ).toISOString(), // אתמול

    // הישגים משופרים
    achievementsUnlocked: 3, // +1
    personalRecordsCount: 1, // +1
    plansCompleted: 1, // עדיין מתחיל
    challengesCompleted: 0, // +1

    // התקדמות פיזית משופרת
    strengthGain: 7, // +6% שיפור
    muscleGain: 1.1, // +0.7 ק"ג
    fatLoss: 0.9, // +0.8 ק"ג
    enduranceImprovement: 3, // +10% שיפור

    // דירוגים משופרים
    averageWorkoutRating: 4.2, // +0.3
    totalWorkoutRatings: 15, // +3

    // יעדים משופרים
    goalsAchieved: 1, // +1
    goalsInProgress: 1, // -1

    // התפלגות חדשה - מאוזנת יותר לפי התוכנית
    muscleGroupDistribution: {
      חזה: 15,
      גב: 20,
      רגליים: 35,
      כתפיים: 15,
      זרועות: 15,
    },
  },
};
