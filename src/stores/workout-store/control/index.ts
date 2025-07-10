// src/stores/workout-store/control/index.ts
// ⏸️ שליטה באימון - השהיה, סיום, ביטול ושמירה

import { produce } from "immer";
import { Workout } from "../../../types/workout";
import { saveWorkoutToHistory } from "../../../data/storage";
import { useUserStore } from "../../userStore";
import { WorkoutState } from "../types";
import {
  calculateWorkoutProgress,
  isWorkoutCompleted,
  formatDuration,
} from "../constants";

// ⏸️ השהיית אימון
export const createPauseWorkoutAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  if (!state.activeWorkout || state.isPaused) return;

  // השהה גם את טיימר המנוחה אם פעיל
  if (state.isResting && state.restTimer) {
    set({ isPaused: true });
  }

  // עדכן זמן האימון
  const currentDuration = state.currentWorkoutStats.startTime
    ? Math.round(
        (Date.now() - state.currentWorkoutStats.startTime.getTime()) / 1000 / 60
      )
    : 0;

  set(
    produce((draft: WorkoutState) => {
      if (draft.activeWorkout) {
        draft.isPaused = true;
        draft.currentWorkoutStats.duration = currentDuration;
        draft.activeWorkout.pausedAt = new Date().toISOString();
      }
    })
  );

  console.log("⏸️ Workout paused");
};

// ▶️ המשך אימון
export const createResumeWorkoutAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  if (!state.activeWorkout || !state.isPaused) return;

  set(
    produce((draft: WorkoutState) => {
      if (draft.activeWorkout) {
        draft.isPaused = false;
        draft.activeWorkout.resumedAt = new Date().toISOString();
        // אל תאפס את זמן ההתחלה - רק המשך לספור
      }
    })
  );

  console.log("▶️ Workout resumed");
};

// 🏁 סיום אימון
export const createFinishWorkoutAction =
  (set: any, get: any) => async (): Promise<Workout> => {
    const state = get() as WorkoutState;

    if (!state.activeWorkout) {
      throw new Error("No active workout to finish");
    }

    console.log("🏁 Finishing workout...");

    // נקה טיימרים
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    // חשב נתונים סופיים
    const endTime = new Date();
    const totalDuration = state.currentWorkoutStats.startTime
      ? Math.round(
          (endTime.getTime() - state.currentWorkoutStats.startTime.getTime()) /
            1000 /
            60
        )
      : state.currentWorkoutStats.duration;

    const completedWorkout: Workout = {
      ...state.activeWorkout,
      finishedAt: endTime.toISOString(),
      duration: totalDuration,
      completedExercises: state.activeWorkout.exercises.filter((ex) =>
        ex.sets.some((set) => set.status === "completed")
      ).length,
      totalVolume: state.currentWorkoutStats.volume,
      totalCalories: state.currentWorkoutStats.calories,
      completionPercentage: calculateWorkoutProgress(
        state.activeWorkout.exercises
      ),
      isCompleted: isWorkoutCompleted(state.activeWorkout.exercises),
      notes: state.activeWorkout.notes || "",
    };

    try {
      // שמור את האימון להיסטוריה
      const userId = useUserStore.getState().user?.id;
      if (userId) {
        await saveWorkoutToHistory(userId, completedWorkout);
        console.log("💾 Workout saved to history");
      }

      // הוסף להיסטוריה המקומית
      set(
        produce((draft: WorkoutState) => {
          draft.workouts.unshift(completedWorkout);

          // איפוס מצב האימון הפעיל
          draft.activeWorkout = null;
          draft.currentExerciseIndex = 0;
          draft.currentSetIndex = 0;
          draft.isResting = false;
          draft.restTimeLeft = 0;
          draft.restTimer = null;
          draft.isPaused = false;
          draft.currentWorkoutStats = {
            startTime: null,
            duration: 0,
            completedSets: 0,
            totalSets: 0,
            calories: 0,
            volume: 0,
          };
        })
      );

      console.log(`🏁 Workout finished: ${formatDuration(totalDuration)}`);
      return completedWorkout;
    } catch (error) {
      console.error("Failed to save workout:", error);
      throw error;
    }
  };

// ❌ ביטול אימון
export const createCancelWorkoutAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  // נקה טיימר אם קיים
  if (state.restTimer) {
    clearInterval(state.restTimer);
  }

  console.log("❌ Workout cancelled");

  // איפוס מלא
  const resetWorkout = createResetWorkoutAction(set, get);
  resetWorkout();
};

// 💾 שמירת התקדמות אימון
export const createSaveWorkoutProgressAction =
  (set: any, get: any) => (): void => {
    const state = get() as WorkoutState;

    if (!state.activeWorkout) return;

    try {
      // עדכן זמן נוכחי
      const currentDuration = state.currentWorkoutStats.startTime
        ? Math.round(
            (Date.now() - state.currentWorkoutStats.startTime.getTime()) /
              1000 /
              60
          )
        : 0;

      const progressData = {
        workout: {
          ...state.activeWorkout,
          duration: currentDuration,
        },
        currentExerciseIndex: state.currentExerciseIndex,
        currentSetIndex: state.currentSetIndex,
        stats: {
          ...state.currentWorkoutStats,
          duration: currentDuration,
        },
        timestamp: Date.now(),
        progressPercentage: calculateWorkoutProgress(
          state.activeWorkout.exercises
        ),
      };

      // TODO: לממש שמירה ל-AsyncStorage
      console.log("💾 Workout progress saved", {
        exerciseIndex: progressData.currentExerciseIndex,
        setIndex: progressData.currentSetIndex,
        duration: progressData.stats.duration,
        completedSets: progressData.stats.completedSets,
        totalSets: progressData.stats.totalSets,
      });

      // עדכון duration בסטייט
      set(
        produce((draft: WorkoutState) => {
          if (draft.activeWorkout) {
            draft.currentWorkoutStats.duration = currentDuration;
          }
        })
      );
    } catch (error) {
      console.error("Failed to save workout progress:", error);
    }
  };

// 🔄 איפוס אימון פעיל
export const createResetWorkoutAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  // נקה טיימר אם קיים
  if (state.restTimer) {
    clearInterval(state.restTimer);
  }

  set({
    activeWorkout: null,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    isResting: false,
    restTimeLeft: 0,
    restTimer: null,
    isPaused: false,
    currentWorkoutStats: {
      startTime: null,
      duration: 0,
      completedSets: 0,
      totalSets: 0,
      calories: 0,
      volume: 0,
    },
  });

  console.log("🔄 Workout reset");
};

// 📊 קבלת מידע על מצב האימון
export const createGetWorkoutStatusAction = (get: any) => () => {
  const state = get() as WorkoutState;

  if (!state.activeWorkout) {
    return null;
  }

  const currentDuration = state.currentWorkoutStats.startTime
    ? Math.round(
        (Date.now() - state.currentWorkoutStats.startTime.getTime()) / 1000 / 60
      )
    : state.currentWorkoutStats.duration;

  return {
    isActive: true,
    isPaused: state.isPaused,
    isResting: state.isResting,
    duration: currentDuration,
    formattedDuration: formatDuration(currentDuration),
    progress: calculateWorkoutProgress(state.activeWorkout.exercises),
    completedSets: state.currentWorkoutStats.completedSets,
    totalSets: state.currentWorkoutStats.totalSets,
    currentExercise: state.currentExerciseIndex + 1,
    totalExercises: state.activeWorkout.exercises.length,
    volume: state.currentWorkoutStats.volume,
    calories: state.currentWorkoutStats.calories,
    canFinish: state.currentWorkoutStats.completedSets > 0, // לפחות סט אחד הושלם
    isCompleted: isWorkoutCompleted(state.activeWorkout.exercises),
  };
};
