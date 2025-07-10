// src/stores/workout-store/actions/index.ts
// 🎯 פעולות אימון ראשיות - התחלה, עדכון, הוספה, הסרה

import { produce } from "immer";
import { Exercise } from "../../../types/exercise";
import { Plan } from "../../../types/plan";
import { Workout, WorkoutExercise } from "../../../types/workout";
import { useUserStore } from "../../userStore";
import { generateId } from "../../../utils/idGenerator";
import {
  DEFAULT_SETS_PER_EXERCISE,
  DEFAULT_REPS_PER_SET,
  CALORIES_PER_SET,
  calculateVolume,
  generateSetId,
} from "../constants";
import { WorkoutState } from "../types";

// יבוא פעולות תרגילים
export * from "./exercises";

// 🚀 התחלת אימון עם תוכנית קיימת
export const createStartWorkoutAction =
  (set: any, get: any) => (workout: Workout, plan?: Plan) => {
    console.log(`🏋️ Starting workout: ${workout.name}`);

    const totalSets = workout.exercises.reduce(
      (total, ex) => total + ex.sets.length,
      0
    );

    set({
      activeWorkout: {
        ...workout,
        id: generateId(),
        date: new Date(),
        startedAt: new Date().toISOString(),
        planId: plan?.id,
        userId: useUserStore.getState().user?.id || "guest",
        completedExercises: 0,
        totalExercises: workout.exercises.length,
      },
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isResting: false,
      restTimeLeft: 0,
      restTimer: null,
      isPaused: false,
      currentWorkoutStats: {
        startTime: new Date(),
        duration: 0,
        completedSets: 0,
        totalSets,
        calories: 0,
        volume: 0,
      },
    });
  };

// 🎯 התחלת אימון מותאם עם תרגילים נבחרים
export const createStartCustomWorkoutAction =
  (set: any, get: any) => async (exercises: Exercise[]) => {
    console.log(
      `🎯 Starting custom workout with ${exercises.length} exercises`
    );

    const userId = useUserStore.getState().user?.id || "guest-user";

    const customWorkout: Workout = {
      id: generateId(),
      name: "אימון מותאם אישית",
      date: new Date(),
      userId: userId,
      startedAt: new Date().toISOString(),
      exercises: exercises.map((exercise, index) => ({
        id: `${exercise.id}_${generateId()}`,
        name: exercise.name,
        exercise: exercise,
        sets: Array.from({ length: DEFAULT_SETS_PER_EXERCISE }, (_, i) => ({
          id: generateSetId(exercise.id, i),
          reps: DEFAULT_REPS_PER_SET,
          weight: 0,
          status: "pending" as const,
        })),
        order: index,
        notes: "",
      })),
      completedExercises: 0,
      totalExercises: exercises.length,
      duration: 0,
      difficulty: "intermediate",
      targetMuscles: [],
    };

    // השתמש בפעולת ההתחלה הרגילה
    const startWorkout = createStartWorkoutAction(set, get);
    startWorkout(customWorkout);
  };

// 🏁 התחלת אימון ריק
export const createStartEmptyWorkoutAction = (set: any, get: any) => () => {
  console.log("🏁 Starting empty workout");

  const userId = useUserStore.getState().user?.id || "guest-user";

  const emptyWorkout: Workout = {
    id: generateId(),
    name: "אימון חדש",
    date: new Date(),
    userId: userId,
    startedAt: new Date().toISOString(),
    exercises: [],
    completedExercises: 0,
    totalExercises: 0,
    duration: 0,
    difficulty: "intermediate",
    targetMuscles: [],
  };

  set({
    activeWorkout: emptyWorkout,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    isResting: false,
    restTimeLeft: 0,
    restTimer: null,
    isPaused: false,
    currentWorkoutStats: {
      startTime: new Date(),
      duration: 0,
      completedSets: 0,
      totalSets: 0,
      calories: 0,
      volume: 0,
    },
  });
};

// ✏️ עדכון סט
export const createUpdateSetAction =
  (set: any, get: any) =>
  (
    exerciseId: string,
    setId: string,
    values: { weight?: number; reps?: number; completed?: boolean }
  ) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exerciseIndex = state.activeWorkout.exercises.findIndex(
            (ex) => ex.id === exerciseId
          );

          if (exerciseIndex !== -1) {
            const exercise = state.activeWorkout.exercises[exerciseIndex];
            const setIndex = exercise.sets.findIndex((s) => s.id === setId);

            if (setIndex !== -1) {
              const set = exercise.sets[setIndex];
              const wasCompleted = set.status === "completed";

              // עדכון ערכי הסט
              if (values.weight !== undefined) {
                set.actualWeight = values.weight;
              }
              if (values.reps !== undefined) {
                set.actualReps = values.reps;
              }
              if (values.completed !== undefined) {
                set.status = values.completed ? "completed" : "pending";
              }

              // עדכון סטטיסטיקות אם הסט הושלם או בוטל
              const isNowCompleted = set.status === "completed";
              if (isNowCompleted && !wasCompleted) {
                // סט חדש הושלם
                state.currentWorkoutStats.completedSets++;
                state.currentWorkoutStats.calories =
                  state.currentWorkoutStats.completedSets * CALORIES_PER_SET;
              } else if (!isNowCompleted && wasCompleted) {
                // סט בוטל
                state.currentWorkoutStats.completedSets--;
                state.currentWorkoutStats.calories =
                  state.currentWorkoutStats.completedSets * CALORIES_PER_SET;
              }

              // עדכון נפח
              const exerciseVolume = calculateVolume(exercise);
              state.currentWorkoutStats.volume =
                state.activeWorkout.exercises.reduce(
                  (total, ex) => total + calculateVolume(ex),
                  0
                );

              console.log(`✏️ Set updated: ${setId}`, {
                values,
                newVolume: exerciseVolume,
              });
            }
          }
        }
      })
    );
  };

// ✅ החלפת מצב השלמת סט
export const createToggleSetCompletedAction =
  (set: any, get: any) => (exerciseId: string, setId: string) => {
    const updateSet = createUpdateSetAction(set, get);
    const state = get();

    if (state.activeWorkout) {
      const exercise = state.activeWorkout.exercises.find(
        (ex) => ex.id === exerciseId
      );
      if (exercise) {
        const setToToggle = exercise.sets.find((s) => s.id === setId);
        if (setToToggle) {
          const newCompleted = setToToggle.status !== "completed";
          updateSet(exerciseId, setId, { completed: newCompleted });
        }
      }
    }
  };
