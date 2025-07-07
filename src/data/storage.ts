// src/data/storage.ts - גרסה משודרגת עם retry mechanism ויציבות מלאה

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plan } from "../types/plan";
import { Workout } from "../types/workout";

// 🔧 הגדרות retry וטיפול בשגיאות
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 5000,
  backoffFactor: 2,
};

const STORAGE_CONFIG = {
  timeout: 10000, // 10 שניות timeout
  compressionThreshold: 50000, // דחיסה מעל 50KB
};

// 📊 ממשק לסטטיסטיקות storage
interface StorageStats {
  operations: number;
  successes: number;
  failures: number;
  retries: number;
  avgResponseTime: number;
}

// 📈 משתנה גלובלי לסטטיסטיקות (רק לפיתוח)
let storageStats: StorageStats = {
  operations: 0,
  successes: 0,
  failures: 0,
  retries: 0,
  avgResponseTime: 0,
};

// 🚨 מחלקת שגיאות מותאמת לStorage
export class StorageError extends Error {
  constructor(
    message: string,
    public operation: string,
    public key?: string,
    public originalError?: any,
    public isRetryable: boolean = true
  ) {
    super(message);
    this.name = "StorageError";
  }
}

// 🔄 פונקציית retry עם exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  key?: string,
  retryConfig = RETRY_CONFIG
): Promise<T> {
  const startTime = Date.now();
  storageStats.operations++;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Storage operation timeout")),
            STORAGE_CONFIG.timeout
          )
        ),
      ]);

      // עדכון סטטיסטיקות בהצלחה
      storageStats.successes++;
      const responseTime = Date.now() - startTime;
      storageStats.avgResponseTime =
        (storageStats.avgResponseTime * (storageStats.successes - 1) +
          responseTime) /
        storageStats.successes;

      if (__DEV__ && attempt > 0) {
        console.log(
          `✅ ${operationName} succeeded after ${attempt} retries (${responseTime}ms)`
        );
      }

      return result;
    } catch (error) {
      const isLastAttempt = attempt === retryConfig.maxRetries;
      const isRetryableError = isRetryable(error as Error);

      if (isLastAttempt || !isRetryableError) {
        storageStats.failures++;

        if (__DEV__) {
          console.error(`❌ ${operationName} failed permanently:`, error);
          console.log("📊 Storage Stats:", storageStats);
        }

        throw new StorageError(
          `${operationName} failed after ${attempt} attempts: ${
            (error as Error).message
          }`,
          operationName,
          key,
          error,
          isRetryableError
        );
      }

      // חישוב זמן המתנה עם exponential backoff + jitter
      const baseDelay = Math.min(
        retryConfig.baseDelayMs * Math.pow(retryConfig.backoffFactor, attempt),
        retryConfig.maxDelayMs
      );
      const jitter = Math.random() * 0.1 * baseDelay; // 10% jitter
      const delay = baseDelay + jitter;

      storageStats.retries++;

      if (__DEV__) {
        console.warn(
          `⚠️ ${operationName} attempt ${
            attempt + 1
          } failed, retrying in ${Math.round(delay)}ms:`,
          (error as Error).message
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // לא אמור להגיע לכאן
  throw new StorageError(
    `Unexpected error in ${operationName}`,
    operationName,
    key
  );
}

// 🔍 בדיקה אם שגיאה ניתנת לניסיון חוזר
function isRetryable(error: unknown): boolean {
  const err = error as Error;

  // שגיאות רשת וזמן קצוב - ניתנות לחזרה
  if (err.message?.includes("timeout")) return true;
  if (err.message?.includes("network")) return true;
  if ((err as any).code === "NETWORK_ERROR") return true;

  // שגיאות AsyncStorage ספציפיות
  if (err.message?.includes("AsyncStorage")) return true;
  if (err.message?.includes("quota")) return false; // מקום אחסון מלא - לא ניתן לחזרה

  // ברירת מחדל - נסה שוב
  return true;
}

// 🗜️ דחיסה בסיסית לנתונים גדולים (אופציונלי)
function compressData(data: string): string {
  if (data.length < STORAGE_CONFIG.compressionThreshold) {
    return data;
  }

  // כאן אפשר להוסיף אלגוריתם דחיסה אמיתי
  // לעכשיו, רק מסמנים שהנתונים גדולים
  console.warn(
    `📦 Large data detected (${data.length} chars), consider implementing compression`
  );
  return data;
}

// 🔑 ניהול מפתחות אחסון מרכזי
const StorageKeys = {
  plans: (userId: string) => `plans_${userId}`,
  workoutHistory: (userId: string) => `workout_history_${userId}`,
  userPreferences: (userId: string) => `user_preferences_${userId}`,
  appSettings: () => "app_settings",
  cache: (key: string) => `cache_${key}`,
} as const;

// 🛡️ ולידציה של נתונים
function validatePlan(plan: any): plan is Plan {
  return (
    plan &&
    typeof plan.id === "string" &&
    typeof plan.name === "string" &&
    typeof plan.description === "string" &&
    (Array.isArray(plan.days) || Array.isArray(plan.workouts))
  );
}

function validateWorkout(workout: any): workout is Workout {
  return (
    workout &&
    typeof workout.id === "string" &&
    typeof workout.name === "string" &&
    Array.isArray(workout.exercises)
  );
}

// 📝 --- פונקציות לניהול תוכניות (משודרגות) ---

export const getPlansByUserId = async (userId: string): Promise<Plan[]> => {
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
};

export const savePlan = async (
  userId: string,
  planToSave: Plan
): Promise<Plan> => {
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
};

export const deletePlan = async (
  userId: string,
  planId: string
): Promise<boolean> => {
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
};

// 🏃‍♂️ --- פונקציות לניהול היסטוריית אימונים (משודרגות) ---

export const getWorkoutHistory = async (
  userId: string,
  limit?: number
): Promise<Workout[]> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "getWorkoutHistory");
  }

  return withRetry(
    async () => {
      const key = StorageKeys.workoutHistory(userId);
      const historyJson = await AsyncStorage.getItem(key);

      if (!historyJson) {
        return [];
      }

      let history: any[];
      try {
        history = JSON.parse(historyJson);
      } catch (parseError) {
        console.error(
          "❌ Failed to parse workout history, corrupted storage:",
          parseError
        );
        await AsyncStorage.removeItem(key);
        return [];
      }

      if (!Array.isArray(history)) {
        console.warn("⚠️ Workout history is not an array, resetting...");
        await AsyncStorage.removeItem(key);
        return [];
      }

      // ולידציה וניקוי
      const validWorkouts = history.filter((workout, index) => {
        const isValid = validateWorkout(workout);
        if (!isValid && __DEV__) {
          console.warn(`⚠️ Invalid workout at index ${index}:`, workout);
        }
        return isValid;
      });

      // מיון לפי תאריך (החדש ביותר ראשון)
      validWorkouts.sort((a, b) => {
        const dateA = new Date(a.completedAt || a.date || 0).getTime();
        const dateB = new Date(b.completedAt || b.date || 0).getTime();
        return dateB - dateA;
      });

      // הגבלת כמות אם נדרש
      const result = limit ? validWorkouts.slice(0, limit) : validWorkouts;

      if (__DEV__) {
        console.log(`📊 Loaded ${result.length} workouts for user ${userId}`);
      }

      return result;
    },
    "getWorkoutHistory",
    userId
  );
};

export const saveWorkoutToHistory = async (
  userId: string,
  completedWorkout: Workout
): Promise<boolean> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "saveWorkoutToHistory");
  }

  if (!validateWorkout(completedWorkout)) {
    throw new StorageError(
      "Invalid workout data",
      "saveWorkoutToHistory",
      undefined,
      undefined,
      false
    );
  }

  return withRetry(
    async () => {
      const currentHistory = await getWorkoutHistory(userId);

      // הוסף timestamp אם חסר
      const workoutWithTimestamp = {
        ...completedWorkout,
        completedAt: completedWorkout.completedAt || new Date().toISOString(),
      };

      // הוסף לתחילת המערך (החדש ביותר ראשון)
      const updatedHistory = [workoutWithTimestamp, ...currentHistory];

      // הגבל למקסימום 100 אימונים (למניעת בעיות ביצועים)
      const limitedHistory = updatedHistory.slice(0, 100);

      if (limitedHistory.length < updatedHistory.length && __DEV__) {
        console.log(
          `✂️ Trimmed workout history to ${limitedHistory.length} items`
        );
      }

      const key = StorageKeys.workoutHistory(userId);
      const dataToSave = compressData(JSON.stringify(limitedHistory));
      await AsyncStorage.setItem(key, dataToSave);

      if (__DEV__) {
        console.log(
          `💾 Saved workout: ${completedWorkout.name} (${limitedHistory.length} total)`
        );
      }

      return true;
    },
    "saveWorkoutToHistory",
    completedWorkout.id
  );
};

// 🛠️ --- פונקציות עזר ותחזוקה ---

export const getStorageUsage = async (): Promise<{
  size: number;
  keys: string[];
}> => {
  return withRetry(async () => {
    const keys = await AsyncStorage.getAllKeys();
    let totalSize = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        totalSize += value.length;
      }
    }

    return { size: totalSize, keys: [...keys] }; // יצירת עותק mutable
  }, "getStorageUsage");
};

export const clearUserData = async (userId: string): Promise<boolean> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "clearUserData");
  }

  return withRetry(
    async () => {
      const keysToRemove = [
        StorageKeys.plans(userId),
        StorageKeys.workoutHistory(userId),
        StorageKeys.userPreferences(userId),
      ];

      await Promise.all(
        keysToRemove.map((key) => AsyncStorage.removeItem(key))
      );

      if (__DEV__) {
        console.log(`🧹 Cleared all data for user: ${userId}`);
      }

      return true;
    },
    "clearUserData",
    userId
  );
};

export const clearAllData = async (): Promise<boolean> => {
  return withRetry(async () => {
    await AsyncStorage.clear();

    // איפוס סטטיסטיקות
    storageStats = {
      operations: 0,
      successes: 0,
      failures: 0,
      retries: 0,
      avgResponseTime: 0,
    };

    if (__DEV__) {
      console.log("🗑️ All AsyncStorage data cleared");
    }

    return true;
  }, "clearAllData");
};

// 📊 פונקציה לקבלת סטטיסטיקות (רק לפיתוח)
export const getStorageStats = (): StorageStats => {
  return { ...storageStats };
};

// 🧪 פונקציות בדיקה (רק לפיתוח)
if (__DEV__) {
  (global as any).__STORAGE_HELPERS__ = {
    getStats: getStorageStats,
    clearStats: () => {
      storageStats = {
        operations: 0,
        successes: 0,
        failures: 0,
        retries: 0,
        avgResponseTime: 0,
      };
    },
    testRetry: async () => {
      // בדיקת retry mechanism
      let attempts = 0;
      return withRetry(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error(`Test error attempt ${attempts}`);
        }
        return `Success after ${attempts} attempts`;
      }, "testRetry");
    },
  };
}
