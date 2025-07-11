// src/constants/demo-users/workouts/yoniWorkouts.ts
// 🏋️ היסטוריית אימונים של יוני רוזן

import type { DemoWorkoutData } from "./types";

/**
 * 🌱 היסטוריית אימונים של יוני רוזן
 * אחרי השאלון: מעבר לתוכנית בניית שריר בחדר כושר
 */
export const yoniWorkouts: DemoWorkoutData[] = [
  {
    id: "workout-yoni-1",
    name: "יום עליון - Full Body",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    duration: 45,
    exercises: [],
    rating: 4,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 9,
    totalWeight: 1200,
    notes: "תוכנית חדשה! דחיפת חזה בחדר כושר מרגיש טוב",
  },
  {
    id: "workout-yoni-2",
    name: "יום תחתון - Full Body",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 40,
    exercises: [],
    rating: 4,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 8,
    totalWeight: 1600,
    notes: "סקוואט עם משקל - התקדמות מרשימה!",
  },
  {
    id: "workout-yoni-3",
    name: "גוף מלא - Full Body",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    duration: 50,
    exercises: [],
    rating: 5,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 10,
    totalWeight: 950,
    notes: "אימון מלא בחדר כושר! שכיבות סמיכה שלמות",
  },
  {
    id: "workout-yoni-4",
    name: "יום עליון - Full Body",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    duration: 35,
    exercises: [],
    rating: 4,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 8,
    totalWeight: 1100,
    notes: "משיכת לאט - מרגיש חזק יותר",
  },
  {
    id: "workout-yoni-5",
    name: "יום תחתון - Full Body",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    duration: 30,
    exercises: [],
    rating: 3,
    userId: "demo-user-yoni",
    totalSets: 10,
    completedSets: 7,
    totalWeight: 1400,
    notes: "דחיפת רגליים - עדיין מתרגל",
  },
  {
    id: "workout-yoni-6",
    name: "גוף מלא - Full Body",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    duration: 25,
    exercises: [],
    rating: 4,
    userId: "demo-user-yoni",
    totalSets: 8,
    completedSets: 8,
    totalWeight: 750,
    notes: "התחלה עם התוכנית החדשה - מרגיש טוב!",
  },
];
