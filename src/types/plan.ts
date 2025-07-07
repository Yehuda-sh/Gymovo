// src/types/plan.ts - מעודכן לתמיכה במבנה קיים וחדש

// 🔄 Import מחלקת הWorkout מהקובץ המתאים
import { Workout } from "./workout";

// ✅ שמירה על המבנה הקיים - PlanExercise & PlanDay
export interface PlanExercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface PlanDay {
  id: string;
  name: string;
  exercises: PlanExercise[];
}

// 📊 Metadata למידע נוסף על התוכנית
export interface PlanMetadata {
  goal?: string;
  experience?: "beginner" | "intermediate" | "advanced";
  equipment?: string[];
  injuries?: string[];
  generatedAt?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedDuration?: number; // בדקות
  tags?: string[];
}

// 🏋️ ממשק Plan מעודכן - תומך במבנה קיים וחדש
export interface Plan {
  id: string;
  name: string;
  description: string;
  creator?: string;
  createdAt?: string;
  isActive?: boolean;
  userId?: string;

  // 🔄 תמיכה במבנה הקיים (days)
  days?: PlanDay[];

  // 🆕 תמיכה במבנה חדש (workouts) - אופציונלי לכרגע
  workouts?: Workout[];

  // 🆕 שדות חדשים לשלב 1
  tags?: string[];
  weeklyGoal?: number; // כמה אימונים בשבוע

  // 📊 Metadata
  metadata?: PlanMetadata;
}

// 🔧 Type Guards לבדיקת איזה מבנה משתמש ב-Plan
export const isLegacyPlan = (
  plan: Plan
): plan is Plan & { days: PlanDay[] } => {
  return Array.isArray(plan.days) && plan.days.length > 0;
};

export const isModernPlan = (
  plan: Plan
): plan is Plan & { workouts: Workout[] } => {
  return Array.isArray(plan.workouts) && plan.workouts.length > 0;
};

// 🔄 פונקציות המרה בין מבנים
export const convertLegacyToModern = (legacyPlan: Plan): Plan => {
  if (!legacyPlan.days) return legacyPlan;

  const workouts: Workout[] = legacyPlan.days.map((day, index) => ({
    id: day.id,
    name: day.name,
    exercises: day.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      sets: Array(ex.sets)
        .fill(null)
        .map((_, setIndex) => ({
          id: `${ex.id}_set_${setIndex}`,
          reps: ex.reps,
          weight: ex.weight || 0,
          status: "pending" as const,
          rest: setIndex < ex.sets - 1 ? 60 : 90, // זמן מנוחה
        })),
      category: ex.muscleGroup,
      instructions: ex.notes || `בצע ${ex.reps} חזרות עם ${ex.weight || 0} ק"ג`,
    })),
    estimatedDuration: 45 + index * 5, // הערכה בסיסית
    difficulty: legacyPlan.metadata?.difficulty || "beginner",
    targetMuscles: day.exercises.map((ex) => ex.muscleGroup),
  }));

  return {
    ...legacyPlan,
    workouts,
    createdAt: legacyPlan.metadata?.generatedAt || new Date().toISOString(),
    isActive: true,
    tags: legacyPlan.metadata?.tags || [],
    weeklyGoal: legacyPlan.days.length,
  };
};

export const convertModernToLegacy = (modernPlan: Plan): Plan => {
  if (!modernPlan.workouts) return modernPlan;

  const days: PlanDay[] = modernPlan.workouts.map((workout) => ({
    id: workout.id,
    name: workout.name,
    exercises: workout.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.category || "כללי",
      sets: ex.sets.length,
      reps: ex.sets[0]?.reps || 10,
      weight: ex.sets[0]?.weight || 0,
      notes: ex.instructions,
    })),
  }));

  return {
    ...modernPlan,
    days,
    metadata: {
      ...modernPlan.metadata,
      tags: modernPlan.tags,
      generatedAt: modernPlan.createdAt,
      difficulty: modernPlan.workouts[0]?.difficulty,
    },
  };
};

// 🎯 פונקציית עזר לקבלת תוכניות בפורמט אחיד
export const getPlanWorkouts = (plan: Plan): Workout[] => {
  if (isModernPlan(plan)) {
    return plan.workouts;
  }

  if (isLegacyPlan(plan)) {
    const converted = convertLegacyToModern(plan);
    return converted.workouts || [];
  }

  return [];
};

export const getPlanDays = (plan: Plan): PlanDay[] => {
  if (isLegacyPlan(plan)) {
    return plan.days;
  }

  if (isModernPlan(plan)) {
    const converted = convertModernToLegacy(plan);
    return converted.days || [];
  }

  return [];
};
