// src/screens/workouts/start-workout/utils/validation.ts

import { Plan, PlanDay } from "../../../../types/plan";

export const validatePlan = (
  plan: Plan
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!plan.name || plan.name.trim().length === 0) {
    errors.push("שם התוכנית חסר");
  }

  if (!plan.days || plan.days.length === 0) {
    errors.push("התוכנית לא מכילה ימי אימון");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateDay = (
  day: PlanDay
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!day.name || day.name.trim().length === 0) {
    errors.push("שם היום חסר");
  }

  if (!day.exercises || day.exercises.length === 0) {
    errors.push("היום לא מכיל תרגילים");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const canStartWorkout = (
  plan: Plan | null,
  day: PlanDay | null
): boolean => {
  if (!plan || !day) return false;

  const planValidation = validatePlan(plan);
  const dayValidation = validateDay(day);

  return planValidation.isValid && dayValidation.isValid;
};
