// src/data/storage.ts
// 🏗️ מרכז ייצוא מאוחד למערכת האחסון המרופקטרת

/**
 * 🔄 גרסה משודרגת של מערכת האחסון
 * מרופקטרת למודולים נפרדים לקריאות ותחזוקה טובה יותר
 * מקיימת תאימות לאחור מלאה עם הקוד הקיים
 */

// 🔧 תשתית ליבה - retry, שגיאות, ניטור, ולידציה
export {
  // Retry mechanism
  withRetry,
  RETRY_CONFIG,
  STORAGE_CONFIG,

  // Error handling
  StorageError,
  isRetryable,
  safeExecute,

  // Monitoring & Statistics
  getStorageStats,
  resetStorageStats,
  updateStorageStats,

  // Data validation
  validatePlan,
  validateWorkout,
  validateStatsData,
  cleanAndValidate,

  // Storage keys management
  StorageKeys,
  getUserStorageKeys,

  // Data compression & optimization
  compressData,
  decompressData,
  formatDataSize,
  smartOptimize,

  // Core factory
  createStorageCore,
  type StorageCore,
  type StorageStats,
} from "./storage/core";

// 📋 ניהול תוכניות אימון
export {
  getPlansByUserId,
  savePlan,
  deletePlan,
  searchPlans,
  getPlanStatistics,
  clearAllPlans,
} from "./storage/plans";

// 🏋️ ניהול אימונים והיסטוריה
export {
  // Basic CRUD operations
  getWorkoutHistory,
  saveWorkoutToHistory,
  deleteWorkoutFromHistory,
  updateWorkoutInHistory,
  clearWorkoutHistory,

  // Statistics & Analytics
  getWorkoutStatistics,
  getAdvancedWorkoutStatistics,
  getExerciseStatistics,
  type WorkoutStatistics,

  // Search functionality
  searchWorkouts,
  findWorkoutsByExercise,
  findWorkoutsByDateRange,
  findWorkoutsByRating,

  // Import/Export
  exportWorkoutHistory,
  exportWorkoutSummary,
  importWorkoutHistory,
  importNewWorkoutsOnly,

  // Factory
  createWorkoutOperations,
  type WorkoutOperations,
} from "./storage/workouts";

// 🛠️ כלי עזר ותחזוקה
export {
  getStorageUsage,
  clearUserData,
  clearAllData,
  findUsersWithData,
  getUsersStorageReport,
  validateDataIntegrity,
  generateSystemReport,
} from "./storage/utilities";

/**
 * 🎯 Interface מאוחד לכל מערכת האחסון
 * מספק גישה נוחה לכל הפונקציונליות במקום אחד
 */
export interface StorageAPI {
  // Core infrastructure
  core: StorageCore;

  // Plans management
  plans: {
    getByUserId: typeof getPlansByUserId;
    save: typeof savePlan;
    delete: typeof deletePlan;
    search: typeof searchPlans;
    getStats: typeof getPlanStatistics;
    clearAll: typeof clearAllPlans;
  };

  // Workouts management
  workouts: WorkoutOperations;

  // System utilities
  utilities: {
    getUsage: typeof getStorageUsage;
    clearUser: typeof clearUserData;
    clearAll: typeof clearAllData;
    findUsers: typeof findUsersWithData;
    getReport: typeof getUsersStorageReport;
    validate: typeof validateDataIntegrity;
    generateReport: typeof generateSystemReport;
  };
}

/**
 * 🏭 Factory function ליצירת API מאוחד
 * מספק interface אחיד לכל מערכת האחסון
 */
export function createStorageAPI(): StorageAPI {
  return {
    core: createStorageCore(),

    plans: {
      getByUserId: getPlansByUserId,
      save: savePlan,
      delete: deletePlan,
      search: searchPlans,
      getStats: getPlanStatistics,
      clearAll: clearAllPlans,
    },

    workouts: createWorkoutOperations(),

    utilities: {
      getUsage: getStorageUsage,
      clearUser: clearUserData,
      clearAll: clearAllData,
      findUsers: findUsersWithData,
      getReport: getUsersStorageReport,
      validate: validateDataIntegrity,
      generateReport: generateSystemReport,
    },
  };
}

/**
 * 🔧 Instance global ל-development
 * מאפשר גישה קלה לכל מערכת האחסון מה-console
 */
if (__DEV__) {
  (global as any).__STORAGE_API__ = createStorageAPI();
  console.log("🔧 Storage API available globally as __STORAGE_API__");
}

/**
 * 🎉 Export ברירת מחדל למערכת מאוחדת
 */
export default createStorageAPI();
