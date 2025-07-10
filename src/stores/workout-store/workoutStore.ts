// src/stores/workout-store/workoutStore.ts
// 🏋️ מערכת ניהול אימונים מורפקטרת - Store ראשי

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// ייבוא כל ה-types
import { WorkoutState } from "./types";

// ייבוא כל ה-actions
import {
  createStartWorkoutAction,
  createStartCustomWorkoutAction,
  createStartEmptyWorkoutAction,
  createUpdateSetAction,
  createToggleSetCompletedAction,
  createAddExerciseAction,
  createRemoveExerciseAction,
  createReorderExercisesAction,
} from "./actions";

// ייבוא navigation
import {
  createGoToNextExerciseAction,
  createGoToPrevExerciseAction,
  createGoToExerciseAction,
  createGoToNextSetAction,
  createGoToPrevSetAction,
} from "./navigation";

// ייבוא rest
import {
  createStartRestAction,
  createSkipRestAction,
  createPauseRestAction,
  createResumeRestAction,
  createUpdateRestTimeAction,
} from "./rest";

// ייבוא control
import {
  createPauseWorkoutAction,
  createResumeWorkoutAction,
  createFinishWorkoutAction,
  createCancelWorkoutAction,
  createSaveWorkoutProgressAction,
  createResetWorkoutAction,
} from "./control";

// ייבוא history
import {
  createLoadWorkoutHistoryAction,
  createDeleteWorkoutAction,
  createUpdateWorkoutAction,
} from "./history";

// ייבוא stats
import {
  createCheckForPersonalRecordsAction,
  createClearPersonalRecordsAction,
} from "./stats";

// 🏗️ יצירת Store עם כל הפעולות
export const useWorkoutStore = create<WorkoutState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // 🏋️ מצב אימון פעיל
      activeWorkout: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
      isPaused: false,

      // 📅 היסטוריית אימונים
      workouts: [],
      isLoadingWorkouts: false,
      workoutsError: null,

      // 📊 סטטיסטיקות אימון
      currentWorkoutStats: {
        startTime: null,
        duration: 0,
        completedSets: 0,
        totalSets: 0,
        calories: 0,
        volume: 0,
      },

      // 🏆 שיאים אישיים
      personalRecords: [],

      // 🎯 פעולות אימון
      startWorkout: createStartWorkoutAction(set, get),
      startCustomWorkout: createStartCustomWorkoutAction(set, get),
      startEmptyWorkout: createStartEmptyWorkoutAction(set, get),
      updateSet: createUpdateSetAction(set, get),
      toggleSetCompleted: createToggleSetCompletedAction(set, get),
      addExercise: createAddExerciseAction(set, get),
      removeExercise: createRemoveExerciseAction(set, get),
      reorderExercises: createReorderExercisesAction(set, get),

      // 📱 ניווט בין תרגילים
      goToNextExercise: createGoToNextExerciseAction(set, get),
      goToPrevExercise: createGoToPrevExerciseAction(set, get),
      goToExercise: createGoToExerciseAction(set, get),
      goToNextSet: createGoToNextSetAction(set, get),
      goToPrevSet: createGoToPrevSetAction(set, get),

      // ⏱️ ניהול מנוחה
      startRest: createStartRestAction(set, get),
      skipRest: createSkipRestAction(set, get),
      pauseRest: createPauseRestAction(set, get),
      resumeRest: createResumeRestAction(set, get),
      updateRestTime: createUpdateRestTimeAction(set, get),

      // ⏸️ ניהול אימון
      pauseWorkout: createPauseWorkoutAction(set, get),
      resumeWorkout: createResumeWorkoutAction(set, get),

      // 🏁 סיום אימון
      finishWorkout: createFinishWorkoutAction(set, get),
      cancelWorkout: createCancelWorkoutAction(set, get),
      saveWorkoutProgress: createSaveWorkoutProgressAction(set, get),

      // 📊 היסטוריה
      loadWorkoutHistory: createLoadWorkoutHistoryAction(set, get),
      deleteWorkout: createDeleteWorkoutAction(set, get),
      updateWorkout: createUpdateWorkoutAction(set, get),

      // 🏆 שיאים אישיים
      checkForPersonalRecords: createCheckForPersonalRecordsAction(set, get),
      clearPersonalRecords: createClearPersonalRecordsAction(set, get),

      // 🔄 איפוס
      resetWorkout: createResetWorkoutAction(set, get),
      clearAll: () => {
        const resetWorkout = createResetWorkoutAction(set, get);
        const clearPersonalRecords = createClearPersonalRecordsAction(set, get);

        resetWorkout();
        clearPersonalRecords();

        set({
          workouts: [],
          isLoadingWorkouts: false,
          workoutsError: null,
        });

        console.log("🧹 All workout data cleared");
      },
    }))
  )
);
