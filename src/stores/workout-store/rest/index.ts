// src/stores/workout-store/rest/index.ts
// ⏱️ ניהול מנוחה וטיימרים באימון

import { DEFAULT_REST_TIME, WORKOUT_TIMER_INTERVAL } from "../constants";
import { WorkoutState } from "../types";

// ⏱️ התחלת מנוחה
export const createStartRestAction =
  (set: any, get: any) =>
  (duration?: number): void => {
    const state = get() as WorkoutState;
    const restDuration = duration || DEFAULT_REST_TIME;

    // נקה טיימר קיים אם יש
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    console.log(`⏱️ Starting rest: ${restDuration}s`);

    set({
      isResting: true,
      restTimeLeft: restDuration,
      isPaused: false,
    });

    // יצירת טיימר חדש
    const timer = setInterval(() => {
      const currentState = get() as WorkoutState;

      if (!currentState.isPaused && currentState.restTimeLeft > 0) {
        set({ restTimeLeft: currentState.restTimeLeft - 1 });
      } else if (currentState.restTimeLeft <= 0) {
        // המנוחה הסתיימה
        clearInterval(timer);
        set({
          isResting: false,
          restTimeLeft: 0,
          restTimer: null,
        });

        console.log("⏱️ Rest completed automatically");
      }
    }, WORKOUT_TIMER_INTERVAL);

    set({ restTimer: timer });
  };

// ⏭️ דילוג על המנוחה
export const createSkipRestAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  if (state.restTimer) {
    clearInterval(state.restTimer);
  }

  set({
    isResting: false,
    restTimeLeft: 0,
    restTimer: null,
  });

  console.log("⏭️ Rest skipped");
};

// ⏸️ השהיית מנוחה
export const createPauseRestAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  if (state.isResting && !state.isPaused) {
    set({ isPaused: true });
    console.log("⏸️ Rest paused");
  }
};

// ▶️ המשך מנוחה
export const createResumeRestAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  if (state.isResting && state.isPaused) {
    set({ isPaused: false });
    console.log("▶️ Rest resumed");
  }
};

// 🔧 עדכון זמן מנוחה ידנית
export const createUpdateRestTimeAction =
  (set: any, get: any) =>
  (seconds: number): void => {
    const state = get() as WorkoutState;

    if (state.isResting) {
      const newTime = Math.max(0, seconds);
      set({ restTimeLeft: newTime });

      // אם הגענו לאפס, סיים את המנוחה
      if (newTime === 0) {
        const skipRest = createSkipRestAction(set, get);
        skipRest();
      }

      console.log(`🔧 Rest time updated: ${newTime}s`);
    }
  };

// ➕ הוספת זמן למנוחה
export const createAddRestTimeAction =
  (set: any, get: any) =>
  (additionalSeconds: number): void => {
    const state = get() as WorkoutState;

    if (state.isResting) {
      const newTime = state.restTimeLeft + additionalSeconds;
      const updateRestTime = createUpdateRestTimeAction(set, get);
      updateRestTime(newTime);

      console.log(`➕ Added ${additionalSeconds}s to rest`);
    }
  };

// ➖ הפחתת זמן מהמנוחה
export const createReduceRestTimeAction =
  (set: any, get: any) =>
  (secondsToReduce: number): void => {
    const state = get() as WorkoutState;

    if (state.isResting) {
      const newTime = Math.max(0, state.restTimeLeft - secondsToReduce);
      const updateRestTime = createUpdateRestTimeAction(set, get);
      updateRestTime(newTime);

      console.log(`➖ Reduced ${secondsToReduce}s from rest`);
    }
  };

// 🔄 איפוס טיימר המנוחה
export const createResetRestAction = (set: any, get: any) => (): void => {
  const state = get() as WorkoutState;

  if (state.restTimer) {
    clearInterval(state.restTimer);
  }

  set({
    isResting: false,
    restTimeLeft: 0,
    restTimer: null,
    isPaused: false,
  });

  console.log("🔄 Rest timer reset");
};

// 📊 קבלת מידע על המנוחה
export const createGetRestInfoAction = (get: any) => () => {
  const state = get() as WorkoutState;

  return {
    isResting: state.isResting,
    timeLeft: state.restTimeLeft,
    isPaused: state.isPaused,
    isActive: state.isResting && !state.isPaused,
    formattedTime: formatRestTime(state.restTimeLeft),
    percentage: state.isResting
      ? calculateRestPercentage(state.restTimeLeft, DEFAULT_REST_TIME)
      : 0,
  };
};

// 🕐 פורמט זמן מנוחה לתצוגה
const formatRestTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${remainingSeconds}`;
};

// 📊 חישוב אחוז המנוחה שנותר
const calculateRestPercentage = (
  timeLeft: number,
  totalTime: number
): number => {
  if (totalTime === 0) return 0;
  return Math.round(((totalTime - timeLeft) / totalTime) * 100);
};

// 🔔 התראה על סיום מנוחה (לעתיד - push notifications)
export const createRestCompletionNotificationAction =
  (get: any) => (): void => {
    // TODO: הוסף push notification או vibration
    console.log("🔔 Rest completed - ready for next set!");
  };

// ⚡ התחלת מנוחה אוטומטית אחרי השלמת סט
export const createAutoStartRestAction =
  (set: any, get: any) =>
  (exerciseType?: string): void => {
    const state = get() as WorkoutState;

    // לא להתחיל מנוחה אם כבר במנוחה
    if (state.isResting) {
      return;
    }

    // קבע זמן מנוחה לפי סוג התרגיל
    let restTime = DEFAULT_REST_TIME;

    switch (exerciseType?.toLowerCase()) {
      case "strength":
      case "powerlifting":
        restTime = 180; // 3 דקות
        break;
      case "cardio":
      case "endurance":
        restTime = 60; // דקה
        break;
      case "circuit":
        restTime = 30; // 30 שניות
        break;
      default:
        restTime = DEFAULT_REST_TIME; // 90 שניות
    }

    const startRest = createStartRestAction(set, get);
    startRest(restTime);

    console.log(
      `⚡ Auto-started rest for ${exerciseType || "default"}: ${restTime}s`
    );
  };
