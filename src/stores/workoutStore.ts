// src/stores/workoutStore.ts - 💪 Store מלא ומקצועי לניהול אימונים

import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise } from "../types/exercise";
import { Plan } from "../types/plan";
import {
  Workout,
  WorkoutExercise,
  WorkoutSet,
  PersonalRecord,
} from "../types/workout";
import { useUserStore } from "./userStore";
import {
  getWorkoutHistory,
  saveWorkout,
  deleteWorkoutFromStorage,
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
  restTimer: NodeJS.Timeout | null;
  isPaused: boolean;

  // 📅 היסטוריית אימונים
  workouts: Workout[];
  isLoadingWorkouts: boolean;
  workoutsError: string | null;

  // 📊 סטטיסטיקות אימון
  currentWorkoutStats: {
    startTime: Date | null;
    duration: number; // בדקות
    completedSets: number;
    totalSets: number;
    calories: number;
    volume: number; // נפח כולל
  };

  // 🏆 שיאים אישיים
  personalRecords: PersonalRecord[];

  // 🎯 פעולות אימון
  startWorkout: (workout: Workout, plan?: Plan) => void;
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

// ⚙️ קבועים
const DEFAULT_REST_TIME = 90; // שניות
const DEFAULT_SETS_PER_EXERCISE = 3;
const DEFAULT_REPS_PER_SET = 12;
const CALORIES_PER_SET = 10; // הערכה בסיסית

// 🔧 פונקציות עזר
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

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
        startWorkout: (workout: Workout, plan?: Plan) => {
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
        },

        // 🎯 התחלת אימון מותאם עם תרגילים נבחרים
        startCustomWorkout: async (exercises: Exercise[]) => {
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
              muscleGroup: exercise.category,
              targetMuscles: exercise.targetMuscleGroups,
              equipment: exercise.equipment,
            })),
            completedExercises: 0,
            totalExercises: exercises.length,
          };

          const totalSets = customWorkout.exercises.reduce(
            (total, ex) => total + ex.sets.length,
            0
          );

          set({
            activeWorkout: customWorkout,
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

        // 🆕 התחלת אימון ריק
        startEmptyWorkout: () => {
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
        },

        // ⚖️ עדכון נתוני סט
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
                      setItem.completedAt = new Date().toISOString();
                    }
                  }
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

                if (!wasCompleted) {
                  setItem.completedAt = new Date().toISOString();
                  setItem.actualReps = setItem.reps;
                  setItem.actualWeight = setItem.weight;
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
                draft.currentWorkoutStats.calories =
                  draft.currentWorkoutStats.completedSets * CALORIES_PER_SET;
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

        // ➕ הוספת תרגיל לאימון הפעיל
        addExercise: (exercise: Exercise) => {
          set(
            produce((state: WorkoutState) => {
              if (state.activeWorkout) {
                const newExercise: WorkoutExercise = {
                  id: `${exercise.id}_${generateId()}`,
                  name: exercise.name,
                  exercise: exercise,
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
                  muscleGroup: exercise.category,
                  targetMuscles: exercise.targetMuscleGroups,
                  equipment: exercise.equipment,
                };

                state.activeWorkout.exercises.push(newExercise);
                state.activeWorkout.totalExercises =
                  state.activeWorkout.exercises.length;
                state.currentWorkoutStats.totalSets +=
                  DEFAULT_SETS_PER_EXERCISE;
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
                }
              }
            })
          );
        },

        // 🔄 שינוי סדר תרגילים
        reorderExercises: (fromIndex: number, toIndex: number) => {
          set(
            produce((state: WorkoutState) => {
              if (state.activeWorkout) {
                const exercises = state.activeWorkout.exercises;
                const [removed] = exercises.splice(fromIndex, 1);
                exercises.splice(toIndex, 0, removed);

                // עדכון סדר
                exercises.forEach((ex, idx) => {
                  ex.order = idx;
                });
              }
            })
          );
        },

        // ⏭️ מעבר לתרגיל הבא
        goToNextExercise: () => {
          const state = get();
          if (!state.activeWorkout) return false;

          const nextIndex = state.currentExerciseIndex + 1;
          if (nextIndex < state.activeWorkout.exercises.length) {
            set({
              currentExerciseIndex: nextIndex,
              currentSetIndex: 0,
              isResting: false,
              restTimeLeft: 0,
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
            set({
              currentExerciseIndex: prevIndex,
              currentSetIndex: 0,
              isResting: false,
              restTimeLeft: 0,
            });
          }
        },

        // 📍 מעבר לתרגיל ספציפי
        goToExercise: (index: number) => {
          const state = get();
          if (!state.activeWorkout) return;

          if (index >= 0 && index < state.activeWorkout.exercises.length) {
            set({
              currentExerciseIndex: index,
              currentSetIndex: 0,
              isResting: false,
              restTimeLeft: 0,
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

        // ⏱️ התחלת מנוחה
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
            }
          }, 1000);

          set({ restTimer: timer });
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
          set(
            produce((state: WorkoutState) => {
              if (state.activeWorkout && !state.activeWorkout.pausedAt) {
                state.activeWorkout.pausedAt = new Date().toISOString();
                state.isPaused = true;
              }
            })
          );
        },

        // ▶️ המשך אימון
        resumeWorkout: () => {
          set(
            produce((state: WorkoutState) => {
              if (state.activeWorkout && state.activeWorkout.pausedAt) {
                state.activeWorkout.pausedAt = undefined;
                state.isPaused = false;
              }
            })
          );
        },

        // 🏁 סיום אימון
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

          const finishedWorkout: Workout = {
            ...state.activeWorkout,
            completedAt: new Date().toISOString(),
            duration,
            calories: state.currentWorkoutStats.calories,
            totalVolume: state.currentWorkoutStats.volume,
            completedExercises: state.activeWorkout.exercises.filter((ex) =>
              ex.sets.some((s) => s.status === "completed")
            ).length,
            totalSets: state.currentWorkoutStats.totalSets,
            completedSets: state.currentWorkoutStats.completedSets,
          };

          // נקה טיימר אם קיים
          if (state.restTimer) {
            clearInterval(state.restTimer);
          }

          // שמירת האימון
          try {
            await saveWorkout(finishedWorkout);
            console.log(
              `✅ Workout finished: ${finishedWorkout.name}, Duration: ${duration}min`
            );

            // הוסף להיסטוריה
            set(
              produce((draft: WorkoutState) => {
                draft.workouts.unshift(finishedWorkout);
              })
            );
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

        // 💾 שמירת התקדמות
        saveWorkoutProgress: () => {
          const state = get();
          if (state.activeWorkout) {
            try {
              // שמירה זמנית ל-AsyncStorage
              const progressData = {
                workout: state.activeWorkout,
                currentExerciseIndex: state.currentExerciseIndex,
                currentSetIndex: state.currentSetIndex,
                stats: state.currentWorkoutStats,
                timestamp: Date.now(),
              };
              // TODO: לממש שמירה ל-AsyncStorage
              console.log("💾 Workout progress saved", progressData);
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
              workouts: history,
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
            await deleteWorkoutFromStorage(workoutId);

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
                  updatedAt: new Date().toISOString(),
                };
              }
            })
          );
        },

        // 🏆 בדיקת שיאים אישיים
        checkForPersonalRecords: () => {
          const state = get();
          if (!state.activeWorkout) return [];

          const newRecords: PersonalRecord[] = [];

          // TODO: לממש בדיקת שיאים אישיים
          // השווה את הביצועים הנוכחיים להיסטוריה

          if (newRecords.length > 0) {
            set(
              produce((draft: WorkoutState) => {
                draft.personalRecords.push(...newRecords);
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
          workouts: state.workouts,
          personalRecords: state.personalRecords,
        }),
      }
    ),
    {
      name: "workout-store",
    }
  )
);
