// src/types/plan.ts - מעודכן עם כל התיקונים

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
  rating?: number; // ✅ FIXED: הוספת שדה rating (1-5 כוכבים)

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
          rest: setIndex < ex.sets - 1 ? 60 : 0, // זמן מנוחה בשניות
        })),
      category: ex.muscleGroup, // ✅ Fixed: category במקום muscleGroup
      instructions: ex.notes, // ✅ Fixed: instructions במקום notes
      targetMuscles: [ex.muscleGroup], // ✅ Added: targetMuscles array
    })),
    date: new Date().toISOString(),
    duration: 0,
    estimatedDuration: 45 + index * 5, // הערכה בסיסית
    difficulty: legacyPlan.metadata?.difficulty || "beginner",
    targetMuscles: day.exercises.map((ex) => ex.muscleGroup),
  }));

  return {
    ...legacyPlan,
    workouts,
    rating: legacyPlan.rating || 0, // ✅ שמירה על rating קיים
    createdAt: legacyPlan.metadata?.generatedAt || new Date().toISOString(),
    isActive: true,
    tags: legacyPlan.metadata?.tags || [],
    weeklyGoal: legacyPlan.days?.length || 3,
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
      muscleGroup: ex.category || "כללי", // ✅ Fixed: category -> muscleGroup
      sets: ex.sets.length,
      reps: ex.sets[0]?.reps || 0,
      weight: ex.sets[0]?.weight || 0,
      notes: ex.instructions, // ✅ Fixed: instructions -> notes
    })),
  }));

  return {
    ...modernPlan,
    days,
    rating: modernPlan.rating || 0, // ✅ שמירה על rating
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

// 🔧 Helper function לבדיקת תקינות Plan
export const validatePlan = (plan: Plan): boolean => {
  if (!plan.id || !plan.name || !plan.description) return false;

  if (plan.days) {
    return plan.days.every(
      (day) => day.id && day.name && Array.isArray(day.exercises)
    );
  }

  if (plan.workouts) {
    return plan.workouts.every(
      (workout) =>
        workout.id && workout.name && Array.isArray(workout.exercises)
    );
  }

  return false;
};

// 🎯 Helper functions נוספים
export const getPlanDuration = (plan: Plan): number => {
  if (isModernPlan(plan)) {
    return plan.workouts.reduce(
      (total, workout) => total + (workout.estimatedDuration || 45),
      0
    );
  }

  if (isLegacyPlan(plan)) {
    return plan.days.length * 45; // הערכה של 45 דקות לאימון
  }

  return 0;
};

export const getPlanExerciseCount = (plan: Plan): number => {
  if (isLegacyPlan(plan)) {
    return plan.days.reduce((total, day) => total + day.exercises.length, 0);
  }

  if (isModernPlan(plan)) {
    return plan.workouts.reduce(
      (total, workout) => total + workout.exercises.length,
      0
    );
  }

  return 0;
};

export const getPlanMuscleGroups = (plan: Plan): string[] => {
  const muscleGroups = new Set<string>();

  if (isLegacyPlan(plan)) {
    plan.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        muscleGroups.add(exercise.muscleGroup);
      });
    });
  }

  if (isModernPlan(plan)) {
    plan.workouts.forEach((workout) => {
      workout.targetMuscles?.forEach((muscle) => {
        muscleGroups.add(muscle);
      });
    });
  }

  return Array.from(muscleGroups);
};
