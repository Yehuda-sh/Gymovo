// src/data/storage/plans/index.ts
// 📋 ניהול תוכניות אימון - פעולות CRUD מלאות

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plan } from "../../../types/plan";
import {
  withRetry,
  StorageError,
  StorageKeys,
  validatePlan,
  compressData,
} from "../core";

/**
 * 📋 טוען את כל התוכניות של משתמש ספציפי
 * כולל ולידציה וניקוי נתונים פגומים
 */
export async function getPlansByUserId(userId: string): Promise<Plan[]> {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "getPlansByUserId");
  }

  return withRetry(
    async () => {
      const key = StorageKeys.plans(userId);
      const plansJson = await AsyncStorage.getItem(key);

      if (!plansJson) {
        if (__DEV__) console.log(`📋 No plans found for user: ${userId}`);
        return [];
      }

      let plans: any[];
      try {
        plans = JSON.parse(plansJson);
      } catch (parseError) {
        console.error(
          "❌ Failed to parse plans data, corrupted storage:",
          parseError
        );
        // נתונים פגומים - מחק ותחזיר מערך ריק
        await AsyncStorage.removeItem(key);
        return [];
      }

      if (!Array.isArray(plans)) {
        console.warn("⚠️ Plans data is not an array, resetting...");
        await AsyncStorage.removeItem(key);
        return [];
      }

      // ולידציה וניקוי נתונים פגומים
      const validPlans = plans.filter((plan, index) => {
        const isValid = validatePlan(plan);
        if (!isValid && __DEV__) {
          console.warn(`⚠️ Invalid plan at index ${index}:`, plan);
        }
        return isValid;
      });

      if (validPlans.length !== plans.length) {
        console.log(
          `🧹 Cleaned ${plans.length - validPlans.length} invalid plans`
        );
        // שמור את הנתונים הנקיים
        await AsyncStorage.setItem(key, JSON.stringify(validPlans));
      }

      return validPlans;
    },
    "getPlansByUserId",
    userId
  );
}

/**
 * 💾 שומר תוכנית אימון (חדשה או עדכון קיימת)
 * מזהה אוטומטית אם זה עדכון או יצירה חדשה לפי ID
 */
export async function savePlan(
  userId: string,
  planToSave: Plan
): Promise<Plan> {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "savePlan");
  }

  if (!validatePlan(planToSave)) {
    throw new StorageError(
      "Invalid plan data",
      "savePlan",
      undefined,
      undefined,
      false
    );
  }

  return withRetry(
    async () => {
      const key = StorageKeys.plans(userId);

      // טען תוכניות קיימות
      const currentPlans = await getPlansByUserId(userId);

      // חפש תוכנית קיימת
      const existingIndex = currentPlans.findIndex(
        (p) => p.id === planToSave.id
      );

      let updatedPlans: Plan[];
      if (existingIndex > -1) {
        // עדכן תוכנית קיימת
        updatedPlans = [...currentPlans];
        updatedPlans[existingIndex] = planToSave;
        if (__DEV__) console.log(`📝 Updated plan: ${planToSave.name}`);
      } else {
        // הוסף תוכנית חדשה
        updatedPlans = [...currentPlans, planToSave];
        if (__DEV__) console.log(`➕ Added new plan: ${planToSave.name}`);
      }

      // שמור עם דחיסה אם נדרש
      const dataToSave = compressData(JSON.stringify(updatedPlans));
      await AsyncStorage.setItem(key, dataToSave);

      return planToSave;
    },
    "savePlan",
    planToSave.id
  );
}

/**
 * 🗑️ מוחק תוכנית אימון ספציפית
 * מחזיר true אם נמחקה בהצלחה, false אם לא נמצאה
 */
export async function deletePlan(
  userId: string,
  planId: string
): Promise<boolean> {
  if (!userId?.trim() || !planId?.trim()) {
    throw new StorageError("User ID and Plan ID are required", "deletePlan");
  }

  return withRetry(
    async () => {
      const currentPlans = await getPlansByUserId(userId);
      const filteredPlans = currentPlans.filter((p) => p.id !== planId);

      if (filteredPlans.length === currentPlans.length) {
        if (__DEV__) console.warn(`⚠️ Plan ${planId} not found for deletion`);
        return false;
      }

      const key = StorageKeys.plans(userId);
      await AsyncStorage.setItem(key, JSON.stringify(filteredPlans));

      if (__DEV__) console.log(`🗑️ Deleted plan: ${planId}`);
      return true;
    },
    "deletePlan",
    planId
  );
}

/**
 * 🔍 חיפוש תוכניות לפי קריטריונים
 * מספק חיפוש מתקדם בשם, תיאור וטאגים
 */
export async function searchPlans(
  userId: string,
  searchCriteria: {
    query?: string;
    tags?: string[];
    difficulty?: string;
    type?: string;
  }
): Promise<Plan[]> {
  const allPlans = await getPlansByUserId(userId);

  return allPlans.filter((plan) => {
    // חיפוש טקסט כללי
    if (searchCriteria.query) {
      const query = searchCriteria.query.toLowerCase();
      const searchableText = `${plan.name} ${plan.description}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // חיפוש לפי טאגים
    if (searchCriteria.tags && searchCriteria.tags.length > 0) {
      const planTags = (plan as any).tags || [];
      const hasMatchingTag = searchCriteria.tags.some((tag) =>
        planTags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // חיפוש לפי דרגת קושי
    if (searchCriteria.difficulty) {
      if ((plan as any).difficulty !== searchCriteria.difficulty) {
        return false;
      }
    }

    // חיפוש לפי סוג
    if (searchCriteria.type) {
      if ((plan as any).type !== searchCriteria.type) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 📊 מחזיר סטטיסטיקות על תוכניות המשתמש
 */
export async function getPlanStatistics(userId: string) {
  const plans = await getPlansByUserId(userId);

  const stats = {
    totalPlans: plans.length,
    plansByDifficulty: {} as Record<string, number>,
    plansByType: {} as Record<string, number>,
    averageDaysPerPlan: 0,
    totalWorkouts: 0,
  };

  let totalDays = 0;

  for (const plan of plans) {
    // ספירה לפי דרגת קושי
    const difficulty = (plan as any).difficulty || "unknown";
    stats.plansByDifficulty[difficulty] =
      (stats.plansByDifficulty[difficulty] || 0) + 1;

    // ספירה לפי סוג
    const type = (plan as any).type || "unknown";
    stats.plansByType[type] = (stats.plansByType[type] || 0) + 1;

    // ספירת ימים ואימונים
    if (plan.days) {
      totalDays += plan.days.length;
    }
    if (plan.workouts) {
      stats.totalWorkouts += plan.workouts.length;
    }
  }

  stats.averageDaysPerPlan = plans.length > 0 ? totalDays / plans.length : 0;

  return stats;
}

/**
 * 📋 מחיקת כל תוכניות המשתמש
 * שימושי לאיפוס או מחיקת חשבון
 */
export async function clearAllPlans(userId: string): Promise<void> {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "clearAllPlans");
  }

  return withRetry(
    async () => {
      const key = StorageKeys.plans(userId);
      await AsyncStorage.removeItem(key);

      if (__DEV__) {
        console.log(`🧹 Cleared all plans for user: ${userId}`);
      }
    },
    "clearAllPlans",
    userId
  );
}
