// src/stores/workout-store/stats/index.ts
// 🏆 סטטיסטיקות ושיאים אישיים

import { produce } from "immer";
import { PersonalRecord } from "../../../types/workout";
import { WorkoutState } from "../types";
import {
  PERSONAL_RECORD_THRESHOLD,
  MAX_PERSONAL_RECORDS_STORED,
} from "../constants";

// 🏆 בדיקת שיאים אישיים חדשים
export const createCheckForPersonalRecordsAction =
  (set: any, get: any) => (): PersonalRecord[] => {
    const state = get() as WorkoutState;

    if (!state.activeWorkout) return [];

    console.log("🏆 Checking for personal records...");
    const newRecords: PersonalRecord[] = [];

    // עבור על כל תרגיל באימון הנוכחי
    state.activeWorkout.exercises.forEach((exercise) => {
      // חפש שיאים בהיסטוריה לתרגיל הזה
      const historicalData = getExerciseHistory(state, exercise.exercise.id);

      // בדוק שיאי משקל
      const weightRecord = checkWeightRecord(exercise, historicalData);
      if (weightRecord) newRecords.push(weightRecord);

      // בדוק שיאי נפח
      const volumeRecord = checkVolumeRecord(exercise, historicalData);
      if (volumeRecord) newRecords.push(volumeRecord);

      // בדוק שיאי חזרות
      const repsRecord = checkRepsRecord(exercise, historicalData);
      if (repsRecord) newRecords.push(repsRecord);
    });

    // הוסף שיאים חדשים לסטור
    if (newRecords.length > 0) {
      set(
        produce((draft: WorkoutState) => {
          draft.personalRecords.push(...newRecords);
          // שמור רק את המקסימום המותר
          if (draft.personalRecords.length > MAX_PERSONAL_RECORDS_STORED) {
            draft.personalRecords = draft.personalRecords
              .sort(
                (a, b) =>
                  new Date(b.achievedAt).getTime() -
                  new Date(a.achievedAt).getTime()
              )
              .slice(0, MAX_PERSONAL_RECORDS_STORED);
          }
        })
      );

      console.log(`🏆 Found ${newRecords.length} new personal records!`);
    }

    return newRecords;
  };

// 🧹 ניקוי שיאים אישיים
export const createClearPersonalRecordsAction =
  (set: any, get: any) => (): void => {
    set(
      produce((state: WorkoutState) => {
        state.personalRecords = [];
      })
    );

    console.log("🧹 Personal records cleared");
  };

// 📊 קבלת שיאים אישיים לפי תרגיל
export const createGetPersonalRecordsForExerciseAction =
  (get: any) =>
  (exerciseId: string): PersonalRecord[] => {
    const state = get() as WorkoutState;
    return state.personalRecords.filter(
      (record) => record.exerciseId === exerciseId
    );
  };

// 📈 קבלת סטטיסטיקות כלליות של שיאים
export const createGetPersonalRecordsStatsAction = (get: any) => () => {
  const state = get() as WorkoutState;
  const records = state.personalRecords;

  if (records.length === 0) {
    return {
      total: 0,
      byType: {},
      recent: [],
      bestExercises: [],
    };
  }

  // קיבוץ לפי סוג
  const byType = records.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // שיאים אחרונים (5 האחרונים)
  const recent = records
    .sort(
      (a, b) =>
        new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
    )
    .slice(0, 5);

  // תרגילים עם הכי הרבה שיאים
  const exerciseRecordCounts = records.reduce((acc, record) => {
    acc[record.exerciseId] = (acc[record.exerciseId] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const bestExercises = Object.entries(exerciseRecordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([exerciseId, count]) => ({ exerciseId, count }));

  return {
    total: records.length,
    byType,
    recent,
    bestExercises,
  };
};

// 📊 קבלת נתוני ביצועים לתרגיל ספציפי
export const createGetExercisePerformanceAction =
  (get: any) => (exerciseId: string) => {
    const state = get() as WorkoutState;
    const exerciseHistory = getExerciseHistory(state, exerciseId);

    if (exerciseHistory.length === 0) {
      return null;
    }

    // חישוב שיאי משקל, נפח וחזרות
    const maxWeight = Math.max(
      ...exerciseHistory.map((data) => data.maxWeight)
    );
    const maxVolume = Math.max(
      ...exerciseHistory.map((data) => data.totalVolume)
    );
    const maxReps = Math.max(...exerciseHistory.map((data) => data.maxReps));

    // מגמה (האם משתפר)
    const recent = exerciseHistory.slice(-5);
    const avgRecentVolume =
      recent.reduce((sum, data) => sum + data.totalVolume, 0) / recent.length;
    const older = exerciseHistory.slice(-10, -5);
    const avgOlderVolume =
      older.length > 0
        ? older.reduce((sum, data) => sum + data.totalVolume, 0) / older.length
        : avgRecentVolume;

    const trend =
      avgRecentVolume > avgOlderVolume * 1.05
        ? "improving"
        : avgRecentVolume < avgOlderVolume * 0.95
        ? "declining"
        : "stable";

    return {
      exerciseId,
      totalSessions: exerciseHistory.length,
      maxWeight,
      maxVolume,
      maxReps,
      avgVolume: Math.round(
        exerciseHistory.reduce((sum, data) => sum + data.totalVolume, 0) /
          exerciseHistory.length
      ),
      trend,
      lastPerformed: exerciseHistory[exerciseHistory.length - 1]?.date || null,
    };
  };

// פונקציות עזר פרטיות

// קבלת היסטוריה לתרגיל ספציפי
const getExerciseHistory = (state: WorkoutState, exerciseId: string) => {
  const history: Array<{
    date: string;
    maxWeight: number;
    totalVolume: number;
    maxReps: number;
  }> = [];

  state.workouts.forEach((workout) => {
    const exercise = workout.exercises.find(
      (ex) => ex.exercise.id === exerciseId
    );
    if (exercise) {
      const completedSets = exercise.sets.filter(
        (set) => set.status === "completed"
      );
      if (completedSets.length > 0) {
        const maxWeight = Math.max(
          ...completedSets.map((set) => set.actualWeight || set.weight || 0)
        );
        const maxReps = Math.max(
          ...completedSets.map((set) => set.actualReps || set.reps || 0)
        );
        const totalVolume = completedSets.reduce((sum, set) => {
          const weight = set.actualWeight || set.weight || 0;
          const reps = set.actualReps || set.reps || 0;
          return sum + weight * reps;
        }, 0);

        history.push({
          date: workout.date.toString(),
          maxWeight,
          totalVolume,
          maxReps,
        });
      }
    }
  });

  return history.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// בדיקת שיא משקל
const checkWeightRecord = (
  exercise: any,
  history: any[]
): PersonalRecord | null => {
  const completedSets = exercise.sets.filter(
    (set: any) => set.status === "completed"
  );
  if (completedSets.length === 0) return null;

  const currentMaxWeight = Math.max(
    ...completedSets.map((set: any) => set.actualWeight || set.weight || 0)
  );
  const historicalMaxWeight =
    history.length > 0 ? Math.max(...history.map((h) => h.maxWeight)) : 0;

  if (currentMaxWeight > historicalMaxWeight * PERSONAL_RECORD_THRESHOLD) {
    return {
      id: `pr_weight_${exercise.id}_${Date.now()}`,
      type: "max_weight",
      exerciseId: exercise.exercise.id,
      exerciseName: exercise.name,
      value: currentMaxWeight,
      previousValue: historicalMaxWeight,
      improvementPercentage: Math.round(
        ((currentMaxWeight - historicalMaxWeight) / historicalMaxWeight) * 100
      ),
      achievedAt: new Date().toISOString(),
    };
  }

  return null;
};

// בדיקת שיא נפח
const checkVolumeRecord = (
  exercise: any,
  history: any[]
): PersonalRecord | null => {
  const completedSets = exercise.sets.filter(
    (set: any) => set.status === "completed"
  );
  if (completedSets.length === 0) return null;

  const currentVolume = completedSets.reduce((sum: number, set: any) => {
    const weight = set.actualWeight || set.weight || 0;
    const reps = set.actualReps || set.reps || 0;
    return sum + weight * reps;
  }, 0);

  const historicalMaxVolume =
    history.length > 0 ? Math.max(...history.map((h) => h.totalVolume)) : 0;

  if (currentVolume > historicalMaxVolume * PERSONAL_RECORD_THRESHOLD) {
    return {
      id: `pr_volume_${exercise.id}_${Date.now()}`,
      type: "max_volume",
      exerciseId: exercise.exercise.id,
      exerciseName: exercise.name,
      value: currentVolume,
      previousValue: historicalMaxVolume,
      improvementPercentage: Math.round(
        ((currentVolume - historicalMaxVolume) / historicalMaxVolume) * 100
      ),
      achievedAt: new Date().toISOString(),
    };
  }

  return null;
};

// בדיקת שיא חזרות
const checkRepsRecord = (
  exercise: any,
  history: any[]
): PersonalRecord | null => {
  const completedSets = exercise.sets.filter(
    (set: any) => set.status === "completed"
  );
  if (completedSets.length === 0) return null;

  const currentMaxReps = Math.max(
    ...completedSets.map((set: any) => set.actualReps || set.reps || 0)
  );
  const historicalMaxReps =
    history.length > 0 ? Math.max(...history.map((h) => h.maxReps)) : 0;

  if (currentMaxReps > historicalMaxReps * PERSONAL_RECORD_THRESHOLD) {
    return {
      id: `pr_reps_${exercise.id}_${Date.now()}`,
      type: "max_reps",
      exerciseId: exercise.exercise.id,
      exerciseName: exercise.name,
      value: currentMaxReps,
      previousValue: historicalMaxReps,
      improvementPercentage: Math.round(
        ((currentMaxReps - historicalMaxReps) / historicalMaxReps) * 100
      ),
      achievedAt: new Date().toISOString(),
    };
  }

  return null;
};
