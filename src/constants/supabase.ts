// src/constants/supabase.ts
// 🗄️ קבועי Supabase לניהול בסיס הנתונים

/**
 * 📊 Tables Names
 * שמות הטבלאות ב-Supabase
 */
export const SUPABASE_TABLES = {
  // User related
  PROFILES: "profiles",
  USER_PREFERENCES: "user_preferences",
  USER_STATS: "user_stats",

  // Workout related
  WORKOUTS: "workouts",
  WORKOUT_EXERCISES: "workout_exercises",
  WORKOUT_SETS: "workout_sets",
  WORKOUT_HISTORY: "workout_history",

  // Exercise related
  EXERCISES: "exercises",
  CUSTOM_EXERCISES: "custom_exercises",
  FAVORITE_EXERCISES: "favorite_exercises",

  // Plan related
  PLANS: "plans",
  PLAN_DAYS: "plan_days",
  PLAN_EXERCISES: "plan_exercises",

  // Achievement related
  ACHIEVEMENTS: "achievements",
  USER_ACHIEVEMENTS: "user_achievements",
  PERSONAL_RECORDS: "personal_records",
} as const;

/**
 * 🔐 Auth Providers
 */
export const SUPABASE_AUTH_PROVIDERS = {
  EMAIL: "email",
  GOOGLE: "google",
  APPLE: "apple",
  FACEBOOK: "facebook",
} as const;

/**
 * 🚀 Supabase Functions
 * Edge functions names
 */
export const SUPABASE_FUNCTIONS = {
  // Stats calculations
  GET_USER_STATS: "get_user_stats",
  CALCULATE_WORKOUT_STATS: "calculate_workout_stats",
  UPDATE_PERSONAL_RECORDS: "update_personal_records",

  // Plan generation
  CREATE_AI_PLAN: "create_ai_plan",
  GENERATE_WORKOUT_PLAN: "generate_workout_plan",

  // Data processing
  PROCESS_WORKOUT_DATA: "process_workout_data",
  ANALYZE_PROGRESS: "analyze_progress",

  // Cleanup
  CLEANUP_OLD_DATA: "cleanup_old_data",
  ARCHIVE_WORKOUTS: "archive_workouts",
} as const;

/**
 * 🔄 Realtime Subscriptions
 */
export const REALTIME_CHANNELS = {
  WORKOUT_UPDATES: "workout:updates",
  USER_STATS: "user:stats",
  ACHIEVEMENTS: "achievements:new",
  PLAN_CHANGES: "plan:changes",
} as const;

/**
 * ⚠️ Error Codes
 */
export const SUPABASE_ERRORS = {
  // Auth errors
  INVALID_CREDENTIALS: "invalid_credentials",
  USER_NOT_FOUND: "user_not_found",
  EMAIL_TAKEN: "email_already_registered",
  WEAK_PASSWORD: "password_should_be_at_least_6_characters",

  // Database errors
  DUPLICATE_ENTRY: "23505",
  FOREIGN_KEY_VIOLATION: "23503",
  NOT_NULL_VIOLATION: "23502",

  // Custom errors
  PROFILE_NOT_FOUND: "profile_not_found",
  WORKOUT_NOT_FOUND: "workout_not_found",
  PLAN_NOT_FOUND: "plan_not_found",
} as const;

/**
 * 📝 Row Level Security Policies
 */
export const RLS_POLICIES = {
  // User can only see their own data
  OWN_DATA_ONLY: "auth.uid() = user_id",

  // Public data readable by all
  PUBLIC_READ: "true",

  // Authenticated users only
  AUTHENTICATED_ONLY: 'auth.role() = "authenticated"',
} as const;

/**
 * 🎯 Query Limits
 */
export const QUERY_LIMITS = {
  WORKOUTS_PER_PAGE: 20,
  EXERCISES_PER_PAGE: 50,
  PLANS_PER_PAGE: 10,
  HISTORY_DAYS: 30,
  MAX_BATCH_SIZE: 100,
} as const;

/**
 * 💾 Storage Buckets
 */
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  EXERCISE_IMAGES: "exercise-images",
  WORKOUT_PHOTOS: "workout-photos",
  PROGRESS_PHOTOS: "progress-photos",
} as const;

/**
 * 🔧 Helper function to handle Supabase errors
 */
export const getSupabaseErrorMessage = (error: any): string => {
  // Check for specific error codes
  if (error?.code === SUPABASE_ERRORS.DUPLICATE_ENTRY) {
    return "הרשומה כבר קיימת";
  }

  if (error?.code === SUPABASE_ERRORS.EMAIL_TAKEN) {
    return "כתובת האימייל כבר רשומה במערכת";
  }

  if (error?.message?.includes("password")) {
    return "הסיסמה חייבת להכיל לפחות 6 תווים";
  }

  // Default message
  return error?.message || "אירעה שגיאה, נסה שוב";
};

/**
 * 📊 Database Types
 * These would normally come from Supabase CLI generation
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          age: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      // Add more tables as needed
    };
  };
}

// Type exports
export type SupabaseTable =
  (typeof SUPABASE_TABLES)[keyof typeof SUPABASE_TABLES];
export type SupabaseFunction =
  (typeof SUPABASE_FUNCTIONS)[keyof typeof SUPABASE_FUNCTIONS];
export type SupabaseError =
  (typeof SUPABASE_ERRORS)[keyof typeof SUPABASE_ERRORS];
