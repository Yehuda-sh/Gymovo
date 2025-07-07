// src/stores/workoutStore.ts - Store מלא ומעודכן לניהול אימונים

import { produce } from "immer";
import { create } from "zustand";
import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";
import { Workout, WorkoutExercise, WorkoutSet } from "../types/workout";

// ממשק מלא למצב ה-store
export interface WorkoutState {
  // 🏋️ מצב אימון פעיל
  activeWorkout: Workout | null;
  currentExerciseIndex: number;
  isResting: boolean;
  restTimeLeft: number;
  restTimer: NodeJS.Timeout | null;

  // 📊 סטטיסטיקות אימון
  currentWorkoutStats: {
    startTime: Date | null;
    duration: number; // בדקות
    completedSets: number;
    totalSets: number;
    calories: number;
  };

  // 🎯 פעולות אימון
  startWorkout: (workout: Workout, plan?: Plan) => void;
  startCustomWorkout: (exercises: Exercise[]) => Promise<void>;
  updateSet: (
    exerciseId: string,
    setId: string,
    values: { weight?: number; reps?: number }
  ) => void;
  toggleSetCompleted: (exerciseId: string, setId: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;

  // 📱 ניווט בין תרגילים
  goToNextExercise: () => boolean;
  goToPrevExercise: () => void;
  goToExercise: (index: number) => void;

  // ⏱️ ניהול מנוחה
  startRest: (duration?: number) => void;
  skipRest: () => void;
  pauseRest: () => void;
  resumeRest: () => void;

  // 🏁 סיום אימון
  finishWorkout: () => Promise<Workout>;
  cancelWorkout: () => void;
  saveWorkoutProgress: () => void;

  // 🔄 איפוס
  resetWorkout: () => void;
}

// ⚙️ קבועים
const DEFAULT_REST_TIME = 90; // שניות
const DEFAULT_SETS_PER_EXERCISE = 3;
const DEFAULT_REPS_PER_SET = 12;

// 🏭 יצירת Store עם Zustand
export const useWorkoutStore = create<WorkoutState>()((set, get) => ({
  // 🏁 מצב התחלתי
  activeWorkout: null,
  currentExerciseIndex: 0,
  isResting: false,
  restTimeLeft: 0,
  restTimer: null,
  currentWorkoutStats: {
    startTime: null,
    duration: 0,
    completedSets: 0,
    totalSets: 0,
    calories: 0,
  },

  // 🚀 התחלת אימון עם תוכנית קיימת
  startWorkout: (workout: Workout, plan?: Plan) => {
    console.log(`🏋️ Starting workout: ${workout.name}`);

    set({
      activeWorkout: {
        ...workout,
        date: new Date().toISOString(),
        id: `workout_${Date.now()}`,
      },
      currentExerciseIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
      currentWorkoutStats: {
        startTime: new Date(),
        duration: 0,
        completedSets: 0,
        totalSets: workout.exercises.reduce(
          (total, ex) => total + ex.sets.length,
          0
        ),
        calories: 0,
      },
    });
  },

  // 🎯 התחלת אימון מותאם עם תרגילים נבחרים
  startCustomWorkout: async (exercises: Exercise[]) => {
    console.log(
      `🎯 Starting custom workout with ${exercises.length} exercises`
    );

    const customWorkout: Workout = {
      id: `custom_workout_${Date.now()}`,
      name: "אימון מותאם",
      date: new Date().toISOString(),
      exercises: exercises.map((exercise, index) => ({
        id: `${exercise.id}_${index}`,
        name: exercise.name,
        exercise: {
          id: exercise.id,
          name: exercise.name,
          category: exercise.category,
        },
        sets: Array.from({ length: DEFAULT_SETS_PER_EXERCISE }, (_, i) => ({
          id: `${exercise.id}_set_${i}`,
          reps: DEFAULT_REPS_PER_SET,
          weight: 0,
          status: "pending" as const,
        })),
      })),
    };

    const totalSets = customWorkout.exercises.reduce(
      (total, ex) => total + ex.sets.length,
      0
    );

    set({
      activeWorkout: customWorkout,
      currentExerciseIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
      currentWorkoutStats: {
        startTime: new Date(),
        duration: 0,
        completedSets: 0,
        totalSets,
        calories: 0,
      },
    });
  },

  // ⚖️ עדכון נתוני סט (משקל/חזרות)
  updateSet: (
    exerciseId: string,
    setId: string,
    values: { weight?: number; reps?: number }
  ) => {
    set(
      produce((state: WorkoutState) => {
        const exercise = state.activeWorkout?.exercises.find(
          (e) => e.id === exerciseId
        );
        if (exercise) {
          const setItem = exercise.sets.find((s) => s.id === setId);
          if (setItem) {
            if (values.reps !== undefined)
              setItem.reps = Math.max(0, values.reps);
            if (values.weight !== undefined)
              setItem.weight = Math.max(0, values.weight);
          }
        }
      })
    );
  },

  // ✅ סימון סט כמושלם/לא מושלם
  toggleSetCompleted: (exerciseId: string, setId: string) => {
    const state = get();
    let shouldStartRest = false;

    set(
      produce((draft: WorkoutState) => {
        const exercise = draft.activeWorkout?.exercises.find(
          (e) => e.id === exerciseId
        );
        const setItem = exercise?.sets.find((s) => s.id === setId);

        if (setItem) {
          const wasCompleted = setItem.status === "completed";
          setItem.status = wasCompleted ? "pending" : "completed";

          // עדכון סטטיסטיקות
          if (wasCompleted) {
            draft.currentWorkoutStats.completedSets--;
          } else {
            draft.currentWorkoutStats.completedSets++;
            shouldStartRest = true;
          }

          // חישוב קלוריות משוער (10 קלוריות לסט)
          draft.currentWorkoutStats.calories =
            draft.currentWorkoutStats.completedSets * 10;
        }
      })
    );

    // התחל מנוחה אם הסט הושלם
    if (shouldStartRest && !state.isResting) {
      get().startRest();
    }
  },

  // ➕ הוספת תרגיל לאימון הפעיל
  addExercise: (exercise: Exercise) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const newExercise: WorkoutExercise = {
            id: `${exercise.id}_${Date.now()}`,
            name: exercise.name,
            exercise: {
              id: exercise.id,
              name: exercise.name,
              category: exercise.category,
            },
            sets: Array.from({ length: DEFAULT_SETS_PER_EXERCISE }, (_, i) => ({
              id: `${exercise.id}_${Date.now()}_set_${i}`,
              reps: DEFAULT_REPS_PER_SET,
              weight: 0,
              status: "pending" as const,
            })),
          };

          state.activeWorkout.exercises.push(newExercise);
          state.currentWorkoutStats.totalSets += DEFAULT_SETS_PER_EXERCISE;
        }
      })
    );
  },

  // ➖ הסרת תרגיל מהאימון
  removeExercise: (exerciseId: string) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exerciseIndex = state.activeWorkout.exercises.findIndex(
            (e) => e.id === exerciseId
          );
          if (exerciseIndex !== -1) {
            const removedExercise =
              state.activeWorkout.exercises[exerciseIndex];

            // עדכון סטטיסטיקות
            const completedSetsInExercise = removedExercise.sets.filter(
              (s) => s.status === "completed"
            ).length;
            state.currentWorkoutStats.completedSets -= completedSetsInExercise;
            state.currentWorkoutStats.totalSets -= removedExercise.sets.length;

            // הסרת התרגיל
            state.activeWorkout.exercises.splice(exerciseIndex, 1);

            // התאמת האינדקס הנוכחי
            if (
              state.currentExerciseIndex >= exerciseIndex &&
              state.currentExerciseIndex > 0
            ) {
              state.currentExerciseIndex--;
            }
          }
        }
      })
    );
  },

  // ➡️ מעבר לתרגיל הבא
  goToNextExercise: () => {
    const state = get();
    if (!state.activeWorkout) return false;

    const nextIndex = state.currentExerciseIndex + 1;
    if (nextIndex < state.activeWorkout.exercises.length) {
      set({ currentExerciseIndex: nextIndex });
      return true;
    }
    return false;
  },

  // ⬅️ מעבר לתרגיל הקודם
  goToPrevExercise: () => {
    const state = get();
    const prevIndex = state.currentExerciseIndex - 1;
    if (prevIndex >= 0) {
      set({ currentExerciseIndex: prevIndex });
    }
  },

  // 🎯 מעבר לתרגיל ספציפי
  goToExercise: (index: number) => {
    const state = get();
    if (
      state.activeWorkout &&
      index >= 0 &&
      index < state.activeWorkout.exercises.length
    ) {
      set({ currentExerciseIndex: index });
    }
  },

  // ⏸️ התחלת מנוחה
  startRest: (duration: number = DEFAULT_REST_TIME) => {
    const state = get();

    // נקה טיימר קודם אם קיים
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    const timer = setInterval(() => {
      const currentState = get();
      if (currentState.restTimeLeft <= 1) {
        clearInterval(timer);
        set({
          isResting: false,
          restTimeLeft: 0,
          restTimer: null,
        });
      } else {
        set({ restTimeLeft: currentState.restTimeLeft - 1 });
      }
    }, 1000);

    set({
      isResting: true,
      restTimeLeft: duration,
      restTimer: timer,
    });
  },

  // ⏭️ דילוג על מנוחה
  skipRest: () => {
    const state = get();
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }
    set({
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
    });
  },

  // ⏸️ השהיית מנוחה
  pauseRest: () => {
    const state = get();
    if (state.restTimer) {
      clearInterval(state.restTimer);
      set({ restTimer: null });
    }
  },

  // ▶️ המשך מנוחה
  resumeRest: () => {
    const state = get();
    if (state.isResting && !state.restTimer && state.restTimeLeft > 0) {
      get().startRest(state.restTimeLeft);
    }
  },

  // 🏁 סיום אימון
  finishWorkout: async (): Promise<Workout> => {
    const state = get();
    if (!state.activeWorkout) {
      throw new Error("No active workout to finish");
    }

    // חישוב משך האימון
    const duration = state.currentWorkoutStats.startTime
      ? Math.round(
          (Date.now() - state.currentWorkoutStats.startTime.getTime()) / 60000
        )
      : 0;

    const finishedWorkout: Workout = {
      ...state.activeWorkout,
      completedAt: new Date().toISOString(),
      duration,
      calories: state.currentWorkoutStats.calories,
    };

    // נקה טיימר אם קיים
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    // שמירת האימון לזיכרון/DB (יתווסף בהמשך)
    try {
      // TODO: שמירה ל-AsyncStorage או API
      console.log(
        `✅ Workout finished: ${finishedWorkout.name}, Duration: ${duration}min`
      );
    } catch (error) {
      console.error("Failed to save workout:", error);
    }

    // איפוס המצב
    set({
      activeWorkout: null,
      currentExerciseIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
      currentWorkoutStats: {
        startTime: null,
        duration: 0,
        completedSets: 0,
        totalSets: 0,
        calories: 0,
      },
    });

    return finishedWorkout;
  },

  // ❌ ביטול אימון
  cancelWorkout: () => {
    const state = get();

    // נקה טיימר אם קיים
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    console.log("❌ Workout cancelled");

    // איפוס מלא
    get().resetWorkout();
  },

  // 💾 שמירת התקדמות
  saveWorkoutProgress: () => {
    const state = get();
    if (state.activeWorkout) {
      try {
        // TODO: שמירה ל-AsyncStorage
        const progressData = {
          workout: state.activeWorkout,
          currentExerciseIndex: state.currentExerciseIndex,
          stats: state.currentWorkoutStats,
          timestamp: Date.now(),
        };
        console.log("💾 Workout progress saved", progressData);
      } catch (error) {
        console.error("Failed to save workout progress:", error);
      }
    }
  },

  // 🔄 איפוס מלא
  resetWorkout: () => {
    const state = get();

    // נקה טיימר אם קיים
    if (state.restTimer) {
      clearInterval(state.restTimer);
    }

    set({
      activeWorkout: null,
      currentExerciseIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
      currentWorkoutStats: {
        startTime: null,
        duration: 0,
        completedSets: 0,
        totalSets: 0,
        calories: 0,
      },
    });
  },
}));
