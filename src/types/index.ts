// src/types/index.ts - קובץ מרכזי לכל ה-types

// Export מפורש כדי למנוע התנגשויות
export * from "./exercise";
export * from "./navigation";
export * from "./plan";

// Export מפורש של user types
export {
  // Interfaces
  type User,
  type UserStats,
  type UserPreferences,
  type UserAchievement,
  type UserGoal,
} from "./user";

// Export מפורש של workout types
export {
  // Interfaces
  type WorkoutSet,
  type WorkoutExercise,
  type Workout,
  type PersonalRecord,
  type WorkoutPhoto,
  type WorkoutSummary,
  type WorkoutTemplate,
  type ActiveWorkoutState,
  type WorkoutFilters,
  type WorkoutAnalytics,
  type WorkoutSuggestion,
  type ExerciseHistory,
} from "./workout";
