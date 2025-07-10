// src/data/storage/workouts/history.ts
// 🏋️ ניהול היסטוריית אימונים - פעולות CRUD בסיסיות

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../../../types/workout";
import {
  withRetry,
  StorageError,
  StorageKeys,
  validateWorkout,
  compressData,
} from "../core";

/**
 * 📊 טוען היסטוריית אימונים של משתמש
 * כולל ולידציה, ניקוי ומיון לפי תאריך
 */
export async function getWorkoutHistory(
  userId: string,
  limit?: number
): Promise<Workout[]> {
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
}

/**
 * 💾 שומר אימון מושלם להיסטוריה
 * כולל הוספת timestamp והגבלת גודל ההיסטוריה
 */
export async function saveWorkoutToHistory(
  userId: string,
  completedWorkout: Workout
): Promise<boolean> {
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
}

/**
 * 🗑️ מוחק אימון מההיסטוריה
 * מחזיר true אם נמחק בהצלחה, false אם לא נמצא
 */
export async function deleteWorkoutFromHistory(
  userId: string,
  workoutId: string
): Promise<boolean> {
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
}

/**
 * 🔄 מעדכן אימון קיים בהיסטוריה
 * מאפשר עדכון חלקי של שדות האימון
 */
export async function updateWorkoutInHistory(
  userId: string,
  workoutId: string,
  updatedWorkout: Partial<Workout>
): Promise<boolean> {
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
}

/**
 * 🧹 מחיקת היסטוריית אימונים מלאה
 * שימושי לאיפוס או מחיקת חשבון
 */
export async function clearWorkoutHistory(userId: string): Promise<void> {
  if (!userId?.trim()) {
    throw new StorageError("User ID is required", "clearWorkoutHistory");
  }

  return withRetry(
    async () => {
      const key = StorageKeys.workoutHistory(userId);
      await AsyncStorage.removeItem(key);

      if (__DEV__) {
        console.log(`🧹 Cleared workout history for user: ${userId}`);
      }
    },
    "clearWorkoutHistory",
    userId
  );
}

/**
 * 📊 מחזיר מידע בסיסי על ההיסטוריה
 */
export async function getWorkoutHistoryInfo(userId: string): Promise<{
  totalWorkouts: number;
  lastWorkoutDate?: string;
  firstWorkoutDate?: string;
  avgWorkoutsPerWeek: number;
}> {
  const history = await getWorkoutHistory(userId);

  if (history.length === 0) {
    return {
      totalWorkouts: 0,
      avgWorkoutsPerWeek: 0,
    };
  }

  const sortedDates = history
    .map((w) => new Date(w.completedAt || w.date || 0))
    .sort((a, b) => b.getTime() - a.getTime());

  const lastDate = sortedDates[0];
  const firstDate = sortedDates[sortedDates.length - 1];

  // חישוב ממוצע אימונים לשבוע
  const totalDays =
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
  const avgWorkoutsPerWeek =
    totalDays > 0 ? (history.length / totalDays) * 7 : 0;

  return {
    totalWorkouts: history.length,
    lastWorkoutDate: lastDate.toISOString(),
    firstWorkoutDate: firstDate.toISOString(),
    avgWorkoutsPerWeek: Math.round(avgWorkoutsPerWeek * 10) / 10, // עיגול לעשירית
  };
}
