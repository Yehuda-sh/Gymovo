// src/data/storage/workouts/statistics.ts
// 📊 סטטיסטיקות אימונים מתקדמות - חישובים וניתוחים

import { Workout } from "../../../types/workout";
import { withRetry, StorageError } from "../core";
import { getWorkoutHistory } from "./history";

/**
 * 📊 Interface לסטטיסטיקות אימונים
 */
export interface WorkoutStatistics {
  totalWorkouts: number;
  totalVolume: number;
  totalDuration: number;
  averageRating: number;
  exerciseFrequency: { [exerciseName: string]: number };
  dailyStats?: { date: string; workouts: number; volume: number }[];
}

/**
 * 📊 מחזיר סטטיסטיקות מפורטות על אימוני המשתמש
 * כולל אפשרויות סינון לפי תאריך וקיבוץ
 */
export async function getWorkoutStatistics(
  userId: string,
  options?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: "day" | "week" | "month";
  }
): Promise<WorkoutStatistics> {
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
}

/**
 * 📈 מחזיר סטטיסטיקות מתקדמות נוספות
 * כולל מגמות וניתוחים מתקדמים
 */
export async function getAdvancedWorkoutStatistics(userId: string): Promise<{
  weeklyTrends: {
    currentWeek: number;
    lastWeek: number;
    percentageChange: number;
  };
  monthlyProgress: {
    currentMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  personalRecords: {
    exerciseName: string;
    maxWeight: number;
    maxVolume: number;
    date: string;
  }[];
  consistency: {
    currentStreak: number;
    longestStreak: number;
    averageGapDays: number;
  };
}> {
  const workouts = await getWorkoutHistory(userId);
  const now = new Date();

  // Weekly trends
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(now.getDate() - now.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const thisWeekWorkouts = workouts.filter((w) => {
    const date = new Date(w.completedAt || w.date || 0);
    return date >= thisWeekStart;
  }).length;

  const lastWeekWorkouts = workouts.filter((w) => {
    const date = new Date(w.completedAt || w.date || 0);
    return date >= lastWeekStart && date < thisWeekStart;
  }).length;

  const weeklyChange =
    lastWeekWorkouts > 0
      ? ((thisWeekWorkouts - lastWeekWorkouts) / lastWeekWorkouts) * 100
      : 0;

  // Monthly trends
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const thisMonthWorkouts = workouts.filter((w) => {
    const date = new Date(w.completedAt || w.date || 0);
    return date >= thisMonthStart;
  }).length;

  const lastMonthWorkouts = workouts.filter((w) => {
    const date = new Date(w.completedAt || w.date || 0);
    return date >= lastMonthStart && date <= lastMonthEnd;
  }).length;

  const monthlyChange =
    lastMonthWorkouts > 0
      ? ((thisMonthWorkouts - lastMonthWorkouts) / lastMonthWorkouts) * 100
      : 0;

  // Personal records
  const exerciseRecords = new Map<
    string,
    {
      maxWeight: number;
      maxVolume: number;
      date: string;
    }
  >();

  workouts.forEach((workout) => {
    workout.exercises.forEach((exercise) => {
      const totalVolume = exercise.sets.reduce(
        (sum, set) => sum + (set.weight || 0) * (set.reps || 0),
        0
      );
      const maxWeight = Math.max(
        ...exercise.sets.map((set) => set.weight || 0)
      );

      const existing = exerciseRecords.get(exercise.name);
      if (!existing || totalVolume > existing.maxVolume) {
        exerciseRecords.set(exercise.name, {
          maxWeight,
          maxVolume: totalVolume,
          date: (workout.completedAt || workout.date || "").toString(),
        });
      }
    });
  });

  const personalRecords = Array.from(exerciseRecords.entries())
    .map(([exerciseName, record]) => ({ exerciseName, ...record }))
    .sort((a, b) => b.maxVolume - a.maxVolume)
    .slice(0, 10); // Top 10 PRs

  // Consistency analysis
  const workoutDates = workouts
    .map((w) => new Date(w.completedAt || w.date || 0))
    .sort((a, b) => a.getTime() - b.getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let currentStreakCount = 0;
  let gaps: number[] = [];

  for (let i = 1; i < workoutDates.length; i++) {
    const daysDiff = Math.floor(
      (workoutDates[i].getTime() - workoutDates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysDiff <= 7) {
      // Within a week - part of streak
      currentStreakCount++;
    } else {
      longestStreak = Math.max(longestStreak, currentStreakCount);
      currentStreakCount = 1;
      gaps.push(daysDiff);
    }
  }

  // Current streak from most recent workout
  if (workoutDates.length > 0) {
    const daysSinceLastWorkout = Math.floor(
      (now.getTime() - workoutDates[workoutDates.length - 1].getTime()) /
        (1000 * 60 * 60 * 24)
    );
    currentStreak = daysSinceLastWorkout <= 7 ? currentStreakCount : 0;
  }

  longestStreak = Math.max(longestStreak, currentStreakCount);
  const averageGapDays =
    gaps.length > 0 ? gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length : 0;

  return {
    weeklyTrends: {
      currentWeek: thisWeekWorkouts,
      lastWeek: lastWeekWorkouts,
      percentageChange: Math.round(weeklyChange * 10) / 10,
    },
    monthlyProgress: {
      currentMonth: thisMonthWorkouts,
      lastMonth: lastMonthWorkouts,
      percentageChange: Math.round(monthlyChange * 10) / 10,
    },
    personalRecords,
    consistency: {
      currentStreak,
      longestStreak,
      averageGapDays: Math.round(averageGapDays * 10) / 10,
    },
  };
}

/**
 * 🎯 מחזיר סטטיסטיקות ביצועים עבור תרגיל ספציפי
 */
export async function getExerciseStatistics(
  userId: string,
  exerciseName: string
): Promise<{
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  averageWeight: number;
  progressOverTime: { date: string; weight: number; volume: number }[];
}> {
  const workouts = await getWorkoutHistory(userId);

  let totalSets = 0;
  let totalReps = 0;
  let totalVolume = 0;
  let maxWeight = 0;
  let totalWeight = 0;
  let weightCount = 0;
  const progressOverTime: { date: string; weight: number; volume: number }[] =
    [];

  workouts.forEach((workout) => {
    const targetExercises = workout.exercises.filter(
      (ex) => ex.name.toLowerCase() === exerciseName.toLowerCase()
    );

    targetExercises.forEach((exercise) => {
      const workoutDate = (workout.completedAt || workout.date || "").toString();
      let workoutMaxWeight = 0;
      let workoutVolume = 0;

      exercise.sets.forEach((set) => {
        totalSets++;
        totalReps += set.reps || 0;

        const setVolume = (set.weight || 0) * (set.reps || 0);
        totalVolume += setVolume;
        workoutVolume += setVolume;

        if (set.weight) {
          maxWeight = Math.max(maxWeight, set.weight);
          workoutMaxWeight = Math.max(workoutMaxWeight, set.weight);
          totalWeight += set.weight;
          weightCount++;
        }
      });

      if (workoutDate && (workoutMaxWeight > 0 || workoutVolume > 0)) {
        progressOverTime.push({
          date: workoutDate,
          weight: workoutMaxWeight,
          volume: workoutVolume,
        });
      }
    });
  });

  const averageWeight = weightCount > 0 ? totalWeight / weightCount : 0;

  // Sort progress by date
  progressOverTime.sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalSets,
    totalReps,
    totalVolume,
    maxWeight,
    averageWeight: Math.round(averageWeight * 10) / 10,
    progressOverTime,
  };
}
