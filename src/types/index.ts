// src/types/index.ts - קובץ מרכזי לכל ה-types

// Export מפורש כדי למנוע התנגשויות
export * from "./exercise";
export * from "./navigation";
export * from "./plan";

// Export מפורש של user types, מלבד PersonalRecord
export {
  // Types
  type ExperienceLevel,
  type FitnessGoal,
  type PreferredLocation,
  type UserRole,
  type SubscriptionTier,
  type AccountStatus,

  // Interfaces
  type User,
  type UserStats,
  type Achievement,
  type PersonalRecord as UserPersonalRecord, // שינוי שם למניעת התנגשות
  type UserPreferences,
  type NotificationSettings,
  type FitnessProfile,

  // Type Guards
  isGuestUser,
  isPremiumUser,
  isCoach,
  hasCompletedProfile,

  // Helper Functions
  calculateBMI,
  getBMICategory,
  getExperienceLabel,
  getGoalLabel,

  // Defaults
  DEFAULT_USER_PREFERENCES,
  DEFAULT_NOTIFICATION_SETTINGS,
} from "./user";

// Export מפורש של workout types
export {
  // Interfaces
  type WorkoutSet,
  type WorkoutExercise,
  type Workout,
  type PersonalRecord as WorkoutPersonalRecord, // שינוי שם למניעת התנגשות
  type WorkoutPhoto,
  type WorkoutStats,
  type WorkoutHistoryFilters,
  type WorkoutSortBy,
  type Superset,
  type ProgressTrend,
  type ActiveWorkout,
  type WorkoutTemplate,
  type WorkoutProgress,

  // Types
  type WorkoutStatus,
  type WorkoutCategory,

  // Type Guards
  isActiveWorkout,
  isWorkoutCompleted,
  isCompletedWorkout,

  // Helper Functions
  calculateWorkoutVolume,
  getWorkoutDuration,
  getCompletedSetsCount,
  getTotalSetsCount,
  getWorkoutProgress,
  getWorkoutCompletionPercentage,
  estimateWorkoutDuration,
} from "./workout";

// אם תרצה להשתמש ב-PersonalRecord בלי לציין מאיפה, אפשר ליצור type alias:
export type PersonalRecord = import("./user").PersonalRecord;
