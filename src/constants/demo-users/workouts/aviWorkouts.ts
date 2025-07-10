// src/constants/demo-users/workouts/aviWorkouts.ts
// 🏋️ היסטוריית אימונים של אבי כהן

import type { DemoWorkoutData } from "./types";

/**
 * 💪 היסטוריית אימונים של אבי כהן
 * מתמחה באימוני Push/Pull/Legs עם משקלים כבדים
 */
export const aviWorkouts: DemoWorkoutData[] = [
  {
    id: "workout-avi-1",
    name: "Push Day - חזה וכתפיים",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 75,
    exercises: [],
    rating: 5,
    userId: "demo-user-avi",
    totalSets: 18,
    completedSets: 18,
    totalWeight: 3800,
    notes: "אימון מצוין! הרגשתי חזק היום",
  },
  {
    id: "workout-avi-2",
    name: "Pull Day - גב ויד קדמית",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 70,
    exercises: [],
    rating: 4,
    userId: "demo-user-avi",
    totalSets: 18,
    completedSets: 16,
    totalWeight: 4200,
    notes: "קשה במתח, אבל המשכתי",
  },
  {
    id: "workout-avi-3",
    name: "Leg Day - רגליים מלא",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 80,
    exercises: [],
    rating: 5,
    userId: "demo-user-avi",
    totalSets: 20,
    completedSets: 20,
    totalWeight: 4800,
    notes: "יום רגליים קשה אבל מספק!",
  },
  {
    id: "workout-avi-4",
    name: "Push Day - חזרה",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 65,
    exercises: [],
    rating: 4,
    userId: "demo-user-avi",
    totalSets: 18,
    completedSets: 16,
    totalWeight: 3600,
  },
];
