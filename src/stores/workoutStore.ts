// src/stores/workoutStore.ts - 💪 Store משופר לניהול אימונים

import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";
import { Workout, WorkoutExercise, PersonalRecord } from "../types/workout";
import { useUserStore } from "./userStore";
import {
  getWorkoutHistory,
  saveWorkoutToHistory,
  deleteWorkoutFromHistory,
} from "../data/storage";
import { generateId } from "../utils/idGenerator";

// 📊 ממשק מלא למצב ה-store
export interface WorkoutState {
  // 🏋️ מצב אימון פעיל
  activeWorkout: Workout | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimeLeft: number;
  restTimer: number | null; // שינוי מ-NodeJS.Timeout ל-number
  isPaused: boolean;

  // 📅 היסטוריית אימונים
  workouts: Workout[];
  isLoadingWorkouts: boolean;
  workoutsError: string | null;

  // 📊 סטטיסטיקות אימון
  currentWorkoutStats: {
    startTime: Date | null;
    duration: number;
    completedSets: number;
    totalSets: number;
    calories: number;
    volume: number;
  };

  // 🏆 שיאים אישיים
  personalRecords: PersonalRecord[];

  // 🎯 פעולות אימון
  startWorkout: (workout: Partial<Workout>, plan?: Plan) => void;
  startCustomWorkout: (exercises: Exercise[]) => Promise<void>;
  startEmptyWorkout: () => void;
  updateSet: (
    exerciseId: string,
    setId: string,
    values: { weight?: number; reps?: number; completed?: boolean }
  ) => void;
  toggleSetCompleted: (exerciseId: string, setId: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (exerciseId: string) => void;
  reorderExercises: (fromIndex: number, toIndex: number) => void;

  // 📱 ניווט בין תרגילים
  goToNextExercise: () => boolean;
  goToPrevExercise: () => void;
  goToExercise: (index: number) => void;
  goToNextSet: () => boolean;
  goToPrevSet: () => void;

  // ⏱️ ניהול מנוחה
  startRest: (duration?: number) => void;
  skipRest: () => void;
  pauseRest: () => void;
  resumeRest: () => void;
  updateRestTime: (seconds: number) => void;

  // ⏸️ ניהול אימון
  pauseWorkout: () => void;
  resumeWorkout: () => void;

  // 🏁 סיום אימון
  finishWorkout: () => Promise<Workout>;
  cancelWorkout: () => void;
  saveWorkoutProgress: () => void;

  // 📊 היסטוריה
  loadWorkoutHistory: () => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  updateWorkout: (workoutId: string, updates: Partial<Workout>) => void;

  // 🏆 שיאים אישיים
  checkForPersonalRecords: () => PersonalRecord[];
  clearPersonalRecords: () => void;

  // 🔄 איפוס
  resetWorkout: () => void;
  clearAll: () => void;
}

// ⚙️ קבועים משופרים
const DEFAULT_REST_TIME = 90; // שניות
const DEFAULT_SETS_PER_EXERCISE = 3;
const DEFAULT_REPS_PER_SET = 12;
const CALORIES_PER_SET = 10; // הערכה בסיסית

// 🔧 פונקציות עזר משופרות
const calculateVolume = (exercise: WorkoutExercise): number => {
  return exercise.sets.reduce((total, set) => {
    if (set.status === "completed") {
      const weight = set.actualWeight || set.weight || 0;
      const reps = set.actualReps || set.reps || 0;
      return total + weight * reps;
    }
    return total;
  }, 0);
};

const calculateCalories = (
  exercise: WorkoutExercise,
  duration: number
): number => {
  // חישוב קלוריות מתקדם לפי סוג התרגיל ומשך הזמן
  const baseCalories =
    exercise.sets.filter((s) => s.status === "completed").length *
    CALORIES_PER_SET;
  const intensityMultiplier = 1.0; // יכול להשתנות לפי סוג התרגיל
  return Math.round(baseCalories * intensityMultiplier);
};

// יצירת workout חדש מתוך נתונים חלקיים
const createWorkout = (data: Partial<Workout>, userId: string): Workout => {
  const now = new Date().toISOString();
  return {
    id: data.id || generateId(),
    planId: data.planId || "custom",
    planName: data.planName || "אימון מותאם אישית",
    dayId: data.dayId || "custom",
    dayName: data.dayName || "אימון חופשי",
    exercises: data.exercises || [],
    date: now,
    startTime: now,
    duration: 0,
    status: "active",
    ...data,
  };
};

// 🏭 יצירת Store עם Zustand
export const useWorkoutStore = create<WorkoutState>()(
  devtools(
    persist(
      (set, get) => ({
        // 🏁 מצב התחלתי
        activeWorkout: null,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        isResting: false,
        restTimeLeft: 0,
        restTimer: null,
        isPaused: false,
        workouts: [],
        isLoadingWorkouts: false,
        workoutsError: null,
        personalRecords: [],
        currentWorkoutStats: {
          startTime: null,
          duration: 0,
          completedSets: 0,
          totalSets: 0,
          calories: 0,
          volume: 0,
        },

        // 🚀 התחלת אימון עם תוכנית קיימת
        startWorkout: (workoutData: Partial<Workout>, plan?: Plan) => {
          console.log(
            `🏋️ Starting workout: ${workoutData.planName || "Custom"}`
          );

          const userId = useUserStore.getState().user?.id || "guest";
          const workout = createWorkout(workoutData, userId);

          const totalSets = workout.exercises.reduce(
            (total, ex) => total + ex.sets.length,
            0
          );

          set({
            activeWorkout: workout,
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
        },

        // 🎯 התחלת אימון מותאם עם תרגילים נבחרים
        startCustomWorkout: async (exercises: Exercise[]) => {
          console.log(
            `🎯 Starting custom workout with ${exercises.length} exercises`
          );

          const customWorkout: Partial<Workout> = {
            id: generateId(),
            planName: "אימון מותאם אישית",
            dayName: "אימון חופשי",
            exercises: exercises.map((exercise, index) => ({
              id: `${exercise.id}_${generateId()}`,
              name: exercise.name,
              exercise: {
                id: exercise.id,
                name: exercise.name,
                category: exercise.category,
                primaryMuscle: exercise.targetMuscleGroups?.[0],
                secondaryMuscles: exercise.targetMuscleGroups?.slice(1),
                equipment: Array.isArray(exercise.equipment)
                  ? exercise.equipment.join(", ")
                  : exercise.equipment?.[0],
                difficulty: exercise.difficulty,
              },
              sets: Array.from(
                { length: DEFAULT_SETS_PER_EXERCISE },
                (_, i) => ({
                  id: `set_${i}_${generateId()}`,
                  reps: DEFAULT_REPS_PER_SET,
                  weight: 0,
                  status: "pending" as const,
                })
              ),
              order: index,
              notes: "",
            })),
          };

          get().startWorkout(customWorkout);
        },

        // 🆕 התחלת אימון ריק
        startEmptyWorkout: () => {
          const emptyWorkout: Partial<Workout> = {
            planName: "אימון חדש",
            dayName: "אימון חופשי",
            exercises: [],
          };

          get().startWorkout(emptyWorkout);
        },

        // ⚖️ עדכון נתוני סט משופר
        updateSet: (
          exerciseId: string,
          setId: string,
          values: { weight?: number; reps?: number; completed?: boolean }
        ) => {
          set(
            produce((state: WorkoutState) => {
              const exercise = state.activeWorkout?.exercises.find(
                (e) => e.id === exerciseId
              );
              if (exercise) {
                const setItem = exercise.sets.find((s) => s.id === setId);
                if (setItem) {
                  const previousValues = {
                    weight: setItem.actualWeight || setItem.weight,
                    reps: setItem.actualReps || setItem.reps,
                  };

                  if (values.reps !== undefined) {
                    setItem.reps = Math.max(0, values.reps);
                    setItem.actualReps = values.reps;
                  }
                  if (values.weight !== undefined) {
                    setItem.weight = Math.max(0, values.weight);
                    setItem.actualWeight = values.weight;
                  }
                  if (values.completed !== undefined) {
                    setItem.status = values.completed ? "completed" : "pending";
                    if (values.completed) {
                      setItem.completedAt = new Date();
                      // עדכון סטטיסטיקות
                      const newVolume =
                        (setItem.actualWeight || 0) * (setItem.actualReps || 0);
                      const oldVolume =
                        previousValues.weight * previousValues.reps;
                      state.currentWorkoutStats.volume += newVolume - oldVolume;
                    }
                  }
                }
              }
            })
          );
        },

        // ✅ סימון סט כמושלם/לא מושלם משופר
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

                if (!wasCompleted) {
                  setItem.completedAt = new Date();
                  setItem.actualReps = setItem.actualReps || setItem.reps;
                  setItem.actualWeight = setItem.actualWeight || setItem.weight;
                  draft.currentWorkoutStats.completedSets++;
                  shouldStartRest = true;

                  // חישוב נפח
                  const volume =
                    (setItem.actualWeight || 0) * (setItem.actualReps || 0);
                  draft.currentWorkoutStats.volume += volume;
                } else {
                  draft.currentWorkoutStats.completedSets--;
                  const volume =
                    (setItem.actualWeight || 0) * (setItem.actualReps || 0);
                  draft.currentWorkoutStats.volume -= volume;
                }

                // חישוב קלוריות
                if (exercise && draft.currentWorkoutStats.startTime) {
                  const duration = Math.round(
                    (Date.now() -
                      draft.currentWorkoutStats.startTime.getTime()) /
                      60000
                  );
                  draft.currentWorkoutStats.calories = calculateCalories(
                    exercise,
                    duration
                  );
                }
              }
            })
          );

          // התחל מנוחה אם הסט הושלם
          if (shouldStartRest && !state.isResting) {
            get().startRest();
          }

          // בדוק שיאים אישיים
          get().checkForPersonalRecords();
        },

        // ➕ הוספת תרגיל לאימון הפעיל משופרת
        addExercise: (exercise: Exercise) => {
          set(
            produce((state: WorkoutState) => {
              if (state.activeWorkout) {
                const newExercise: WorkoutExercise = {
                  id: `${exercise.id}_${generateId()}`,
                  name: exercise.name,
                  exercise: {
                    id: exercise.id,
                    name: exercise.name,
                    category: exercise.category,
                    primaryMuscle: exercise.targetMuscleGroups?.[0],
                    secondaryMuscles: exercise.targetMuscleGroups?.slice(1),
                    equipment: Array.isArray(exercise.equipment)
                      ? exercise.equipment.join(", ")
                      : exercise.equipment?.[0],
                    difficulty: exercise.difficulty,
                  },
                  sets: Array.from(
                    { length: DEFAULT_SETS_PER_EXERCISE },
                    (_, i) => ({
                      id: `set_${i}_${generateId()}`,
                      reps: DEFAULT_REPS_PER_SET,
                      weight: 0,
                      status: "pending" as const,
                    })
                  ),
                  order: state.activeWorkout.exercises.length,
                  notes: "",
                };

                state.activeWorkout.exercises.push(newExercise);
                state.currentWorkoutStats.totalSets +=
                  DEFAULT_SETS_PER_EXERCISE;
              }
            })
          );
        },

        // ➖ הסרת תרגיל מהאימון משופרת
        removeExercise: (exerciseId: string) => {
          set(
            produce((state: WorkoutState) => {
              if (state.activeWorkout) {
                const exerciseIndex = state.activeWorkout.exercises.findIndex(
                  (e) => e.id === exerciseId
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
                }
              }
            })
          );
        },

        // 🔄 שינוי סדר תרגילים משופר
        reorderExercises: (fromIndex: number, toIndex: number) => {
          set(
            produce((state: WorkoutState) => {
              if (
                state.activeWorkout &&
                state.activeWorkout.exercises.length > 1
              ) {
                const exercises = state.activeWorkout.exercises;

                // בדיקת תקינות אינדקסים
                if (
                  fromIndex < 0 ||
                  fromIndex >= exercises.length ||
                  toIndex < 0 ||
                  toIndex >= exercises.length ||
                  fromIndex === toIndex
                ) {
                  return;
                }

                const [removed] = exercises.splice(fromIndex, 1);
                exercises.splice(toIndex, 0, removed);

                // עדכון סדר
                exercises.forEach((ex, idx) => {
                  ex.order = idx;
                });

                // עדכון אינדקס נוכחי אם צריך
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
              }
            })
          );
        },

        // ⏭️ מעבר לתרגיל הבא משופר
        goToNextExercise: () => {
          const state = get();
          if (!state.activeWorkout) return false;

          const nextIndex = state.currentExerciseIndex + 1;
          if (nextIndex < state.activeWorkout.exercises.length) {
            // נקה טיימר מנוחה אם קיים
            if (state.restTimer) {
              clearInterval(state.restTimer);
            }

            set({
              currentExerciseIndex: nextIndex,
              currentSetIndex: 0,
              isResting: false,
              restTimeLeft: 0,
              restTimer: null,
            });
            return true;
          }
          return false;
        },

        // ⏮️ מעבר לתרגיל הקודם
        goToPrevExercise: () => {
          const state = get();
          if (!state.activeWorkout) return;

          const prevIndex = state.currentExerciseIndex - 1;
          if (prevIndex >= 0) {
            // נקה טיימר מנוחה אם קיים
            if (state.restTimer) {
              clearInterval(state.restTimer);
            }

            set({
              currentExerciseIndex: prevIndex,
              currentSetIndex: 0,
              isResting: false,
              restTimeLeft: 0,
              restTimer: null,
            });
          }
        },

        // 📍 מעבר לתרגיל ספציפי
        goToExercise: (index: number) => {
          const state = get();
          if (!state.activeWorkout) return;

          if (index >= 0 && index < state.activeWorkout.exercises.length) {
            // נקה טיימר מנוחה אם קיים
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
          }
        },

        // ⏭️ מעבר לסט הבא
        goToNextSet: () => {
          const state = get();
          if (!state.activeWorkout) return false;

          const currentExercise =
            state.activeWorkout.exercises[state.currentExerciseIndex];
          if (!currentExercise) return false;

          const nextSetIndex = state.currentSetIndex + 1;
          if (nextSetIndex < currentExercise.sets.length) {
            set({ currentSetIndex: nextSetIndex });
            return true;
          }

          // אם אין עוד סטים, נסה לעבור לתרגיל הבא
          return get().goToNextExercise();
        },

        // ⏮️ מעבר לסט הקודם
        goToPrevSet: () => {
          const state = get();
          if (!state.activeWorkout) return;

          const prevSetIndex = state.currentSetIndex - 1;
          if (prevSetIndex >= 0) {
            set({ currentSetIndex: prevSetIndex });
          } else {
            // אם אנחנו בסט הראשון, נסה לעבור לתרגיל הקודם
            const prevExerciseIndex = state.currentExerciseIndex - 1;
            if (prevExerciseIndex >= 0) {
              const prevExercise =
                state.activeWorkout.exercises[prevExerciseIndex];
              set({
                currentExerciseIndex: prevExerciseIndex,
                currentSetIndex: prevExercise.sets.length - 1,
              });
            }
          }
        },

        // ⏱️ התחלת מנוחה משופרת
        startRest: (duration?: number) => {
          const state = get();
          const restDuration = duration || DEFAULT_REST_TIME;

          // נקה טיימר קיים
          if (state.restTimer) {
            clearInterval(state.restTimer);
          }

          set({
            isResting: true,
            restTimeLeft: restDuration,
            isPaused: false,
          });

          const timer = setInterval(() => {
            const currentState = get();
            if (!currentState.isPaused && currentState.restTimeLeft > 0) {
              set({ restTimeLeft: currentState.restTimeLeft - 1 });
            } else if (currentState.restTimeLeft <= 0) {
              clearInterval(timer);
              set({
                isResting: false,
                restTimeLeft: 0,
                restTimer: null,
              });

              // השמע צליל או רטט כשהמנוחה נגמרת
              if (typeof window !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(200);
              }
            }
          }, 1000);

          set({ restTimer: timer as any });
        },

        // ⏭️ דילוג על המנוחה
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
          set({ isPaused: true });
        },

        // ▶️ המשך מנוחה
        resumeRest: () => {
          set({ isPaused: false });
        },

        // 🕐 עדכון זמן מנוחה
        updateRestTime: (seconds: number) => {
          set({ restTimeLeft: Math.max(0, seconds) });
        },

        // ⏸️ השהיית אימון
        pauseWorkout: () => {
          set({ isPaused: true });
        },

        // ▶️ המשך אימון
        resumeWorkout: () => {
          set({ isPaused: false });
        },

        // 🏁 סיום אימון משופר
        finishWorkout: async () => {
          const state = get();
          if (!state.activeWorkout) {
            throw new Error("No active workout to finish");
          }

          const duration = state.currentWorkoutStats.startTime
            ? Math.round(
                (Date.now() - state.currentWorkoutStats.startTime.getTime()) /
                  60000
              )
            : 0;

          const completedExercisesCount = state.activeWorkout.exercises.filter(
            (ex) => ex.sets.some((s) => s.status === "completed")
          ).length;

          const finishedWorkout: Workout = {
            ...state.activeWorkout,
            endTime: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            duration,
            status: "completed",
            totalVolume: state.currentWorkoutStats.volume,
            totalSets: state.currentWorkoutStats.totalSets,
            caloriesBurned: state.currentWorkoutStats.calories,
            rating: 0, // יתווסף לאחר מכן על ידי המשתמש
            notes: "",
          };

          // נקה טיימר אם קיים
          if (state.restTimer) {
            clearInterval(state.restTimer);
          }

          // שמירת האימון
          try {
            const userId = useUserStore.getState().user?.id || "guest";
            await saveWorkoutToHistory(userId, finishedWorkout);
            console.log(
              `✅ Workout finished: ${finishedWorkout.planName}, Duration: ${duration}min`
            );

            // הוסף להיסטוריה
            set(
              produce((draft: WorkoutState) => {
                draft.workouts.unshift(finishedWorkout);
              })
            );

            // בדוק שיאים אישיים סופיים
            const records = get().checkForPersonalRecords();
            if (records.length > 0) {
              console.log(`🏆 New personal records: ${records.length}`);
            }
          } catch (error) {
            console.error("Failed to save workout:", error);
            throw error;
          }

          // איפוס המצב
          get().resetWorkout();

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

        // 💾 שמירת התקדמות משופרת
        saveWorkoutProgress: () => {
          const state = get();
          if (state.activeWorkout) {
            try {
              const progressData = {
                workout: state.activeWorkout,
                currentExerciseIndex: state.currentExerciseIndex,
                currentSetIndex: state.currentSetIndex,
                stats: state.currentWorkoutStats,
                timestamp: Date.now(),
              };

              // שמירה ל-AsyncStorage
              const key = `workout_progress_${state.activeWorkout.id}`;
              AsyncStorage.setItem(key, JSON.stringify(progressData))
                .then(() => console.log("💾 Workout progress saved"))
                .catch((error) =>
                  console.error("Failed to save progress:", error)
                );
            } catch (error) {
              console.error("Failed to save workout progress:", error);
            }
          }
        },

        // 📊 טעינת היסטוריית אימונים
        loadWorkoutHistory: async () => {
          set({ isLoadingWorkouts: true, workoutsError: null });

          try {
            const userId = useUserStore.getState().user?.id;
            if (!userId) {
              throw new Error("No user ID available");
            }

            const history = await getWorkoutHistory(userId);
            set({
              workouts: history.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              ),
              isLoadingWorkouts: false,
            });
          } catch (error) {
            console.error("Failed to load workout history:", error);
            set({
              workoutsError: "Failed to load workouts",
              isLoadingWorkouts: false,
            });
          }
        },

        // 🗑️ מחיקת אימון
        deleteWorkout: async (workoutId: string) => {
          try {
            const userId = useUserStore.getState().user?.id || "guest";
            await deleteWorkoutFromHistory(userId, workoutId);

            set(
              produce((state: WorkoutState) => {
                state.workouts = state.workouts.filter(
                  (w) => w.id !== workoutId
                );
              })
            );

            console.log(`🗑️ Workout ${workoutId} deleted`);
          } catch (error) {
            console.error("Failed to delete workout:", error);
            throw error;
          }
        },

        // ✏️ עדכון אימון
        updateWorkout: (workoutId: string, updates: Partial<Workout>) => {
          set(
            produce((state: WorkoutState) => {
              const workoutIndex = state.workouts.findIndex(
                (w) => w.id === workoutId
              );
              if (workoutIndex !== -1) {
                state.workouts[workoutIndex] = {
                  ...state.workouts[workoutIndex],
                  ...updates,
                };
              }
            })
          );
        },

        // 🏆 בדיקת שיאים אישיים משופרת
        checkForPersonalRecords: () => {
          const state = get();
          if (!state.activeWorkout) return [];

          const newRecords: PersonalRecord[] = [];
          const currentDate = new Date();

          state.activeWorkout.exercises.forEach((exercise) => {
            const completedSets = exercise.sets.filter(
              (s) => s.status === "completed"
            );

            completedSets.forEach((set) => {
              const weight = set.actualWeight || 0;
              const reps = set.actualReps || 0;

              // בדוק שיא משקל (1RM)
              const existing1RMRecord = state.personalRecords.find(
                (pr) =>
                  pr.exerciseId === exercise.exercise.id && pr.type === "1RM"
              );

              if (!existing1RMRecord || weight > existing1RMRecord.value) {
                newRecords.push({
                  exerciseId: exercise.exercise.id,
                  exerciseName: exercise.name,
                  type: "1RM",
                  value: weight,
                  previousValue: existing1RMRecord?.value,
                  achievedAt: currentDate,
                });
              }

              // בדוק שיא חזרות
              const existingRepsRecord = state.personalRecords.find(
                (pr) =>
                  pr.exerciseId === exercise.exercise.id && pr.type === "reps"
              );

              if (!existingRepsRecord || reps > existingRepsRecord.value) {
                newRecords.push({
                  exerciseId: exercise.exercise.id,
                  exerciseName: exercise.name,
                  type: "reps",
                  value: reps,
                  previousValue: existingRepsRecord?.value,
                  achievedAt: currentDate,
                });
              }

              // בדוק שיא נפח (Volume = Weight × Reps)
              const volume = weight * reps;
              const existingVolumeRecord = state.personalRecords.find(
                (pr) =>
                  pr.exerciseId === exercise.exercise.id && pr.type === "volume"
              );

              if (
                !existingVolumeRecord ||
                volume > existingVolumeRecord.value
              ) {
                newRecords.push({
                  exerciseId: exercise.exercise.id,
                  exerciseName: exercise.name,
                  type: "volume",
                  value: volume,
                  previousValue: existingVolumeRecord?.value,
                  achievedAt: currentDate,
                });
              }
            });
          });

          if (newRecords.length > 0) {
            set(
              produce((draft: WorkoutState) => {
                // עדכן או הוסף שיאים חדשים
                newRecords.forEach((newRecord) => {
                  const existingIndex = draft.personalRecords.findIndex(
                    (pr) =>
                      pr.exerciseId === newRecord.exerciseId &&
                      pr.type === newRecord.type
                  );

                  if (existingIndex >= 0) {
                    draft.personalRecords[existingIndex] = newRecord;
                  } else {
                    draft.personalRecords.push(newRecord);
                  }
                });
              })
            );
          }

          return newRecords;
        },

        // 🧹 ניקוי שיאים אישיים
        clearPersonalRecords: () => {
          set({ personalRecords: [] });
        },

        // 🔄 איפוס אימון פעיל
        resetWorkout: () => {
          const state = get();

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
        },

        // 🧹 ניקוי כל הנתונים
        clearAll: () => {
          const state = get();

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
            workouts: [],
            isLoadingWorkouts: false,
            workoutsError: null,
            personalRecords: [],
            currentWorkoutStats: {
              startTime: null,
              duration: 0,
              completedSets: 0,
              totalSets: 0,
              calories: 0,
              volume: 0,
            },
          });
        },
      }),
      {
        name: "workout-storage",
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          // שמור רק את ההיסטוריה והשיאים
          workouts: state.workouts.slice(0, 50), // שמור רק 50 אימונים אחרונים
          personalRecords: state.personalRecords,
        }),
      }
    ),
    {
      name: "workout-store",
    }
  )
);
