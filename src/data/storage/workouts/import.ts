// src/data/storage/workouts/import.ts
// 📥 יבוא נתוני אימונים עם תמיכה באסטרטגיות מיזוג שונות

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout } from "../../../types/workout";
import { withRetry, StorageError, StorageKeys, validateWorkout } from "../core";
import { getWorkoutHistory } from "./history";

/**
 * 📥 יבוא היסטוריית אימונים מנתונים חיצוניים
 * תומך במספר אסטרטגיות מיזוג ובולידציה
 */
export async function importWorkoutHistory(
  userId: string,
  data: string,
  format: "json" = "json",
  options?: {
    mergeStrategy?: "replace" | "merge" | "append";
    validateData?: boolean;
  }
): Promise<{ imported: number; skipped: number; errors: string[] }> {
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
}

/**
 * 🔄 יבוא מותנה - רק אימונים שלא קיימים
 */
export async function importNewWorkoutsOnly(
  userId: string,
  data: string
): Promise<{ imported: number; skipped: number; errors: string[] }> {
  const existingWorkouts = await getWorkoutHistory(userId);
  const existingIds = new Set(existingWorkouts.map((w) => w.id));

  let importedWorkouts: Workout[];
  try {
    importedWorkouts = JSON.parse(data);
  } catch {
    return { imported: 0, skipped: 0, errors: ["Invalid JSON data"] };
  }

  const newWorkouts = importedWorkouts.filter((w) => !existingIds.has(w.id));
  const newData = JSON.stringify(newWorkouts);

  return importWorkoutHistory(userId, newData, "json", {
    mergeStrategy: "append",
    validateData: true,
  });
}
