// src/data/storage/workouts/export.ts
// 📤 יצוא נתוני אימונים בפורמטים שונים

import { withRetry, StorageError } from "../core";
import { getWorkoutHistory } from "./history";

/**
 * 📤 יצוא היסטוריית אימונים בפורמטים שונים
 * תומך ב-JSON ו-CSV
 */
export async function exportWorkoutHistory(
  userId: string,
  format: "json" | "csv" = "json"
): Promise<string> {
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
}

/**
 * 📊 יצוא סיכום סטטיסטי של האימונים
 */
export async function exportWorkoutSummary(userId: string): Promise<string> {
  const workouts = await getWorkoutHistory(userId);

  const summary = {
    totalWorkouts: workouts.length,
    dateRange: {
      first: workouts[workouts.length - 1]?.completedAt || null,
      last: workouts[0]?.completedAt || null,
    },
    totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
    averageRating:
      workouts.filter((w) => w.rating).length > 0
        ? workouts.reduce((sum, w) => sum + (w.rating || 0), 0) /
          workouts.filter((w) => w.rating).length
        : 0,
    exerciseCount: new Set(
      workouts.flatMap((w) => w.exercises.map((e) => e.name))
    ).size,
    exportDate: new Date().toISOString(),
  };

  return JSON.stringify(summary, null, 2);
}
