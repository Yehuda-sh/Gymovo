// src/types/plan.ts - גרסה מתוקנת עם שדה creator

import { Workout, WorkoutExercise } from "./workout";

// 🏋️ תרגיל בתוכנית
export interface PlanExercise {
  id: string;
  name: string;
  muscleGroup?: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

// 📅 יום אימון בתוכנית
export interface PlanDay {
  id: string;
  name: string;
  exercises: PlanExercise[];
  estimatedDuration?: number;
  targetMuscleGroups?: string[];
  difficulty?: string;
}

// 📊 מטא-דטא של תוכנית
export interface PlanMetadata {
  generatedAt?: string;
  difficulty?: string;
  tags?: string[];
  version?: string;
  goal?: string;
  experience?: string;
  equipment?: string[];
  injuries?: string[];
}

// 🏆 תוכנית אימון ראשית
export interface Plan {
  id: string;
  name: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced" | string;
  targetMuscleGroups?: string[];
  durationWeeks?: number;

  // 👤 מי יצר את התוכנית
  creator?: string; // "Gymovo AI", "wger.de", שם המשתמש, וכו'

  // 🔄 תמיכה בשני פורמטים:
  days?: PlanDay[]; // פורמט legacy (הקיים)
  workouts?: Workout[]; // פורמט חדש (אופציונלי)

  // 📊 נתונים בסיסיים
  createdAt: string;
  updatedAt: string;
  userId: string;
  isActive?: boolean;

  // 🎯 שדות נוספים
  tags?: string[];
  weeklyGoal?: number; // כמה אימונים בשבוע
  rating?: number; // דירוג 1-5

  // 📊 מטא-דטא
  metadata?: PlanMetadata;
}

// 🔧 Type Guards לבדיקת מבנה התוכנית
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

// 🔄 המרה מפורמט ישן לחדש
export const convertLegacyToModern = (legacyPlan: Plan): Plan => {
  if (!legacyPlan.days) return legacyPlan;

  const workouts: Workout[] = legacyPlan.days.map((day, index) => ({
    id: day.id,
    name: day.name,
    date: new Date().toISOString(),
    exercises: day.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      exercise: {
        id: ex.id,
        name: ex.name,
        category: ex.muscleGroup || "כללי",
      },
      sets: Array(ex.sets)
        .fill(null)
        .map((_, setIndex) => ({
          id: `${ex.id}_set_${setIndex}`,
          reps: ex.reps,
          weight: ex.weight || 0,
          status: "pending" as const,
        })),
      notes: ex.notes,
    })),
    duration: day.estimatedDuration || 45,
  }));

  return {
    ...legacyPlan,
    workouts,
    rating: legacyPlan.rating || 0,
    createdAt: legacyPlan.metadata?.generatedAt || new Date().toISOString(),
    isActive: true,
    tags: legacyPlan.metadata?.tags || [],
    weeklyGoal: legacyPlan.days?.length || 3,
  };
};

// 🔄 המרה מפורמט חדש לישן
export const convertModernToLegacy = (modernPlan: Plan): Plan => {
  if (!modernPlan.workouts) return modernPlan;

  const days: PlanDay[] = modernPlan.workouts.map((workout) => ({
    id: workout.id,
    name: workout.name,
    exercises: workout.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.exercise?.category || "כללי",
      sets: ex.sets?.length || 3,
      reps: ex.sets?.[0]?.reps || 10,
      weight: ex.sets?.[0]?.weight || 0,
    })),
    estimatedDuration: workout.duration || 45,
    targetMuscleGroups: workout.exercises
      .map((ex) => ex.exercise?.category)
      .filter(Boolean) as string[],
  }));

  return {
    ...modernPlan,
    days,
  };
};
