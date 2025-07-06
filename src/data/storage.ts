// src/data/storage.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plan } from "../types/plan";
import { Workout } from "../types/workout";

// --- פונקציות לניהול תוכניות ---

export const getPlansByUserId = async (userId: string): Promise<Plan[]> => {
  try {
    const key = `plans_${userId}`;
    const plansJson = await AsyncStorage.getItem(key);
    return plansJson ? JSON.parse(plansJson) : [];
  } catch (error) {
    console.error("Failed to get plans from storage", error);
    return [];
  }
};

/**
 * שומר (יוצר או מעדכן) תוכנית אימון עבור משתמש.
 * @param userId - מזהה המשתמש
 * @param planToSave - אובייקט התוכנית המלא לשמירה
 * @returns Promise<Plan> - התוכנית כפי שנשמרה
 */
export const savePlan = async (
  userId: string,
  planToSave: Plan
): Promise<Plan> => {
  try {
    const key = `plans_${userId}`;
    const currentPlans = await getPlansByUserId(userId);

    const existingPlanIndex = currentPlans.findIndex(
      (p) => p.id === planToSave.id
    );

    let updatedPlans: Plan[];

    if (existingPlanIndex > -1) {
      // עדכון תוכנית קיימת
      updatedPlans = currentPlans.map((plan, index) =>
        index === existingPlanIndex ? planToSave : plan
      );
    } else {
      // הוספת תוכנית חדשה
      updatedPlans = [...currentPlans, planToSave];
    }

    // TODO: בעתיד, כשנעבור לבסיס נתונים אמיתי, הלוגיקה הזו תוחלף בקריאת API.
    await AsyncStorage.setItem(key, JSON.stringify(updatedPlans));
    return planToSave;
  } catch (error) {
    console.error("Failed to save plan to storage", error);
    throw error;
  }
};

// --- פונקציות לניהול היסטוריית אימונים ---

export const getWorkoutHistory = async (userId: string): Promise<Workout[]> => {
  try {
    const key = `workout_history_${userId}`;
    const historyJson = await AsyncStorage.getItem(key);
    // מחזירים את המערך בסדר הפוך כדי שהאימון האחרון יהיה ראשון
    return historyJson ? JSON.parse(historyJson).reverse() : [];
  } catch (error) {
    console.error("Failed to get workout history", error);
    return [];
  }
};

export const saveWorkoutToHistory = async (
  userId: string,
  completedWorkout: Workout
): Promise<boolean> => {
  try {
    const key = `workout_history_${userId}`;
    const historyJson = await AsyncStorage.getItem(key);
    const history: Workout[] = historyJson ? JSON.parse(historyJson) : [];
    history.push(completedWorkout);
    await AsyncStorage.setItem(key, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error("Failed to save workout to history", error);
    return false;
  }
};

// --- כלי עזר למפתחים ---

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully.");
    return true;
  } catch (e) {
    console.error("Failed to clear AsyncStorage.", e);
    return false;
  }
};
