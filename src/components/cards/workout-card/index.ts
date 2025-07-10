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

// ייצוא פונקציות עזר
export {
  calculateTotalSets,
  calculateWorkoutIntensity,
  calculateWorkoutVolume,
  formatTimeAgo,
  formatVolume,
  getIntensityColor,
  getIntensityLabel,
  getMuscleColor,
} from "./utils";

// ייצוא ברירת מחדל
export { WorkoutCard as default } from "./WorkoutCard";
