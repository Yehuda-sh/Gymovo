// src/data/storage/workouts/index.ts
// 🏋️ מודול אימונים מרכזי - ייצוא כל הפונקציונליות

// History - פעולות CRUD בסיסיות
export {
  getWorkoutHistory,
  saveWorkoutToHistory,
  deleteWorkoutFromHistory,
  updateWorkoutInHistory,
  clearWorkoutHistory,
  getWorkoutHistoryInfo,
} from "./history";

// Statistics - סטטיסטיקות ואנליטיקס
export type { WorkoutStatistics } from "./statistics";
export {
  getWorkoutStatistics,
  getAdvancedWorkoutStatistics,
  getExerciseStatistics,
} from "./statistics";

// Search - חיפוש מתקדם
export {
  searchWorkouts,
  findWorkoutsByExercise,
  findWorkoutsByDateRange,
  findWorkoutsByRating,
} from "./search";

// Export - יצוא נתונים
export { exportWorkoutHistory, exportWorkoutSummary } from "./export";

// Import - יבוא נתונים
export { importWorkoutHistory, importNewWorkoutsOnly } from "./import";

/**
 * 🎯 Interface מרכזי לכל פעולות האימונים
 */
export interface WorkoutOperations {
  // History
  getHistory: typeof getWorkoutHistory;
  save: typeof saveWorkoutToHistory;
  delete: typeof deleteWorkoutFromHistory;
  update: typeof updateWorkoutInHistory;
  clear: typeof clearWorkoutHistory;

  // Statistics
  getStats: typeof getWorkoutStatistics;
  getAdvancedStats: typeof getAdvancedWorkoutStatistics;
  getExerciseStats: typeof getExerciseStatistics;

  // Search
  search: typeof searchWorkouts;
  findByExercise: typeof findWorkoutsByExercise;
  findByDateRange: typeof findWorkoutsByDateRange;

  // Import/Export
  export: typeof exportWorkoutHistory;
  import: typeof importWorkoutHistory;
}

/**
 * 🏭 Factory function ליצירת interface מאוחד
 */
export function createWorkoutOperations(): WorkoutOperations {
  return {
    // History
    getHistory: getWorkoutHistory,
    save: saveWorkoutToHistory,
    delete: deleteWorkoutFromHistory,
    update: updateWorkoutInHistory,
    clear: clearWorkoutHistory,

    // Statistics
    getStats: getWorkoutStatistics,
    getAdvancedStats: getAdvancedWorkoutStatistics,
    getExerciseStats: getExerciseStatistics,

    // Search
    search: searchWorkouts,
    findByExercise: findWorkoutsByExercise,
    findByDateRange: findWorkoutsByDateRange,

    // Import/Export
    export: exportWorkoutHistory,
    import: importWorkoutHistory,
  };
}

/**
 * 🔧 Instance global ל-development
 */
if (__DEV__) {
  (global as any).__WORKOUT_OPERATIONS__ = createWorkoutOperations();
}
