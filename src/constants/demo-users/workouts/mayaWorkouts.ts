// src/constants/demo-users/workouts/mayaWorkouts.ts
// 🏋️ היסטוריית אימונים של מאיה לוי

import type { DemoWorkoutData } from "./types";

/**
 * 🏃‍♀️ היסטוריית אימונים של מאיה לוי
 * מתמחה באימוני HIIT ואינטרוול לחיטוב וסיבולת
 */
export const mayaWorkouts: DemoWorkoutData[] = [
  {
    id: "workout-maya-1",
    name: "HIIT חלק עליון",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 45,
    exercises: [],
    rating: 5,
    userId: "demo-user-maya",
    totalSets: 16,
    completedSets: 16,
    totalWeight: 1600,
    notes: "אימון אינטנסיבי ומצוין! הרגשתי בכושר",
  },
  {
    id: "workout-maya-2",
    name: "כוח רגליים",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 50,
    exercises: [],
    rating: 4,
    userId: "demo-user-maya",
    totalSets: 17,
    completedSets: 17,
    totalWeight: 2200,
    notes: "הרגליים עבדו קשה היום",
  },
  {
    id: "workout-maya-3",
    name: "מעגל כל הגוף",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    duration: 40,
    exercises: [],
    rating: 5,
    userId: "demo-user-maya",
    totalSets: 13,
    completedSets: 13,
    totalWeight: 1400,
    notes: "מעגל מהיר ויעיל!",
  },
  {
    id: "workout-maya-4",
    name: "HIIT חלק עליון",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    duration: 45,
    exercises: [],
    rating: 4,
    userId: "demo-user-maya",
    totalSets: 16,
    completedSets: 15,
    totalWeight: 1500,
  },
];
