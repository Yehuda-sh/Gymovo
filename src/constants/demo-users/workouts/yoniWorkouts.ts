// src/constants/demo-users/workouts/yoniWorkouts.ts
// 🏋️ היסטוריית אימונים של יוני רוזן

import type { DemoWorkoutData } from "./types";

/**
 * 🌱 היסטוריית אימונים של יוני רוזן
 * מתמחה באימונים בסיסיים למתחילים עם דגש על טכניקה
 */
export const yoniWorkouts: DemoWorkoutData[] = [
  {
    id: "workout-yoni-1",
    name: "בסיסי חלק עליון",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 30,
    exercises: [],
    rating: 4,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 8,
    totalWeight: 800,
    notes: "התחלה טובה! קצת קשה אבל מרגיש טוב",
  },
  {
    id: "workout-yoni-2",
    name: "בסיסי רגליים",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    duration: 25,
    exercises: [],
    rating: 3,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 7,
    totalWeight: 400,
    notes: "קשה עדיין, אבל משתפר",
  },
  {
    id: "workout-yoni-3",
    name: "גמישות ושיקום",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 20,
    exercises: [],
    rating: 5,
    userId: "demo-user-yoni",
    totalSets: 9,
    completedSets: 9,
    totalWeight: 0,
    notes: "אימון מתיחות נעים ומרגיע",
  },
];
