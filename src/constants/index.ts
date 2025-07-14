// src/constants/index.ts
// 📦 ייצוא מרכזי של כל הקבועים באפליקציה

/**
 * 🌐 API Constants
 * קבועים לתקשורת עם שירותי API חיצוניים
 */
export * from './api';

/**
 * 🗄️ Supabase Constants
 * קבועים לעבודה עם Supabase
 */
export * from './supabase';

/**
 * 💪 Muscle Groups
 * קבוצות שרירים, צבעים ומידע נוסף
 */
export * from './muscleGroups';

/**
 * 🏋️ Equipment
 * סוגי ציוד לאימונים
 */
export * from './equipment';

/**
 * 🎯 Workout Constants
 * קבועי אימון וברירות מחדל
 */
export * from './workout';

/**
 * 🏃 Exercises
 * רשימת תרגילים בסיסית
 */
export * from './exercises';

/**
 * 👥 Demo Users
 * משתמשי דמו למצב פיתוח והדגמה
 * כולל תוכניות אימון והיסטוריה
 */
export * from './demoUsers';

/**
 * 🎨 UI Constants
 * קבועים לממשק משתמש
 */
export const UI_CONSTANTS = {
  // Animation durations
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Border radius
  BORDER_RADIUS: {
    SMALL: 4,
    MEDIUM: 8,
    LARGE: 16,
    EXTRA_LARGE: 24,
    FULL: 999,
  },
  
  // Spacing
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  
  // Z-index levels
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 2000,
    TOAST: 3000,
    TOOLTIP: 4000,
  },
} as const;

/**
 * 📱 App Constants
 * קבועים כלליים לאפליקציה
 */
export const APP_CONSTANTS = {
  // App info
  APP_NAME: 'Gymovo',
  APP_VERSION: '1.0.0',
  
  // Storage keys
  STORAGE_KEYS: {
    USER_DATA: '@gymovo_user',
    WORKOUT_DRAFT: '@gymovo_workout_draft',
    SETTINGS: '@gymovo_settings',
    LAST_SYNC: '@gymovo_last_sync',
  },
  
  // Timeouts
  TIMEOUTS: {
    DEBOUNCE: 300,
    SEARCH: 500,
    AUTO_SAVE: 5000,
    SESSION_EXPIRE: 1000 * 60 * 30, // 30 minutes
  },
  
  // Limits
  LIMITS: {
    MAX_EXERCISES_PER_WORKOUT: 20,
    MAX_SETS_PER_EXERCISE: 10,
    MAX_PLANS: 10,
    MAX_CUSTOM_EXERCISES: 50,
    MAX_PHOTO_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Guest user
  GUEST_USER: {
    EXPIRY_DAYS: 30,
    WARNING_DAYS: 3,
  },
} as const;

/**
 * 🌍 Localization
 * קבועי שפה ולוקליזציה
 */
export const LOCALIZATION = {
  DEFAULT_LANGUAGE: 'he',
  SUPPORTED_LANGUAGES: ['he', 'en'],
  RTL_LANGUAGES: ['he', 'ar'],
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
} as const;

/**
 * 🎯 Feature Flags
 * דגלי פיצ'רים לשליטה בתכונות
 */
export const FEATURE_FLAGS = {
  DEMO_MODE: __DEV__, // Only in development
  SOCIAL_LOGIN: true,
  AI_PLAN_GENERATOR: true,
  OFFLINE_MODE: true,
  ACHIEVEMENTS: true,
  SOCIAL_SHARING: false, // Coming soon
  PREMIUM_FEATURES: false, // Coming soon
} as const;

/**
 * 🔧 Utility Types
 */
export type StorageKey = typeof APP_CONSTANTS.STORAGE_KEYS[keyof typeof APP_CONSTANTS.STORAGE_KEYS];
export type Language = typeof LOCALIZATION.SUPPORTED_LANGUAGES[number];
export type FeatureFlag = keyof typeof FEATURE_FLAGS;