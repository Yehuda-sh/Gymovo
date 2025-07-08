// src/types/plan.ts - ✅ טיפוסים מלאים ומעודכנים לתוכניות אימון

import { Workout } from "./workout";

// 🏋️ תרגיל בתוכנית
export interface PlanExercise {
  id: string;
  name: string;
  muscleGroup?: string;
  targetMuscles?: string[];
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number; // בשניות
  notes?: string;
  instructions?: string[];
  equipment?: string[];
  imageUrl?: string;
  videoUrl?: string;
  order?: number;
  supersetWith?: string; // ID של תרגיל אחר
}

// 📅 יום אימון בתוכנית
export interface PlanDay {
  id: string;
  name: string;
  description?: string;
  exercises: PlanExercise[];
  estimatedDuration?: number; // בדקות
  targetMuscleGroups?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  order?: number;
  notes?: string;
  tags?: string[];
}

// 📊 מטא-דטא של תוכנית
export interface PlanMetadata {
  generatedAt?: string;
  generatedBy?: string; // "AI", "Coach", "User"
  version?: string;
  lastModified?: string;

  // פרטי יצירה
  goal?:
    | "strength"
    | "hypertrophy"
    | "weight_loss"
    | "endurance"
    | "general_fitness";
  experience?: "beginner" | "intermediate" | "advanced";
  equipment?: string[];
  injuries?: string[];
  preferences?: {
    timePerSession?: number;
    preferredExercises?: string[];
    avoidExercises?: string[];
  };

  // סטטיסטיקות
  stats?: {
    totalExercises?: number;
    totalSets?: number;
    estimatedCalories?: number;
    volumePerWeek?: number;
  };
}

// 🏆 תוכנית אימון ראשית
export interface Plan {
  // 🆔 זיהוי
  id: string;
  name: string;
  description?: string;

  // 👤 בעלות ויצירה
  userId: string;
  creator?: string; // "Gymovo AI", "wger.de", "Coach Name", שם המשתמש
  creatorType?: "ai" | "coach" | "user" | "imported";

  // 📊 פרטי תוכנית
  difficulty?: "beginner" | "intermediate" | "advanced";
  targetMuscleGroups?: string[];
  mainGoal?:
    | "strength"
    | "hypertrophy"
    | "weight_loss"
    | "endurance"
    | "general_fitness";
  durationWeeks?: number;

  // 🔄 תמיכה בשני פורמטים:
  days?: PlanDay[]; // פורמט מובנה (מומלץ)
  workouts?: Workout[]; // פורמט גמיש (לתוכניות מיובאות)

  // 📅 תזמון
  weeklySchedule?: {
    [key: string]: string; // { "monday": "push", "wednesday": "pull", ... }
  };
  weeklyGoal?: number; // כמה אימונים בשבוע
  restDays?: string[]; // ["tuesday", "thursday", "sunday"]

  // ⏰ חותמות זמן
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;

  // 📈 סטטוס ודירוג
  isActive?: boolean;
  isPublic?: boolean;
  isTemplate?: boolean;
  isPremium?: boolean;
  rating?: number; // 1-5
  reviewsCount?: number;
  usageCount?: number;
  completionRate?: number; // אחוז השלמה ממוצע

  // 🏷️ תיוג וקטגוריות
  tags?: string[];
  category?: string; // "powerlifting", "bodybuilding", "calisthenics", etc.
  equipment?: string[]; // ציוד נדרש
  location?: "gym" | "home" | "outdoor" | "hybrid";

  // 📊 מטא-דטא
  metadata?: PlanMetadata;

  // 🎯 התקדמות ומעקב
  progressionScheme?: {
    type: "linear" | "undulating" | "block" | "auto";
    increaseWeight?: number; // אחוז או ק"ג
    increaseReps?: number;
    deloadWeek?: number; // כל כמה שבועות
  };

  // 🏃 פרטים נוספים
  warmupRoutine?: PlanExercise[];
  cooldownRoutine?: PlanExercise[];
  cardioRequirements?: {
    sessionsPerWeek?: number;
    minutesPerSession?: number;
    type?: string[];
  };

  // 📱 הגדרות תצוגה
  color?: string; // צבע מותאם לכרטיס
  icon?: string; // אייקון מותאם
  imageUrl?: string; // תמונת רקע
}

// 🎯 תבנית תוכנית (לשימוש חוזר)
export interface PlanTemplate
  extends Omit<Plan, "userId" | "createdAt" | "updatedAt"> {
  templateId: string;
  originalPlanId?: string;
  author: string;
  authorId?: string;
  isOfficial?: boolean;
  price?: number;
  purchases?: number;
  supportedLanguages?: string[];
}

// 📊 סטטיסטיקות תוכנית
export interface PlanStats {
  planId: string;
  totalWorkouts: number;
  completedWorkouts: number;
  skippedWorkouts: number;
  averageDuration: number;
  averageRating: number;
  totalVolume: number;
  personalRecords: number;
  muscleGroupDistribution: {
    muscle: string;
    percentage: number;
  }[];
  weeklyAdherence: number; // אחוז עמידה בתוכנית
  currentStreak: number;
  longestStreak: number;
}

// 📈 התקדמות בתוכנית
export interface PlanProgress {
  planId: string;
  userId: string;
  startedAt: string;
  currentWeek: number;
  currentDay: number;
  completedDays: string[]; // IDs של ימים שהושלמו
  skippedDays: string[]; // IDs של ימים שדולגו
  modifications: {
    date: string;
    type: "exercise_swap" | "weight_adjust" | "reps_adjust" | "day_skip";
    details: any;
  }[];
  nextWorkout?: {
    dayId: string;
    scheduledFor?: string;
  };
  isCompleted: boolean;
  completedAt?: string;
  results?: {
    strengthGain?: number; // אחוז
    muscleGain?: number; // ק"ג
    weightLoss?: number; // ק"ג
    enduranceImprovement?: number; // אחוז
  };
}

// 🔧 Type Guards
export const isPlanDay = (item: PlanDay | Workout): item is PlanDay => {
  return "exercises" in item && !("date" in item);
};

export const hasPlanDays = (plan: Plan): plan is Plan & { days: PlanDay[] } => {
  return Array.isArray(plan.days) && plan.days.length > 0;
};

export const hasPlanWorkouts = (
  plan: Plan
): plan is Plan & { workouts: Workout[] } => {
  return Array.isArray(plan.workouts) && plan.workouts.length > 0;
};

// 🔧 Helper Functions
export const calculatePlanDuration = (plan: Plan): number => {
  if (plan.durationWeeks) return plan.durationWeeks;

  if (hasPlanDays(plan)) {
    return Math.ceil(plan.days.length / (plan.weeklyGoal || 3));
  }

  return 4; // ברירת מחדל
};

export const getPlanExerciseCount = (plan: Plan): number => {
  if (hasPlanDays(plan)) {
    return plan.days.reduce((total, day) => total + day.exercises.length, 0);
  }

  if (hasPlanWorkouts(plan)) {
    return plan.workouts.reduce(
      (total, workout) => total + workout.exercises.length,
      0
    );
  }

  return 0;
};

export const getPlanTotalSets = (plan: Plan): number => {
  if (hasPlanDays(plan)) {
    return plan.days.reduce(
      (total, day) =>
        total + day.exercises.reduce((dayTotal, ex) => dayTotal + ex.sets, 0),
      0
    );
  }

  return 0;
};

export const getPlanMuscleGroups = (plan: Plan): string[] => {
  const muscles = new Set<string>();

  if (plan.targetMuscleGroups) {
    plan.targetMuscleGroups.forEach((m) => muscles.add(m));
  }

  if (hasPlanDays(plan)) {
    plan.days.forEach((day) => {
      day.exercises.forEach((ex) => {
        if (ex.muscleGroup) muscles.add(ex.muscleGroup);
        ex.targetMuscles?.forEach((m) => muscles.add(m));
      });
    });
  }

  return Array.from(muscles);
};

export const estimatePlanCalories = (plan: Plan): number => {
  const totalSets = getPlanTotalSets(plan);
  const avgCaloriesPerSet = 5; // הערכה בסיסית
  const weeksCount = plan.durationWeeks || 4;

  return (totalSets * avgCaloriesPerSet * weeksCount) / (plan.weeklyGoal || 3);
};

// 🏷️ קטגוריות תוכניות
export const PLAN_CATEGORIES = {
  POWERLIFTING: "powerlifting",
  BODYBUILDING: "bodybuilding",
  CROSSFIT: "crossfit",
  CALISTHENICS: "calisthenics",
  OLYMPIC: "olympic",
  GENERAL: "general",
  REHABILITATION: "rehabilitation",
  SPORT_SPECIFIC: "sport_specific",
} as const;

export type PlanCategory =
  (typeof PLAN_CATEGORIES)[keyof typeof PLAN_CATEGORIES];

// 🎯 יעדי תוכנית
export const PLAN_GOALS = {
  STRENGTH: "strength",
  HYPERTROPHY: "hypertrophy",
  WEIGHT_LOSS: "weight_loss",
  ENDURANCE: "endurance",
  GENERAL_FITNESS: "general_fitness",
  SPORT_PERFORMANCE: "sport_performance",
  REHABILITATION: "rehabilitation",
} as const;

export type PlanGoal = (typeof PLAN_GOALS)[keyof typeof PLAN_GOALS];
