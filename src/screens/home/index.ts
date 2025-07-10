// src/screens/home/index.ts
// ייצוא מרכזי למסך הבית

// Export main screen
export { default } from "./HomeScreen";

// Export components
export { default as HomeHeader } from "./components/HomeHeader";
export { default as WeeklyStats } from "./components/WeeklyStats";
export { default as QuickActionsSection } from "./components/QuickActionsSection";
export { default as RecentWorkoutsSection } from "./components/RecentWorkoutsSection";
export { default as RecommendedPlanCard } from "./components/RecommendedPlanCard";
export { default as LoadingScreen } from "./components/LoadingScreen";
export { default as EmptyState } from "./components/EmptyState";
export { default as StatCard } from "./components/StatCard";
export { default as WorkoutCard } from "./components/WorkoutCard";
export { default as QuickActionCard } from "./components/QuickActionCard";

// Export hooks
export { useHomeData } from "./hooks/useHomeData";

// Export types
export * from "./types";
