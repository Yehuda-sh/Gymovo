// src/types/plan.ts - גרסה סופית ונקייה

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
}

// 🏆 תוכנית אימון ראשית
export interface Plan {
  id: string;
  name: string;
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced" | string;
  targetMuscleGroups?: string[];
  durationWeeks?: number;

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
    estimatedDuration: workout.duration || 45,
    exercises: workout.exercises.map((ex) => ({
      id: ex.id,
      name: ex.name,
      muscleGroup: ex.exercise?.category || "כללי",
      sets: ex.sets.length,
      reps: ex.sets[0]?.reps || 12,
      weight: ex.sets[0]?.weight || 0,
      notes: ex.notes,
    })),
    targetMuscleGroups: workout.exercises
      .map((ex) => ex.exercise?.category)
      .filter(Boolean),
  }));

  return {
    ...modernPlan,
    days,
    rating: modernPlan.rating || 0,
    metadata: {
      ...modernPlan.metadata,
      tags: modernPlan.tags,
      generatedAt: modernPlan.createdAt,
    },
  };
};

// 🎯 פונקציות עזר לעבודה עם תוכניות

// קבלת אימונים מתוכנית (בכל פורמט)
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

// קבלת ימים מתוכנית (בכל פורמט)
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

// בדיקת תקינות תוכנית
export const validatePlan = (plan: Plan): boolean => {
  if (!plan.id || !plan.name) return false;

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

// חישוב משך כללי של התוכנית
export const getPlanDuration = (plan: Plan): number => {
  if (isModernPlan(plan)) {
    return plan.workouts.reduce(
      (total, workout) => total + (workout.duration || 45),
      0
    );
  }
  if (isLegacyPlan(plan)) {
    return plan.days.reduce(
      (total, day) => total + (day.estimatedDuration || 45),
      0
    );
  }
  return 0;
};

// ספירת תרגילים בתוכנית
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

// קבלת קבוצות שרירים בתוכנית
export const getPlanMuscleGroups = (plan: Plan): string[] => {
  const muscleGroups = new Set<string>();

  if (isLegacyPlan(plan)) {
    plan.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        if (exercise.muscleGroup) {
          muscleGroups.add(exercise.muscleGroup);
        }
      });
    });
  }

  if (isModernPlan(plan)) {
    plan.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (exercise.exercise?.category) {
          muscleGroups.add(exercise.exercise.category);
        }
      });
    });
  }

  return Array.from(muscleGroups);
};

// חישוב ממוצע דירוג התוכנית
export const getPlanAverageRating = (plan: Plan): number => {
  return plan.rating || 0;
};

// בדיקה אם התוכנית פעילה
export const isPlanActive = (plan: Plan): boolean => {
  return plan.isActive === true;
};
