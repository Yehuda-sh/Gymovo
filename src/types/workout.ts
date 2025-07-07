// src/types/workout.ts - גרסה מעודכנת לשלב 1 עם תמיכה מלאה

import { Exercise } from "./exercise";

// 🎯 ממשק של סט בודד באימון
export interface WorkoutSet {
  id?: string; // ייחודי לכל סט
  weight?: number; // משקל בק"ג
  reps?: number; // חזרות
  duration?: number; // למשך זמן (פלאנק, וכו') בשניות
  rest?: number; // זמן מנוחה בשניות
  status?: "pending" | "completed" | "skipped"; // 🆕 הוספת "skipped"
  completed?: boolean; // סטטוס השלמה (legacy support)
  completedAt?: string; // זמן השלמה ISO
  notes?: string; // 🆕 הערות לסט ספציפי
}

// 🏋️ ממשק של תרגיל באימון
export interface WorkoutExercise {
  id: string;
  name: string; // שם התרגיל
  exercise?: Exercise; // 🔗 קישור לתרגיל הבסיסי
  sets: WorkoutSet[];
  category?: string; // קטגוריה
  instructions?: string; // הוראות ספציפיות לאימון הזה

  // 🆕 שדות נוספים לשלב 1
  targetMuscles?: string[]; // שרירי היעד
  equipment?: string[]; // ציוד נדרש
  restBetweenSets?: number; // זמן מנוחה בין סטים (ברירת מחדל)
  supersetWith?: string; // ID של תרגיל לסופרסט
  order?: number; // סדר בתוכנית

  // 📊 מעקב התקדמות
  previousBest?: {
    weight?: number;
    reps?: number;
    date?: string;
  };
}

// 🏃‍♂️ ממשק האימון המלא
export interface Workout {
  id: string;
  name: string;
  date?: string; // ISO string
  exercises: WorkoutExercise[];
  notes?: string;
  rating?: number; // 1-5 כוכבים

  // 🆕 שדות חדשים לשלב 1
  completedAt?: string; // זמן סיום ISO
  duration?: number; // משך האימון בדקות (בפועל)
  estimatedDuration?: number; // משך משוער בדקות
  difficulty?: "beginner" | "intermediate" | "advanced";
  targetMuscles?: string[]; // שרירי היעד הכלליים

  // 📈 מידע על האימון
  calories?: number; // קלוריות שנשרפו (אופציונלי)
  intensityLevel?: 1 | 2 | 3 | 4 | 5; // רמת עוצמה
  workoutType?: "strength" | "cardio" | "flexibility" | "mixed";

  // 🔗 קישורים
  planId?: string; // מאיזו תוכנית זה בא
  templateId?: string; // אם נוצר מתבנית

  // 📱 מטאדטה
  createdAt?: string;
  updatedAt?: string;
  isTemplate?: boolean; // האם זה תבנית לשמירה

  // 🎯 מטרות ותוצאות
  goals?: {
    targetDuration?: number;
    targetCalories?: number;
    targetSets?: number;
  };

  results?: {
    totalSets: number;
    completedSets: number;
    totalWeight?: number; // סה"כ משקל שהורם
    averageRest?: number; // זמן מנוחה ממוצע
  };
}

// 🏋️‍♀️ ממשק לאימון פעיל (בזמן ביצוע)
export interface ActiveWorkout extends Workout {
  startedAt: string; // זמן התחלה
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimeLeft: number; // שניות נותרות למנוחה
  elapsedTime: number; // זמן שעבר בשניות

  // 📊 סטטיסטיקות בזמן אמת
  setsCompleted: number;
  totalSetsPlanned: number;
  estimatedTimeLeft?: number;
}

// 🎯 טיפוסים עזר
export type WorkoutStatus = "planned" | "active" | "completed" | "skipped";

export type WorkoutCategory =
  | "strength"
  | "cardio"
  | "flexibility"
  | "mobility"
  | "hiit"
  | "crosstraining"
  | "rehabilitation";

// 📈 ממשק למעקב התקדמות
export interface WorkoutProgress {
  workoutId: string;
  exerciseId: string;
  date: string;
  personalRecord?: {
    type: "weight" | "reps" | "duration" | "volume";
    value: number;
    previousValue?: number;
    improvement?: number; // באחוזים
  };
}

// 🔧 Type Guards
export const isActiveWorkout = (
  workout: Workout | ActiveWorkout
): workout is ActiveWorkout => {
  return "startedAt" in workout && "currentExerciseIndex" in workout;
};

export const isCompletedWorkout = (workout: Workout): boolean => {
  return !!workout.completedAt;
};

// 📊 פונקציות עזר
export const calculateWorkoutVolume = (workout: Workout): number => {
  return workout.exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((exerciseTotal, set) => {
        if (set.completed && set.weight && set.reps) {
          return exerciseTotal + set.weight * set.reps;
        }
        return exerciseTotal;
      }, 0)
    );
  }, 0);
};

export const getWorkoutCompletionPercentage = (workout: Workout): number => {
  const totalSets = workout.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0
  );
  const completedSets = workout.exercises.reduce(
    (total, ex) =>
      total +
      ex.sets.filter((set) => set.completed || set.status === "completed")
        .length,
    0
  );

  return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
};

export const estimateWorkoutDuration = (workout: Workout): number => {
  // אלגוריתם פשוט לחישוב זמן משוער
  const totalSets = workout.exercises.reduce(
    (total, ex) => total + ex.sets.length,
    0
  );
  const avgSetTime = 45; // שניות לסט
  const avgRestTime = 90; // שניות מנוחה

  return Math.round((totalSets * (avgSetTime + avgRestTime)) / 60); // בדקות
};
