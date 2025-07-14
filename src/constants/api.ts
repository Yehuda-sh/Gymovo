// src/constants/api.ts
// 🌐 קבועי API מרכזיים לכל השירותים החיצוניים

/**
 * 🏋️ WGER API Configuration
 * API לניהול תרגילים, ציוד ותוכניות אימון
 */
export const WGER_CONFIG = {
  BASE_URL: "https://wger.de/api/v2",
  LANGUAGE: 2, // Hebrew
  STATUS: 2, // Accepted exercises only
  CACHE_DURATION: 1000 * 60 * 30, // 30 minutes
  DEFAULT_LIMIT: 200,
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * 📍 WGER API Endpoints
 */
export const WGER_ENDPOINTS = {
  // Public endpoints (no auth required)
  EXERCISES: "/exercise/",
  EXERCISE_INFO: "/exerciseinfo/",
  EXERCISE_CATEGORY: "/exercisecategory/",
  EQUIPMENT: "/equipment/",
  MUSCLE: "/muscle/",

  // Auth endpoints
  TOKEN: "/token/",
  TOKEN_REFRESH: "/token/refresh/",
  TOKEN_VERIFY: "/token/verify/",

  // User endpoints (auth required)
  ROUTINES: "/routine/",
  TEMPLATES: "/templates/",
  PUBLIC_TEMPLATES: "/public-templates/",
  WORKOUT_SESSIONS: "/workoutsession/",
  WORKOUT_LOG: "/workoutlog/",

  // New endpoints from v2.4
  SLOTS: "/slot/",
  SLOT_ENTRY: "/slot-entry/",
  WEIGHT_CONFIG: "/weight-config/",
  REPETITIONS_CONFIG: "/repetitions-config/",
  SETS_CONFIG: "/sets-config/",
  REST_CONFIG: "/rest-config/",
} as const;

/**
 * 🗺️ Language Codes for WGER
 */
export const WGER_LANGUAGES = {
  ENGLISH: 2,
  GERMAN: 1,
  SPANISH: 4,
  FRENCH: 5,
  HEBREW: 2, // Using English as fallback
} as const;

/**
 * 📊 Exercise Status Codes
 */
export const EXERCISE_STATUS = {
  PENDING: 1,
  ACCEPTED: 2,
  DECLINED: 3,
  ADMIN_APPROVED: 4,
} as const;

/**
 * 🔄 API Response Status
 */
export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
  LOADING: "loading",
  IDLE: "idle",
} as const;

/**
 * ⚠️ Error Messages
 */
export const API_ERRORS = {
  NETWORK: "אין חיבור לאינטרנט",
  TIMEOUT: "הבקשה לקחה יותר מדי זמן",
  SERVER: "שגיאת שרת, נסה שוב מאוחר יותר",
  NOT_FOUND: "המידע המבוקש לא נמצא",
  UNAUTHORIZED: "אין הרשאה לבצע פעולה זו",
  GENERIC: "אירעה שגיאה, נסה שוב",
} as const;

/**
 * 🎯 API Headers
 */
export const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
} as const;

/**
 * 💾 Cache Keys
 */
export const CACHE_KEYS = {
  EXERCISES: "wger_exercises",
  EQUIPMENT: "wger_equipment",
  MUSCLES: "wger_muscles",
  CATEGORIES: "wger_categories",
  PUBLIC_PLANS: "wger_public_plans",
  USER_TOKEN: "wger_user_token",
} as const;

/**
 * 🔧 Utility function to build WGER URLs
 */
export const buildWgerUrl = (
  endpoint: string,
  params?: Record<string, any>
): string => {
  const url = new URL(`${WGER_CONFIG.BASE_URL}${endpoint}`);

  // Add default parameters
  url.searchParams.append("language", WGER_CONFIG.LANGUAGE.toString());
  url.searchParams.append("status", WGER_CONFIG.STATUS.toString());

  // Add custom parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
};

/**
 * 🔍 Query Parameters Helper
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

// Type exports
export type WgerEndpoint = (typeof WGER_ENDPOINTS)[keyof typeof WGER_ENDPOINTS];
export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];
export type ApiError = (typeof API_ERRORS)[keyof typeof API_ERRORS];
