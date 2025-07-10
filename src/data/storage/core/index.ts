// src/data/storage/core/index.ts
// 🔧 תשתית אחסון מרכזית - ייצוא מודולים

// 🔄 מנגנון retry וקונפיגורציה
import { withRetry, RETRY_CONFIG, STORAGE_CONFIG } from "./retry";

// 🚨 ניהול שגיאות
import {
  StorageError,
  isRetryable,
  safeExecute,
  createDeveloperErrorMessage,
} from "./errors";

// 📊 ניטור וסטטיסטיקות
import type { StorageStats } from "./monitoring";
import {
  getStorageStats,
  resetStorageStats,
  updateStorageStats,
  getDetailedStats,
  generatePerformanceReport,
  checkPerformanceIssues,
} from "./monitoring";

// 🛡️ ולידציה של נתונים
import {
  validatePlan,
  validateWorkout,
  validateStatsData,
  validateArray,
  cleanAndValidate,
} from "./validation";

// 🔑 ניהול מפתחות אחסון
import {
  StorageKeys,
  getUserStorageKeys,
  getCachePatterns,
  keyBelongsToUser,
  parseStorageKey,
  getExpiredKeys,
  createVersionedKey,
} from "./keys";

// 🗜️ דחיסה ואופטימיזציה
import {
  compressData,
  decompressData,
  formatDataSize,
  getStringSize,
  analyzeDataSize,
  optimizeJsonString,
  calculateOptimizationSavings,
  smartOptimize,
} from "./compression";

// Re-export everything for external use
export {
  // Retry mechanism
  withRetry,
  RETRY_CONFIG,
  STORAGE_CONFIG,

  // Error handling
  StorageError,
  isRetryable,
  safeExecute,
  createDeveloperErrorMessage,

  // Monitoring & Statistics
  type StorageStats,
  getStorageStats,
  resetStorageStats,
  updateStorageStats,
  getDetailedStats,
  generatePerformanceReport,
  checkPerformanceIssues,

  // Data validation
  validatePlan,
  validateWorkout,
  validateStatsData,
  validateArray,
  cleanAndValidate,

  // Storage keys management
  StorageKeys,
  getUserStorageKeys,
  getCachePatterns,
  keyBelongsToUser,
  parseStorageKey,
  getExpiredKeys,
  createVersionedKey,

  // Data compression & optimization
  compressData,
  decompressData,
  formatDataSize,
  getStringSize,
  analyzeDataSize,
  optimizeJsonString,
  calculateOptimizationSavings,
  smartOptimize,
};

/**
 * 🎯 Interface מרכזי לכל הפעולות Core
 * מספק גישה מובנת למכלול הפונקציונליות
 */
export interface StorageCore {
  // Retry & Configuration
  withRetry: typeof withRetry;
  config: typeof STORAGE_CONFIG;

  // Error Handling
  StorageError: typeof StorageError;
  handleError: typeof safeExecute;

  // Monitoring
  getStats: typeof getStorageStats;
  resetStats: typeof resetStorageStats;

  // Validation
  validatePlan: typeof validatePlan;
  validateWorkout: typeof validateWorkout;
  cleanData: typeof cleanAndValidate;

  // Keys Management
  keys: typeof StorageKeys;
  getUserKeys: typeof getUserStorageKeys;

  // Optimization
  optimize: typeof smartOptimize;
  compress: typeof compressData;
}

/**
 * 🏭 Factory function ליצירת instance של StorageCore
 * מספק API נוח לשימוש במודולי הליבה
 */
export function createStorageCore(): StorageCore {
  return {
    // Retry & Configuration
    withRetry,
    config: STORAGE_CONFIG,

    // Error Handling
    StorageError,
    handleError: safeExecute,

    // Monitoring
    getStats: getStorageStats,
    resetStats: resetStorageStats,

    // Validation
    validatePlan,
    validateWorkout,
    cleanData: cleanAndValidate,

    // Keys Management
    keys: StorageKeys,
    getUserKeys: getUserStorageKeys,

    // Optimization
    optimize: smartOptimize,
    compress: compressData,
  };
}

/**
 * 🔧 Instance global ל-development
 * מאפשר גישה קלה למודולי הליבה מה-console
 */
if (__DEV__) {
  (global as any).__STORAGE_CORE__ = createStorageCore();
}
