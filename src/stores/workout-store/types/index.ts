// src/stores/workout-store/types/index.ts
// 🏋️ ממשקים ו-types לניהול אימונים

import { Exercise } from "../../../types/exercise";
import { Plan } from "../../../types/plan";
import {
  Workout,
  WorkoutExercise,
  PersonalRecord,
} from "../../../types/workout";

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

// 📊 סטטיסטיקות אימון נוכחי
export interface CurrentWorkoutStats {
  startTime: Date | null;
  duration: number;
  completedSets: number;
  totalSets: number;
  calories: number;
  volume: number;
}

// 🏋️ נתוני אימון פעיל בסיסיים
export interface ActiveWorkoutState {
  activeWorkout: Workout | null;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restTimeLeft: number;
  restTimer: NodeJS.Timeout | null;
  isPaused: boolean;
}

// 📅 נתוני היסטוריית אימונים
export interface WorkoutHistoryState {
  workouts: Workout[];
  isLoadingWorkouts: boolean;
  workoutsError: string | null;
}
