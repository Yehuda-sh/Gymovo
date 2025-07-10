// src/data/storage/core/validation.ts
// 🛡️ ולידציה מתקדמת לנתוני אחסון

import { Plan } from "../../../types/plan";
import { Workout } from "../../../types/workout";

/**
 * 🛡️ ולידציה מלאה של תוכנית אימון
 * בודק את כל השדות הנדרשים והיגיון העסקי
 */
export function validatePlan(plan: any): plan is Plan {
  if (!plan || typeof plan !== "object") {
    return false;
  }

  // שדות בסיסיים חובה
  if (
    !plan.id ||
    typeof plan.id !== "string" ||
    !plan.name ||
    typeof plan.name !== "string" ||
    typeof plan.description !== "string"
  ) {
    return false;
  }

  // בדיקת מבנה ימים/אימונים
  const hasDays = Array.isArray(plan.days);
  const hasWorkouts = Array.isArray(plan.workouts);

  if (!hasDays && !hasWorkouts) {
    return false;
  }

  // ולידציה מתקדמת לימים (אם קיימים)
  if (hasDays) {
    for (const day of plan.days) {
      if (!isValidPlanDay(day)) {
        return false;
      }
    }
  }

  // ולידציה מתקדמת לאימונים (אם קיימים)
  if (hasWorkouts) {
    for (const workout of plan.workouts) {
      if (!validateWorkout(workout)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * 🏋️ ולידציה מלאה של אימון
 * בודק מבנה האימון והתרגילים
 */
export function validateWorkout(workout: any): workout is Workout {
  if (!workout || typeof workout !== "object") {
    return false;
  }

  // שדות בסיסיים חובה
  if (
    !workout.id ||
    typeof workout.id !== "string" ||
    !workout.name ||
    typeof workout.name !== "string"
  ) {
    return false;
  }

  // בדיקת מערך תרגילים
  if (!Array.isArray(workout.exercises)) {
    return false;
  }

  // ולידציה לכל תרגיל
  for (const exercise of workout.exercises) {
    if (!isValidWorkoutExercise(exercise)) {
      return false;
    }
  }

  // בדיקת שדות תאריך (אם קיימים)
  if (workout.date && !isValidDate(workout.date)) {
    return false;
  }

  if (workout.startedAt && !isValidISOString(workout.startedAt)) {
    return false;
  }

  if (workout.completedAt && !isValidISOString(workout.completedAt)) {
    return false;
  }

  return true;
}

/**
 * 📅 ולידציה של יום בתוכנית
 */
function isValidPlanDay(day: any): boolean {
  if (!day || typeof day !== "object") {
    return false;
  }

  if (!day.id || typeof day.id !== "string") {
    return false;
  }

  if (!day.name || typeof day.name !== "string") {
    return false;
  }

  // בדיקת אימונים ביום
  if (day.workouts && !Array.isArray(day.workouts)) {
    return false;
  }

  return true;
}

/**
 * 💪 ולידציה של תרגיל באימון
 */
function isValidWorkoutExercise(exercise: any): boolean {
  if (!exercise || typeof exercise !== "object") {
    return false;
  }

  if (
    !exercise.id ||
    typeof exercise.id !== "string" ||
    !exercise.name ||
    typeof exercise.name !== "string"
  ) {
    return false;
  }

  // בדיקת מערך סטים
  if (!Array.isArray(exercise.sets)) {
    return false;
  }

  // ולידציה לכל סט
  for (const set of exercise.sets) {
    if (!isValidSet(set)) {
      return false;
    }
  }

  return true;
}

/**
 * 🎯 ולידציה של סט תרגיל
 */
function isValidSet(set: any): boolean {
  if (!set || typeof set !== "object") {
    return false;
  }

  if (!set.id || typeof set.id !== "string") {
    return false;
  }

  // בדיקת ערכים מספריים (אם קיימים)
  if (
    set.weight !== undefined &&
    (typeof set.weight !== "number" || set.weight < 0)
  ) {
    return false;
  }

  if (
    set.reps !== undefined &&
    (typeof set.reps !== "number" || set.reps < 0)
  ) {
    return false;
  }

  if (
    set.duration !== undefined &&
    (typeof set.duration !== "number" || set.duration < 0)
  ) {
    return false;
  }

  return true;
}

/**
 * 📅 בדיקה אם תאריך תקף
 */
function isValidDate(date: any): boolean {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  if (typeof date === "string") {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }

  return false;
}

/**
 * 🕰️ בדיקה אם מחרוזת ISO תקפה
 */
function isValidISOString(dateString: string): boolean {
  if (typeof dateString !== "string") {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes("T");
}

/**
 * 📊 ולידציה של נתוני סטטיסטיקות
 */
export function validateStatsData(data: any): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }

  // בדיקת שדות נומריים בסיסיים
  const numericFields = [
    "totalWorkouts",
    "totalVolume",
    "totalDuration",
    "averageRating",
  ];

  for (const field of numericFields) {
    if (data[field] !== undefined && typeof data[field] !== "number") {
      return false;
    }
  }

  return true;
}

/**
 * 🔍 פונקציה מטילית לולידציה של מערך
 */
export function validateArray<T>(
  items: any[],
  validator: (item: any) => item is T
): items is T[] {
  if (!Array.isArray(items)) {
    return false;
  }

  return items.every(validator);
}

/**
 * 🧹 ניקוי וולידציה של נתונים
 * מסיר פריטים לא תקפים ומחזיר מערך נקי
 */
export function cleanAndValidate<T>(
  items: any[],
  validator: (item: any) => item is T,
  logInvalid: boolean = __DEV__
): T[] {
  if (!Array.isArray(items)) {
    return [];
  }

  const validItems: T[] = [];
  let invalidCount = 0;

  for (const item of items) {
    if (validator(item)) {
      validItems.push(item);
    } else {
      invalidCount++;
      if (logInvalid) {
        console.warn("⚠️ Invalid item removed:", item);
      }
    }
  }

  if (invalidCount > 0 && __DEV__) {
    console.log(
      `🧹 Cleaned ${invalidCount} invalid items from ${items.length} total`
    );
  }

  return validItems;
}
