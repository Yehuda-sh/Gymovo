// src/stores/workout-store/navigation/index.ts
// 📱 ניווט בין תרגילים וסטים באימון

import { WorkoutState } from "../types";

// ⏭️ מעבר לתרגיל הבא
export const createGoToNextExerciseAction =
  (set: any, get: any) => (): boolean => {
    const state = get() as WorkoutState;
    if (!state.activeWorkout) return false;

    const nextIndex = state.currentExerciseIndex + 1;
    if (nextIndex < state.activeWorkout.exercises.length) {
      set({
        currentExerciseIndex: nextIndex,
        currentSetIndex: 0,
        isResting: false,
        restTimeLeft: 0,
      });

      console.log(`⏭️ Moved to next exercise: ${nextIndex}`);
      return true;
    }

    console.log("⏭️ Already at last exercise");
    return false;
  };

// ⏮️ מעבר לתרגיל הקודם
export const createGoToPrevExerciseAction =
  (set: any, get: any) => (): void => {
    const state = get() as WorkoutState;
    if (!state.activeWorkout) return;

    const prevIndex = state.currentExerciseIndex - 1;
    if (prevIndex >= 0) {
      set({
        currentExerciseIndex: prevIndex,
        currentSetIndex: 0,
        isResting: false,
        restTimeLeft: 0,
      });

      console.log(`⏮️ Moved to previous exercise: ${prevIndex}`);
    } else {
      console.log("⏮️ Already at first exercise");
    }
  };

// 📍 מעבר לתרגיל ספציפי
export const createGoToExerciseAction =
  (set: any, get: any) =>
  (index: number): void => {
    const state = get() as WorkoutState;
    if (!state.activeWorkout) return;

    if (index >= 0 && index < state.activeWorkout.exercises.length) {
      // נקה מנוחה אם פעילה
      if (state.restTimer) {
        clearInterval(state.restTimer);
      }

      set({
        currentExerciseIndex: index,
        currentSetIndex: 0,
        isResting: false,
        restTimeLeft: 0,
        restTimer: null,
      });

      console.log(`📍 Jumped to exercise: ${index}`);
    } else {
      console.warn(`📍 Invalid exercise index: ${index}`);
    }
  };

// ⏭️ מעבר לסט הבא
export const createGoToNextSetAction = (set: any, get: any) => (): boolean => {
  const state = get() as WorkoutState;
  if (!state.activeWorkout) return false;

  const currentExercise =
    state.activeWorkout.exercises[state.currentExerciseIndex];
  if (!currentExercise) return false;

  const nextSetIndex = state.currentSetIndex + 1;
  if (nextSetIndex < currentExercise.sets.length) {
    set({ currentSetIndex: nextSetIndex });
    console.log(`⏭️ Moved to next set: ${nextSetIndex}`);
    return true;
  }

  // אם אין עוד סטים, נסה לעבור לתרגיל הבא
  console.log("⏭️ No more sets, trying next exercise");
  const goToNextExercise = createGoToNextExerciseAction(set, get);
  return goToNextExercise();
};

// ⏮️ מעבר לסט הקודם
export const createGoToPrevSetAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;
  if (!state.activeWorkout) return;

  const prevSetIndex = state.currentSetIndex - 1;
  if (prevSetIndex >= 0) {
    set({ currentSetIndex: prevSetIndex });
    console.log(`⏮️ Moved to previous set: ${prevSetIndex}`);
  } else {
    // אם אנחנו בסט הראשון, נסה לעבור לתרגיל הקודם (סט אחרון)
    const prevExerciseIndex = state.currentExerciseIndex - 1;
    if (prevExerciseIndex >= 0) {
      const prevExercise = state.activeWorkout.exercises[prevExerciseIndex];

      if (state.restTimer) {
        clearInterval(state.restTimer);
      }

      set({
        currentExerciseIndex: prevExerciseIndex,
        currentSetIndex: prevExercise.sets.length - 1,
        isResting: false,
        restTimeLeft: 0,
        restTimer: null,
      });

      console.log(
        `⏮️ Moved to previous exercise last set: ${prevExerciseIndex}`
      );
    } else {
      console.log("⏮️ Already at first set of first exercise");
    }
  }
};

// 🔍 קבלת מידע על המיקום הנוכחי
export const createGetCurrentPositionAction = (get: any) => () => {
  const state = get() as WorkoutState;
  if (!state.activeWorkout) return null;

  const currentExercise =
    state.activeWorkout.exercises[state.currentExerciseIndex];
  const currentSet = currentExercise?.sets[state.currentSetIndex];

  return {
    exerciseIndex: state.currentExerciseIndex,
    setIndex: state.currentSetIndex,
    totalExercises: state.activeWorkout.exercises.length,
    totalSetsInCurrentExercise: currentExercise?.sets.length || 0,
    exerciseName: currentExercise?.name || "",
    setData: currentSet || null,
    isLastExercise:
      state.currentExerciseIndex === state.activeWorkout.exercises.length - 1,
    isLastSet:
      currentExercise &&
      state.currentSetIndex === currentExercise.sets.length - 1,
    isFirstExercise: state.currentExerciseIndex === 0,
    isFirstSet: state.currentSetIndex === 0,
  };
};

// 🎯 מעבר לסט ספציפי בתרגיל הנוכחי
export const createGoToSetAction =
  (set: any, get: any) =>
  (setIndex: number): void => {
    const state = get() as WorkoutState;
    if (!state.activeWorkout) return;

    const currentExercise =
      state.activeWorkout.exercises[state.currentExerciseIndex];
    if (!currentExercise) return;

    if (setIndex >= 0 && setIndex < currentExercise.sets.length) {
      set({ currentSetIndex: setIndex });
      console.log(`🎯 Jumped to set: ${setIndex}`);
    } else {
      console.warn(`🎯 Invalid set index: ${setIndex}`);
    }
  };

// 🔄 איפוס מיקום לתחילת האימון
export const createResetNavigationAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;
  if (!state.activeWorkout) return;

  // נקה טיימרים
  if (state.restTimer) {
    clearInterval(state.restTimer);
  }

  set({
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    isResting: false,
    restTimeLeft: 0,
    restTimer: null,
  });

  console.log("🔄 Navigation reset to beginning");
};
