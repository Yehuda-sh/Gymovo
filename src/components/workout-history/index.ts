// src/components/workout-history/index.ts
// קובץ ייצוא מרכזי לכל רכיבי היסטוריית האימונים - מאפשר import נוח ומסודר

// ייצוא הטיפוסים והקבועים
export * from "./types";

// ייצוא רכיב הסטטיסטיקות
export { StatsOverview } from "./WorkoutStats";

// ייצוא רכיב כרטיס האימון
export { WorkoutCard } from "./WorkoutCard";

// ייצוא רכיבי הסינון
export { FilterPills, WorkoutFilterModal } from "./WorkoutFilters";

// ייצוא רכיב המצב הריק
export { EmptyState } from "./WorkoutEmptyState";
