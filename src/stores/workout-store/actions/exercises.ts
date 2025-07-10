// src/stores/workout-store/actions/exercises.ts
// 🏋️ פעולות ניהול תרגילים - הוספה, הסרה, סידור מחדש

import { produce } from "immer";
import { Exercise } from "../../../types/exercise";
import { generateId } from "../../../utils/idGenerator";
import {
  DEFAULT_SETS_PER_EXERCISE,
  DEFAULT_REPS_PER_SET,
  CALORIES_PER_SET,
  calculateVolume,
  generateSetId,
} from "../constants";
import { WorkoutState } from "../types";

// ➕ הוספת תרגיל חדש לאימון
export const createAddExerciseAction =
  (set: any, get: any) => (exercise: Exercise) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const newExercise = {
            id: `${exercise.id}_${generateId()}`,
            name: exercise.name,
            exercise: exercise,
            sets: Array.from({ length: DEFAULT_SETS_PER_EXERCISE }, (_, i) => ({
              id: generateSetId(exercise.id, i),
              reps: DEFAULT_REPS_PER_SET,
              weight: 0,
              status: "pending" as const,
            })),
            order: state.activeWorkout.exercises.length,
            notes: "",
          };

          state.activeWorkout.exercises.push(newExercise);
          state.activeWorkout.totalExercises =
            state.activeWorkout.exercises.length;

          // עדכון סטטיסטיקות
          state.currentWorkoutStats.totalSets += DEFAULT_SETS_PER_EXERCISE;

          console.log(`➕ Exercise added: ${exercise.name}`);
        }
      })
    );
  };

// ➖ הסרת תרגיל מהאימון
export const createRemoveExerciseAction =
  (set: any, get: any) => (exerciseId: string) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exerciseIndex = state.activeWorkout.exercises.findIndex(
            (ex) => ex.id === exerciseId
          );

          if (exerciseIndex !== -1) {
            const exercise = state.activeWorkout.exercises[exerciseIndex];

            // עדכון סטטיסטיקות
            const completedSets = exercise.sets.filter(
              (s) => s.status === "completed"
            ).length;
            state.currentWorkoutStats.completedSets -= completedSets;
            state.currentWorkoutStats.totalSets -= exercise.sets.length;

            // חישוב נפח להסרה
            const volumeToRemove = calculateVolume(exercise);
            state.currentWorkoutStats.volume -= volumeToRemove;

            // הסרת התרגיל
            state.activeWorkout.exercises.splice(exerciseIndex, 1);
            state.activeWorkout.totalExercises =
              state.activeWorkout.exercises.length;

            // עדכון אינדקס אם צריך
            if (
              state.currentExerciseIndex >=
                state.activeWorkout.exercises.length &&
              state.currentExerciseIndex > 0
            ) {
              state.currentExerciseIndex--;
            }

            // עדכון סדר התרגילים
            state.activeWorkout.exercises.forEach((ex, idx) => {
              ex.order = idx;
            });

            // עדכון קלוריות
            state.currentWorkoutStats.calories =
              state.currentWorkoutStats.completedSets * CALORIES_PER_SET;

            console.log(`➖ Exercise removed: ${exerciseId}`);
          }
        }
      })
    );
  };

// 🔄 שינוי סדר תרגילים
export const createReorderExercisesAction =
  (set: any, get: any) => (fromIndex: number, toIndex: number) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exercises = state.activeWorkout.exercises;

          // בדיקת תקינות אינדקסים
          if (
            fromIndex < 0 ||
            fromIndex >= exercises.length ||
            toIndex < 0 ||
            toIndex >= exercises.length
          ) {
            console.warn(
              `🔄 Invalid reorder indices: ${fromIndex} -> ${toIndex}`
            );
            return;
          }

          // ביצוע הסידור מחדש
          const [removed] = exercises.splice(fromIndex, 1);
          exercises.splice(toIndex, 0, removed);

          // עדכון סדר
          exercises.forEach((ex, idx) => {
            ex.order = idx;
          });

          // עדכון אינדקס התרגיל הנוכחי אם נדרש
          if (state.currentExerciseIndex === fromIndex) {
            state.currentExerciseIndex = toIndex;
          } else if (
            fromIndex < state.currentExerciseIndex &&
            toIndex >= state.currentExerciseIndex
          ) {
            state.currentExerciseIndex--;
          } else if (
            fromIndex > state.currentExerciseIndex &&
            toIndex <= state.currentExerciseIndex
          ) {
            state.currentExerciseIndex++;
          }

          console.log(`🔄 Exercises reordered: ${fromIndex} -> ${toIndex}`);
        }
      })
    );
  };

// 📝 עדכון הערות תרגיל
export const createUpdateExerciseNotesAction =
  (set: any, get: any) => (exerciseId: string, notes: string) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exercise = state.activeWorkout.exercises.find(
            (ex) => ex.id === exerciseId
          );
          if (exercise) {
            exercise.notes = notes;
            console.log(`📝 Exercise notes updated: ${exerciseId}`);
          }
        }
      })
    );
  };

// 🔢 הוספת סט נוסף לתרגיל
export const createAddSetToExerciseAction =
  (set: any, get: any) => (exerciseId: string) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exercise = state.activeWorkout.exercises.find(
            (ex) => ex.id === exerciseId
          );
          if (exercise) {
            const newSetIndex = exercise.sets.length;
            const newSet = {
              id: generateSetId(exerciseId, newSetIndex),
              reps: DEFAULT_REPS_PER_SET,
              weight:
                exercise.sets.length > 0
                  ? exercise.sets[exercise.sets.length - 1].weight
                  : 0,
              status: "pending" as const,
            };

            exercise.sets.push(newSet);
            state.currentWorkoutStats.totalSets++;

            console.log(`🔢 Set added to exercise: ${exerciseId}`);
          }
        }
      })
    );
  };

// ➖ הסרת סט מתרגיל
export const createRemoveSetFromExerciseAction =
  (set: any, get: any) => (exerciseId: string, setId: string) => {
    set(
      produce((state: WorkoutState) => {
        if (state.activeWorkout) {
          const exercise = state.activeWorkout.exercises.find(
            (ex) => ex.id === exerciseId
          );
          if (exercise && exercise.sets.length > 1) {
            // לא לאפשר מחיקה אם יש רק סט אחד
            const setIndex = exercise.sets.findIndex((s) => s.id === setId);
            if (setIndex !== -1) {
              const removedSet = exercise.sets[setIndex];

              // עדכון סטטיסטיקות אם הסט היה מושלם
              if (removedSet.status === "completed") {
                state.currentWorkoutStats.completedSets--;
                const volume =
                  (removedSet.actualWeight || 0) * (removedSet.actualReps || 0);
                state.currentWorkoutStats.volume -= volume;
                state.currentWorkoutStats.calories =
                  state.currentWorkoutStats.completedSets * CALORIES_PER_SET;
              }

              exercise.sets.splice(setIndex, 1);
              state.currentWorkoutStats.totalSets--;

              console.log(`➖ Set removed from exercise: ${exerciseId}`);
            }
          }
        }
      })
    );
  };
