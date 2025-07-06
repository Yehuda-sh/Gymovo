// src/stores/workoutStore.ts

import { produce } from "immer";
import { create } from "zustand";
import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";
import { Workout, WorkoutExercise, WorkoutSet } from "../types/workout";

// הממשק שמגדיר את כל המידע והפעולות ב-store של אימון פעיל
export interface WorkoutState {
  activeWorkout: Workout | null;
  currentExerciseIndex: number;
  isResting: boolean;
  restTimeLeft: number;

  startWorkout: (plan: Plan, dayId: string) => void;
  updateSet: (
    exId: string,
    setId: string,
    values: { weight?: number; reps?: number }
  ) => void;
  toggleSetCompleted: (exId: string, setId: string) => void;
  goToNextExercise: () => boolean;
  goToPrevExercise: () => void;
  addExercise: (exercise: Exercise) => void;
  finishWorkout: () => void;
}

// קבוע עבור אורך זמן המנוחה בשניות
const REST_DURATION_SECONDS = 90;

// יצירת ה-store עם Zustand ו-Immer
export const useWorkoutStore = create<WorkoutState>()((set, get) => ({
  activeWorkout: null,
  currentExerciseIndex: 0,
  isResting: false,
  restTimeLeft: 0,

  // פעולה להתחלת אימון חדש על בסיס יום ספציפי מתוכנית
  startWorkout: (plan, dayId) => {
    const selectedDay = plan.days.find((day) => day.id === dayId);
    if (!selectedDay) {
      console.error("Day not found in plan!");
      return;
    }
    const newWorkout: Workout = {
      id: `workout_${Date.now()}`,
      name: `${plan.name} - ${selectedDay.name}`,
      date: new Date().toISOString(),
      exercises: selectedDay.exercises.map((planEx) => ({
        id: planEx.id,
        exercise: { id: planEx.id, name: planEx.name },
        sets: Array.from({ length: planEx.sets }, (_, i) => ({
          id: `${planEx.id}_set_${i}`,
          reps: planEx.reps,
          weight: 0,
          status: "pending",
        })),
      })),
    };
    set({
      activeWorkout: newWorkout,
      currentExerciseIndex: 0,
      isResting: false,
      restTimeLeft: 0,
    });
  },

  // עדכון סט ספציפי (משקל או חזרות)
  updateSet: (exId, setId, values) =>
    set(
      produce((state: WorkoutState) => {
        const exercise = state.activeWorkout?.exercises.find(
          (e: WorkoutExercise) => e.id === exId
        );
        if (exercise) {
          const setItem = exercise.sets.find((s: WorkoutSet) => s.id === setId);
          if (setItem) {
            if (values.reps !== undefined) setItem.reps = values.reps;
            if (values.weight !== undefined) setItem.weight = values.weight;
          }
        }
      })
    ),

  // שינוי סטטוס של סט (בוצע / לא בוצע) והפעלת טיימר
  toggleSetCompleted: (exId, setId) => {
    let shouldStartTimer = false;
    set(
      produce((state: WorkoutState) => {
        const exercise = state.activeWorkout?.exercises.find(
          (e: WorkoutExercise) => e.id === exId
        );
        const setItem = exercise?.sets.find((s: WorkoutSet) => s.id === setId);
        if (setItem) {
          const newStatus =
            setItem.status === "completed" ? "pending" : "completed";
          setItem.status = newStatus;
          if (newStatus === "completed") {
            shouldStartTimer = true;
          }
        }
      })
    );

    // אם צריך להתחיל טיימר, מפעילים אותו
    if (shouldStartTimer) {
      set({ isResting: true, restTimeLeft: REST_DURATION_SECONDS });
      const interval = setInterval(() => {
        const { restTimeLeft: currentTime, isResting } = get();
        if (!isResting || currentTime <= 1) {
          clearInterval(interval);
          set({ isResting: false, restTimeLeft: 0 });
        } else {
          set({ restTimeLeft: currentTime - 1 });
        }
      }, 1000);
    }
  },

  // מעבר לתרגיל הבא באימון
  goToNextExercise: () => {
    const { activeWorkout, currentExerciseIndex } = get();
    if (
      activeWorkout &&
      currentExerciseIndex < activeWorkout.exercises.length - 1
    ) {
      set({ currentExerciseIndex: currentExerciseIndex + 1 });
      return true;
    }
    return false;
  },

  // חזרה לתרגיל הקודם באימון
  goToPrevExercise: () => {
    const { currentExerciseIndex } = get();
    if (currentExerciseIndex > 0) {
      set({ currentExerciseIndex: currentExerciseIndex - 1 });
    }
  },

  // הוספת תרגיל חדש לאימון הפעיל
  addExercise: (exercise) =>
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exerciseExists = state.activeWorkout.exercises.some(
            (e) => e.exercise.id === exercise.id
          );
          if (!exerciseExists) {
            state.activeWorkout.exercises.push({
              id: exercise.id,
              exercise: exercise,
              sets: [
                {
                  id: `${exercise.id}_set_0`,
                  reps: 8,
                  weight: 10,
                  status: "pending",
                },
              ],
            });
          }
        }
      })
    ),

  // סיום וניקוי האימון הפעיל
  finishWorkout: () =>
    set({
      activeWorkout: null,
      currentExerciseIndex: 0,
      isResting: false,
      restTimeLeft: 0,
    }),
}));
