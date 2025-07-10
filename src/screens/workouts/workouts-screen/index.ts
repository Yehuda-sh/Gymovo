// src/screens/workouts/workouts-screen/index.ts
// ייצוא מאוחד של מודול מסך היסטוריית אימונים

// הרכיב הראשי
export { default } from "./WorkoutsScreen";
export { default as WorkoutsScreen } from "./WorkoutsScreen";

// רכיבים מודולריים
export * from "./components";

// הוקים מותאמים
export * from "./hooks";

// סטיילים
export * from "./styles";

// גישה מפורטת למודולים (לפיתוח ודיבוג)
export * as WorkoutComponents from "./components";
export * as WorkoutHooks from "./hooks";
export * as WorkoutStyles from "./styles";
