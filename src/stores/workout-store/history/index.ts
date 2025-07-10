// src/stores/workout-store/history/index.ts
// 📊 ניהול היסטוריית אימונים - טעינה, שמירה, מחיקה ועדכון

import { produce } from "immer";
import { Workout } from "../../../types/workout";
import {
  getWorkoutHistory,
  saveWorkoutToHistory,
  deleteWorkoutFromHistory,
} from "../../../data/storage";
import { useUserStore } from "../../userStore";
import { WorkoutState } from "../types";

// 📊 טעינת היסטוריית אימונים
export const createLoadWorkoutHistoryAction =
  (set: any, get: any) => async (): Promise<void> => {
    set({ isLoadingWorkouts: true, workoutsError: null });

    try {
      const userId = useUserStore.getState().user?.id;
      if (!userId) {
        throw new Error("No user ID available");
      }

      console.log("📊 Loading workout history...");
      const history = await getWorkoutHistory(userId);

      set({
        workouts: history || [],
        isLoadingWorkouts: false,
      });

      console.log(`📊 Loaded ${history?.length || 0} workouts from history`);
    } catch (error) {
      console.error("Failed to load workout history:", error);
      set({
        workoutsError: "Failed to load workouts",
        isLoadingWorkouts: false,
        workouts: [], // איפוס במקרה של שגיאה
      });
    }
  };

// 🗑️ מחיקת אימון מההיסטוריה
export const createDeleteWorkoutAction =
  (set: any, get: any) =>
  async (workoutId: string): Promise<void> => {
    try {
      const userId = useUserStore.getState().user?.id || "guest";

      console.log(`🗑️ Deleting workout: ${workoutId}`);
      await deleteWorkoutFromHistory(userId, workoutId);

      // הסר מהמצב המקומי
      set(
        produce((state: WorkoutState) => {
          state.workouts = state.workouts.filter((w) => w.id !== workoutId);
        })
      );

      console.log(`🗑️ Workout ${workoutId} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete workout:", error);
      throw error;
    }
  };

// ✏️ עדכון אימון בהיסטוריה
export const createUpdateWorkoutAction =
  (set: any, get: any) =>
  (workoutId: string, updates: Partial<Workout>): void => {
    set(
      produce((state: WorkoutState) => {
        const workoutIndex = state.workouts.findIndex(
          (w) => w.id === workoutId
        );

        if (workoutIndex !== -1) {
          state.workouts[workoutIndex] = {
            ...state.workouts[workoutIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          console.log(`✏️ Workout ${workoutId} updated`);
        } else {
          console.warn(`✏️ Workout ${workoutId} not found for update`);
        }
      })
    );
  };

// 🔍 חיפוש אימון בהיסטוריה
export const createFindWorkoutAction =
  (get: any) =>
  (workoutId: string): Workout | null => {
    const state = get() as WorkoutState;
    return state.workouts.find((w) => w.id === workoutId) || null;
  };

// 📅 קבלת אימונים לפי תאריך
export const createGetWorkoutsByDateAction =
  (get: any) =>
  (startDate: Date, endDate?: Date): Workout[] => {
    const state = get() as WorkoutState;
    const end = endDate || new Date();

    return state.workouts
      .filter((workout) => {
        const workoutDate = new Date(workout.date);
        return workoutDate >= startDate && workoutDate <= end;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

// 📊 קבלת אימונים לפי תוכנית
export const createGetWorkoutsByPlanAction =
  (get: any) =>
  (planId: string): Workout[] => {
    const state = get() as WorkoutState;
    return state.workouts.filter((workout) => workout.planId === planId);
  };

// 🔢 קבלת מספר האימונים הכולל
export const createGetWorkoutCountAction = (get: any) => (): number => {
  const state = get() as WorkoutState;
  return state.workouts.length;
};

// 📈 קבלת סטטיסטיקות היסטוריה כלליות
export const createGetHistoryStatsAction = (get: any) => () => {
  const state = get() as WorkoutState;
  const workouts = state.workouts;

  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      totalVolume: 0,
      totalCalories: 0,
      averageDuration: 0,
      averageVolume: 0,
      completionRate: 0,
      lastWorkout: null,
    };
  }

  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const totalVolume = workouts.reduce(
    (sum, w) => sum + (w.totalVolume || 0),
    0
  );
  const totalCalories = workouts.reduce(
    (sum, w) => sum + (w.totalCalories || 0),
    0
  );
  const completedWorkouts = workouts.filter((w) => w.isCompleted).length;

  return {
    totalWorkouts: workouts.length,
    totalDuration,
    totalVolume,
    totalCalories,
    averageDuration: Math.round(totalDuration / workouts.length),
    averageVolume: Math.round(totalVolume / workouts.length),
    completionRate: Math.round((completedWorkouts / workouts.length) * 100),
    lastWorkout: workouts[0] || null, // הכי חדש (ממוין)
  };
};

// 🗂️ קבלת היסטוריה מקובצת לפי חודש
export const createGetWorkoutsByMonthAction = (get: any) => () => {
  const state = get() as WorkoutState;
  const workoutsByMonth: { [key: string]: Workout[] } = {};

  state.workouts.forEach((workout) => {
    const date = new Date(workout.date);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!workoutsByMonth[monthKey]) {
      workoutsByMonth[monthKey] = [];
    }
    workoutsByMonth[monthKey].push(workout);
  });

  return workoutsByMonth;
};

// 🔄 ניקוי כל ההיסטוריה
export const createClearHistoryAction = (set: any, get: any) => (): void => {
  set(
    produce((state: WorkoutState) => {
      state.workouts = [];
      state.isLoadingWorkouts = false;
      state.workoutsError = null;
    })
  );

  console.log("🔄 Workout history cleared");
};

// 💾 שמירת אימון חדש להיסטוריה
export const createSaveWorkoutToHistoryAction =
  (set: any, get: any) =>
  async (workout: Workout): Promise<void> => {
    try {
      const userId = useUserStore.getState().user?.id || "guest";

      console.log(`💾 Saving workout to history: ${workout.name}`);
      await saveWorkoutToHistory(userId, workout);

      // הוסף למצב המקומי
      set(
        produce((state: WorkoutState) => {
          // וודא שלא קיים כבר
          const existingIndex = state.workouts.findIndex(
            (w) => w.id === workout.id
          );
          if (existingIndex === -1) {
            state.workouts.unshift(workout); // הוסף בתחילה
          } else {
            state.workouts[existingIndex] = workout; // עדכן קיים
          }
        })
      );

      console.log(`💾 Workout saved to history successfully`);
    } catch (error) {
      console.error("Failed to save workout to history:", error);
      throw error;
    }
  };
