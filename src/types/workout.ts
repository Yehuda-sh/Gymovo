// src/types/workout.ts - ✅ טיפוסים מלאים ומעודכנים לכל צרכי האפליקציה

import { Exercise } from "./exercise";

// 🏋️ סט בודד בתרגיל
export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  status: "pending" | "completed" | "skipped";
  notes?: string;
  restTime?: number; // בשניות
  actualReps?: number; // אם שונה מהמתוכנן
  actualWeight?: number; // אם שונה מהמתוכנן
  completedAt?: string;
  duration?: number; // למשך זמן (פלאנק, וכו') בשניות
  completed?: boolean; // legacy support
}

// 🎯 תרגיל באימון
export interface WorkoutExercise {
  id: string;
  name: string;
  exercise?: Exercise; // הפניה לתרגיל המקורי
  sets: WorkoutSet[];
  notes?: string;
  supersetWith?: string; // ID של תרגיל אחר
  restBetweenSets?: number; // בשניות
  muscleGroup?: string;
  category?: string;
  instructions?: string;
  targetMuscles?: string[];
  equipment?: string[];
  order?: number;
  previousBest?: {
    weight?: number;
    reps?: number;
    date?: string;
  };
}

// 📊 אימון מלא
export interface Workout {
  id: string;
  name: string;
  date?: string;
  planId?: string;
  planDayId?: string;
  templateId?: string;
  exercises: WorkoutExercise[];

  // זמנים
  startedAt?: string;
  completedAt?: string;
  pausedAt?: string;
  duration?: number; // בדקות
  estimatedDuration?: number;

  // נתונים נוספים
  notes?: string;
  rating?: number; // 1-5
  difficulty?: "beginner" | "intermediate" | "advanced";
  mood?: "amazing" | "good" | "ok" | "tired" | "bad";

  // סטטיסטיקות
  totalSets?: number;
  totalReps?: number;
  totalWeight?: number; // בק"ג
  targetMuscles?: string[];
  completedSets?: number;

  // מטא דאטה
  userId: string;
  isTemplate?: boolean;
  templateName?: string;
  location?: string;
  weather?: string;
  bodyWeight?: number;

  // שדות נוספים
  caloriesBurned?: number;
  calories?: number; // alias
  intensityLevel?: 1 | 2 | 3 | 4 | 5;
  workoutType?: "strength" | "cardio" | "flexibility" | "mixed";
  personalRecords?: PersonalRecord[];
  photos?: WorkoutPhoto[];

  // יעדים ותוצאות
  goals?: {
    targetDuration?: number;
    targetCalories?: number;
    targetSets?: number;
  };

  results?: {
    totalSets: number;
    completedSets: number;
    totalWeight?: number;
    averageRest?: number;
  };

  // timestamps
  createdAt?: string;
  updatedAt?: string;
}

// 🏆 שיא אישי
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: "weight" | "reps" | "volume" | "time";
  value: number;
  previousValue?: number;
  improvement?: number; // באחוזים
  achievedAt: string;
}

// 📷 תמונת אימון
export interface WorkoutPhoto {
  id: string;
  uri: string;
  thumbnailUri?: string;
  caption?: string;
  takenAt: string;
}

// 📊 סטטיסטיקות אימון
export interface WorkoutStats {
  totalWorkouts: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  totalDuration: number;
  averageDuration: number;
  totalWeight: number;
  averageRating: number;
  streakDays: number;
  favoriteExercises: { name: string; count: number }[];
  muscleGroupDistribution: { muscle: string; percentage: number }[];
}

// 🔍 פילטרים להיסטוריית אימונים
export interface WorkoutHistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  dateRange?: { start: string; end: string }; // alternative format
  rating?: number;
  minRating?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  minDuration?: number;
  maxDuration?: number;
  exerciseName?: string;
  muscles?: string[];
  targetMuscles?: string[];
  mood?: Workout["mood"];
  hasPhotos?: boolean;
  hasPersonalRecords?: boolean;
  planId?: string;
  location?: string;
}

// 🔄 אפשרויות מיון
export type WorkoutSortBy =
  | "date-desc"
  | "date-asc"
  | "rating-desc"
  | "rating-asc"
  | "duration-desc"
  | "duration-asc"
  | "volume-desc"
  | "volume-asc"
  | "reps-desc"
  | "reps-asc";

// 🎯 סוג סופרסט
export interface Superset {
  id: string;
  exercises: string[]; // IDs של התרגילים
  restBetweenRounds?: number;
}

// 📈 מגמת התקדמות
export interface ProgressTrend {
  exercise: string;
  trend: "improving" | "stable" | "declining";
  changePercentage: number;
  period: "week" | "month" | "quarter";
}

// 🏃 אימון פעיל
export interface ActiveWorkout extends Workout {
  currentExerciseIndex: number;
  currentSetIndex: number;
  restTimer?: {
    duration: number;
    startedAt: string;
    isPaused: boolean;
  };
  isPaused: boolean;
  autoRestEnabled: boolean;
  isResting: boolean;
  restTimeLeft: number;
  elapsedTime: number;
  setsCompleted: number;
  totalSetsPlanned: number;
  estimatedTimeLeft?: number;
}

// 🎯 תבנית אימון
export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, "sets">[];
  tags?: string[];
  difficulty?: Workout["difficulty"];
  estimatedDuration?: number;
  targetMuscles?: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating?: number;
  isPublic?: boolean;
  creatorId: string;
}

// 📈 התקדמות אימון
export interface WorkoutProgress {
  workoutId: string;
  exerciseId: string;
  date: string;
  personalRecord?: {
    type: "weight" | "reps" | "duration" | "volume";
    value: number;
    previousValue?: number;
    improvement?: number;
  };
}

// 🔧 Type Guards
export const isActiveWorkout = (
  workout: Workout | ActiveWorkout
): workout is ActiveWorkout => {
  return "startedAt" in workout && "currentExerciseIndex" in workout;
};

export const isWorkoutCompleted = (workout: Workout): boolean => {
  return !!workout.completedAt;
};

export const isCompletedWorkout = (workout: Workout): boolean => {
  return !!workout.completedAt;
};

// 🔧 Helper Functions
export const calculateWorkoutVolume = (workout: Workout): number => {
  return workout.exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((exerciseTotal, set) => {
        if (set.status === "completed" || set.completed) {
          const weight = set.actualWeight || set.weight || 0;
          const reps = set.actualReps || set.reps || 0;
          return exerciseTotal + weight * reps;
        }
        return exerciseTotal;
      }, 0)
    );
  }, 0);
};

export const getWorkoutDuration = (workout: Workout): number => {
  if (workout.duration) return workout.duration;
  if (workout.startedAt && workout.completedAt) {
    const start = new Date(workout.startedAt).getTime();
    const end = new Date(workout.completedAt).getTime();
    return Math.floor((end - start) / 1000 / 60); // דקות
  }
  return 0;
};

export const getCompletedSetsCount = (workout: Workout): number => {
  return workout.exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.filter((set) => set.status === "completed" || set.completed)
        .length
    );
  }, 0);
};

export const getTotalSetsCount = (workout: Workout): number => {
  return workout.exercises.reduce((total, exercise) => {
    return total + exercise.sets.length;
  }, 0);
};

export const getWorkoutProgress = (workout: Workout): number => {
  const total = getTotalSetsCount(workout);
  if (total === 0) return 0;
  const completed = getCompletedSetsCount(workout);
  return Math.round((completed / total) * 100);
};

export const getWorkoutCompletionPercentage = (workout: Workout): number => {
  return getWorkoutProgress(workout);
};

export const estimateWorkoutDuration = (workout: Workout): number => {
  if (workout.estimatedDuration) return workout.estimatedDuration;

  const totalSets = getTotalSetsCount(workout);
  const avgSetTime = 45; // שניות לסט
  const avgRestTime = 90; // שניות מנוחה

  return Math.round((totalSets * (avgSetTime + avgRestTime)) / 60); // בדקות
};

// טיפוסים נוספים
export type WorkoutStatus = "planned" | "active" | "completed" | "skipped";

export type WorkoutCategory =
  | "strength"
  | "cardio"
  | "flexibility"
  | "mobility"
  | "hiit"
  | "crosstraining"
  | "rehabilitation";
