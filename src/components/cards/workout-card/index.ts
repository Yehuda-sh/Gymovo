// src/components/cards/workout-card/index.ts
// ייצוא מרכזי לכל מודולי WorkoutCard - נקודת כניסה אחידה

// ייצוא הרכיב הראשי
export { WorkoutCard, WorkoutCardSkeleton } from "./WorkoutCard";

// ייצוא רכיבים נפרדים
export { DifficultyBadge } from "./DifficultyBadge";
export { IntensityIndicator } from "./IntensityIndicator";
export { RatingStars } from "./RatingStars";
export { TargetMuscles } from "./TargetMuscles";
export { WorkoutStats } from "./WorkoutStats";

// ייצוא קונפיגורציה
export {
  DifficultyLevel,
  IntensityLevel,
  DIFFICULTY_CONFIG,
  INTENSITY_CONFIG,
  SIZE_CONFIG,
  MUSCLE_COLORS,
  RATING_CONFIG,
  DATE_FORMATS,
  ANIMATION_CONFIG,
  BASE_STYLES,
} from "./config";

// ייצוא פונקציות עזר
export {
  calculateTotalSets,
  calculateWorkoutIntensity,
  calculateWorkoutVolume,
  formatTimeAgo,
  formatVolume,
  getIntensityColor,
  getIntensityLabel,
  getIntensityLevel,
  getIntensityGradient,
  getMuscleColor,
  calculateWorkoutScore,
  calculateProgress,
} from "./utils";

// ייצוא workout adapter
export {
  type DisplayWorkout,
  adaptWorkoutForDisplay,
  adaptHistoryWorkoutForDisplay,
  mergeWorkoutData,
} from "./workout-adapter";

// ייצוא ברירת מחדל
