// src/stores/workout-store/index.ts
// 🏋️ מערכת ניהול אימונים מורפקטרת - נקודת כניסה מרכזית

// Export הראשי - ה-Store המורפקטר
export { useWorkoutStore } from "./workoutStore";

// Export types לשימוש חיצוני
export type {
  WorkoutState,
  CurrentWorkoutStats,
  ActiveWorkoutState,
  WorkoutHistoryState,
} from "./types";

// Export קבועים שימושיים
export {
  DEFAULT_REST_TIME,
  DEFAULT_SETS_PER_EXERCISE,
  DEFAULT_REPS_PER_SET,
  CALORIES_PER_SET,
  calculateVolume,
  formatDuration,
  calculateWorkoutProgress,
  isWorkoutCompleted,
} from "./constants";

// 📋 תיעוד מהיר לשימוש
/*
🎯 השימוש הבסיסי:

import { useWorkoutStore } from './stores/workout-store';

const MyComponent = () => {
  const { 
    activeWorkout, 
    startWorkout, 
    finishWorkout 
  } = useWorkoutStore();
  
  // כל הפעולות זמינות!
};

🏗️ מבנה המערכת:
├── types/        - ממשקים ו-types
├── constants/    - קבועים ופונקציות עזר
├── actions/      - פעולות אימון בסיסיות
├── navigation/   - ניווט בין תרגילים/סטים
├── rest/         - ניהול מנוחה וטיימרים
├── control/      - שליטה באימון (pause, finish, etc)
├── history/      - ניהול היסטוריית אימונים
├── stats/        - סטטיסטיקות ושיאים אישיים
└── workoutStore.ts - Store ראשי עם כל הפעולות

📊 תוצאות הרפקטורינג:
- 788 שורות → 8 מודולים תחת 200 שורות כל אחד
- תאימות לאחור מלאה
- ארגון ברור לפי אחריויות
- קלות תחזוקה ופיתוח
*/
