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
/**
 * 🗑️ Delete workout from history
 */
export const deleteWorkoutFromHistory = async (
  userId: string,
  workoutId: string
): Promise<boolean> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "deleteWorkoutFromHistory");
  }

  if (!workoutId?.trim()) {
    throw new StorageError(
      "Workout ID is required",
      "deleteWorkoutFromHistory"
    );
  }

  return withRetry(
    async () => {
      const currentHistory = await getWorkoutHistory(userId);
      const updatedHistory = currentHistory.filter(
        (workout) => workout.id !== workoutId
      );

      if (updatedHistory.length === currentHistory.length) {
        if (__DEV__) {
          console.warn(`⚠️ Workout ${workoutId} not found in history`);
        }
        return false; // Workout not found
      }

      const key = StorageKeys.workoutHistory(userId);
      await AsyncStorage.setItem(key, JSON.stringify(updatedHistory));

      if (__DEV__) {
        console.log(`🗑️ Deleted workout ${workoutId} for user ${userId}`);
      }

      return true;
    },
    "deleteWorkoutFromHistory",
    userId
  );
};

/**
 * 🔄 Update existing workout in history
 */
export const updateWorkoutInHistory = async (
  userId: string,
  workoutId: string,
  updatedWorkout: Partial<Workout>
): Promise<boolean> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "updateWorkoutInHistory");
  }

  if (!workoutId?.trim()) {
    throw new StorageError("Workout ID is required", "updateWorkoutInHistory");
  }

  return withRetry(
    async () => {
      const currentHistory = await getWorkoutHistory(userId);
      const workoutIndex = currentHistory.findIndex(
        (workout) => workout.id === workoutId
      );

      if (workoutIndex === -1) {
        if (__DEV__) {
          console.warn(`⚠️ Workout ${workoutId} not found for update`);
        }
        return false;
      }

      // Merge updated data with existing workout
      const updatedWorkoutData = {
        ...currentHistory[workoutIndex],
        ...updatedWorkout,
        id: workoutId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };

      // Validate updated workout
      if (!validateWorkout(updatedWorkoutData)) {
        throw new StorageError(
          "Invalid updated workout data",
          "updateWorkoutInHistory",
          undefined,
          undefined,
          false
        );
      }

      currentHistory[workoutIndex] = updatedWorkoutData;

      const key = StorageKeys.workoutHistory(userId);
      await AsyncStorage.setItem(key, JSON.stringify(currentHistory));

      if (__DEV__) {
        console.log(`🔄 Updated workout ${workoutId} for user ${userId}`);
      }

      return true;
    },
    "updateWorkoutInHistory",
    userId
  );
};

/**
 * 📊 Get workout statistics from storage
 */
export const getWorkoutStatistics = async (
  userId: string,
  options?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: "day" | "week" | "month";
  }
): Promise<{
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  averageRating: number;
  exerciseFrequency: { [exerciseName: string]: number };
  dailyStats?: { date: string; workouts: number; volume: number }[];
}> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "getWorkoutStatistics");
  }

  return withRetry(
    async () => {
      const workouts = await getWorkoutHistory(userId);

      // Apply date filters if provided
      let filteredWorkouts = workouts;
      if (options?.dateFrom || options?.dateTo) {
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(
            workout.completedAt || workout.date || 0
          );

          if (options.dateFrom && workoutDate < new Date(options.dateFrom)) {
            return false;
          }
          if (options.dateTo && workoutDate > new Date(options.dateTo)) {
            return false;
          }

          return true;
        });
      }

      // Calculate basic statistics
      const totalWorkouts = filteredWorkouts.length;

      const totalVolume = filteredWorkouts.reduce((sum, workout) => {
        return (
          sum +
          workout.exercises.reduce((exSum, exercise) => {
            return (
              exSum +
              exercise.sets.reduce((setSum, set) => {
                return setSum + (set.weight || 0) * (set.reps || 0);
              }, 0)
            );
          }, 0)
        );
      }, 0);

      const totalDuration = filteredWorkouts.reduce((sum, workout) => {
        return sum + (workout.duration || 0);
      }, 0);

      const ratedWorkouts = filteredWorkouts.filter((w) => w.rating);
      const averageRating =
        ratedWorkouts.length > 0
          ? ratedWorkouts.reduce((sum, w) => sum + (w.rating || 0), 0) /
            ratedWorkouts.length
          : 0;

      // Exercise frequency
      const exerciseFrequency: { [exerciseName: string]: number } = {};
      filteredWorkouts.forEach((workout) => {
        workout.exercises.forEach((exercise) => {
          exerciseFrequency[exercise.name] =
            (exerciseFrequency[exercise.name] || 0) + 1;
        });
      });

      // Daily stats if groupBy is specified
      let dailyStats:
        | { date: string; workouts: number; volume: number }[]
        | undefined;
      if (options?.groupBy) {
        const statsMap = new Map<
          string,
          { workouts: number; volume: number }
        >();

        filteredWorkouts.forEach((workout) => {
          const date = new Date(workout.completedAt || workout.date || 0);
          let dateKey: string;

          switch (options.groupBy) {
            case "day":
              dateKey = date.toISOString().split("T")[0];
              break;
            case "week":
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay());
              dateKey = weekStart.toISOString().split("T")[0];
              break;
            case "month":
              dateKey = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`;
              break;
            default:
              dateKey = date.toISOString().split("T")[0];
          }

          const existing = statsMap.get(dateKey) || { workouts: 0, volume: 0 };
          const workoutVolume = workout.exercises.reduce((sum, ex) => {
            return (
              sum +
              ex.sets.reduce((setSum, set) => {
                return setSum + (set.weight || 0) * (set.reps || 0);
              }, 0)
            );
          }, 0);

          statsMap.set(dateKey, {
            workouts: existing.workouts + 1,
            volume: existing.volume + workoutVolume,
          });
        });

        dailyStats = Array.from(statsMap.entries())
          .map(([date, stats]) => ({ date, ...stats }))
          .sort((a, b) => a.date.localeCompare(b.date));
      }

      const result = {
        totalWorkouts,
        totalVolume,
        totalDuration,
        averageRating,
        exerciseFrequency,
        ...(dailyStats && { dailyStats }),
      };

      if (__DEV__) {
        console.log(`📊 Generated statistics for user ${userId}:`, {
          totalWorkouts,
          totalVolume,
          totalDuration: Math.round(totalDuration),
          averageRating: Math.round(averageRating * 10) / 10,
        });
      }

      return result;
    },
    "getWorkoutStatistics",
    userId
  );
};

/**
 * 🔍 Search workouts by criteria
 */
export const searchWorkouts = async (
  userId: string,
  searchCriteria: {
    query?: string;
    exerciseName?: string;
    dateFrom?: string;
    dateTo?: string;
    rating?: number;
    minDuration?: number;
    maxDuration?: number;
  }
): Promise<Workout[]> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "searchWorkouts");
  }

  return withRetry(
    async () => {
      const allWorkouts = await getWorkoutHistory(userId);

      const filteredWorkouts = allWorkouts.filter((workout) => {
        // Text search in workout name and notes
        if (searchCriteria.query) {
          const query = searchCriteria.query.toLowerCase();
          const matchesName = workout.name.toLowerCase().includes(query);
          const matchesNotes =
            workout.notes?.toLowerCase().includes(query) || false;
          const matchesExercise = workout.exercises.some((ex) =>
            ex.name.toLowerCase().includes(query)
          );

          if (!matchesName && !matchesNotes && !matchesExercise) {
            return false;
          }
        }

        // Exercise name search
        if (searchCriteria.exerciseName) {
          const hasExercise = workout.exercises.some((ex) =>
            ex.name
              .toLowerCase()
              .includes(searchCriteria.exerciseName!.toLowerCase())
          );
          if (!hasExercise) return false;
        }

        // Date range
        if (searchCriteria.dateFrom || searchCriteria.dateTo) {
          const workoutDate = new Date(
            workout.completedAt || workout.date || 0
          );

          if (
            searchCriteria.dateFrom &&
            workoutDate < new Date(searchCriteria.dateFrom)
          ) {
            return false;
          }
          if (
            searchCriteria.dateTo &&
            workoutDate > new Date(searchCriteria.dateTo)
          ) {
            return false;
          }
        }

        // Rating filter
        if (searchCriteria.rating && workout.rating !== searchCriteria.rating) {
          return false;
        }

        // Duration filters
        if (
          searchCriteria.minDuration &&
          (workout.duration || 0) < searchCriteria.minDuration
        ) {
          return false;
        }
        if (
          searchCriteria.maxDuration &&
          (workout.duration || 0) > searchCriteria.maxDuration
        ) {
          return false;
        }

        return true;
      });

      if (__DEV__) {
        console.log(
          `🔍 Search found ${filteredWorkouts.length} workouts for criteria:`,
          searchCriteria
        );
      }

      return filteredWorkouts;
    },
    "searchWorkouts",
    userId
  );
};

/**
 * 📤 Export workout history
 */
export const exportWorkoutHistory = async (
  userId: string,
  format: "json" | "csv" = "json"
): Promise<string> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "exportWorkoutHistory");
  }

  return withRetry(
    async () => {
      const workouts = await getWorkoutHistory(userId);

      if (format === "json") {
        return JSON.stringify(workouts, null, 2);
      }

      if (format === "csv") {
        // Convert to CSV format
        const headers = [
          "Date",
          "Workout Name",
          "Duration (min)",
          "Rating",
          "Total Volume (kg)",
          "Exercise Count",
          "Notes",
        ];

        const rows = workouts.map((workout) => {
          const totalVolume = workout.exercises.reduce((sum, ex) => {
            return (
              sum +
              ex.sets.reduce((setSum, set) => {
                return setSum + (set.weight || 0) * (set.reps || 0);
              }, 0)
            );
          }, 0);

          return [
            new Date(
              workout.completedAt || workout.date || 0
            ).toLocaleDateString("en-US"),
            `"${workout.name}"`,
            workout.duration || 0,
            workout.rating || "",
            Math.round(totalVolume),
            workout.exercises.length,
            `"${(workout.notes || "").replace(/"/g, '""')}"`,
          ].join(",");
        });

        return [headers.join(","), ...rows].join("\n");
      }

      throw new Error(`Unsupported export format: ${format}`);
    },
    "exportWorkoutHistory",
    userId
  );
};

/**
 * 📥 Import workout history
 */
export const importWorkoutHistory = async (
  userId: string,
  data: string,
  format: "json" = "json",
  options?: {
    mergeStrategy?: "replace" | "merge" | "append";
    validateData?: boolean;
  }
): Promise<{ imported: number; skipped: number; errors: string[] }> => {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "importWorkoutHistory");
  }

  const { mergeStrategy = "append", validateData = true } = options || {};

  return withRetry(
    async () => {
      let importedWorkouts: Workout[];

      try {
        if (format === "json") {
          importedWorkouts = JSON.parse(data);
        } else {
          throw new Error(`Unsupported import format: ${format}`);
        }
      } catch (parseError) {
        throw new StorageError(
          "Failed to parse import data",
          "importWorkoutHistory",
          undefined,
          parseError as Error
        );
      }

      if (!Array.isArray(importedWorkouts)) {
        throw new StorageError(
          "Import data must be an array of workouts",
          "importWorkoutHistory"
        );
      }

      const results = { imported: 0, skipped: 0, errors: [] as string[] };
      const validWorkouts: Workout[] = [];

      // Validate each workout
      importedWorkouts.forEach((workout, index) => {
        if (validateData && !validateWorkout(workout)) {
          results.errors.push(`Invalid workout at index ${index}`);
          results.skipped++;
          return;
        }

        // Ensure unique IDs
        const workoutWithId = {
          ...workout,
          id: workout.id || `imported_${Date.now()}_${index}`,
          importedAt: new Date().toISOString(),
        };

        validWorkouts.push(workoutWithId);
        results.imported++;
      });

      if (validWorkouts.length === 0) {
        return results;
      }

      // Apply merge strategy
      let finalWorkouts: Workout[];
      const existingWorkouts = await getWorkoutHistory(userId);

      switch (mergeStrategy) {
        case "replace":
          finalWorkouts = validWorkouts;
          break;
        case "merge":
          // Merge by ID, imported takes precedence
          const mergedMap = new Map<string, Workout>();
          existingWorkouts.forEach((w) => mergedMap.set(w.id, w));
          validWorkouts.forEach((w) => mergedMap.set(w.id, w));
          finalWorkouts = Array.from(mergedMap.values());
          break;
        case "append":
        default:
          finalWorkouts = [...existingWorkouts, ...validWorkouts];
          break;
      }

      // Sort by date (newest first)
      finalWorkouts.sort((a, b) => {
        const dateA = new Date(a.completedAt || a.date || 0).getTime();
        const dateB = new Date(b.completedAt || b.date || 0).getTime();
        return dateB - dateA;
      });

      // Limit to prevent storage issues
      if (finalWorkouts.length > 500) {
        finalWorkouts = finalWorkouts.slice(0, 500);
        results.errors.push(`Limited to 500 most recent workouts`);
      }

      // Save to storage
      const key = StorageKeys.workoutHistory(userId);
      await AsyncStorage.setItem(key, JSON.stringify(finalWorkouts));

      if (__DEV__) {
        console.log(`📥 Import completed for user ${userId}:`, results);
      }

      return results;
    },
    "importWorkoutHistory",
    userId
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
