// src/screens/exercises/exercise-selection/utils/constants.ts
// קבועים ופונקציות עזר למסך בחירת תרגילים

import { designSystem } from "../../../../theme/designSystem"; 

/**
 * פונקציית עזר ליצירת שקיפות צבעים
 * @param color צבע בפורמט hex
 * @param opacity שקיפות בין 0 ל-1
 * @returns צבע עם שקיפות
 */
export const withOpacity = (color: string, opacity: number): string => {
  return (
    color +
    Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")
  );
};

/**
 * קטגוריות שרירים עם צבעים וגרדיאנטים
 * כל קטגוריה כוללת: id, name, icon, color, gradient
 */
export const muscleGroups = [
  {
    id: "all",
    name: "הכל",
    icon: "view-grid",
    color: designSystem.colors.primary.main,
    gradient: designSystem.gradients.primary.colors,
  },
  {
    id: "חזה",
    name: "חזה",
    icon: "shield",
    color: designSystem.colors.accent.purple,
    gradient: [
      designSystem.colors.accent.purple,
      designSystem.colors.accent.pink,
    ],
  },
  {
    id: "גב",
    name: "גב",
    icon: "arrow-expand-vertical",
    color: designSystem.colors.secondary.main,
    gradient: designSystem.gradients.secondary.colors,
  },
  {
    id: "כתפיים",
    name: "כתפיים",
    icon: "body",
    color: designSystem.colors.accent.orange,
    gradient: [designSystem.colors.accent.orange, "#FF6B6B"],
  },
  {
    id: "זרועות",
    name: "זרועות",
    icon: "arm-flex",
    color: "#EC4899",
    gradient: ["#EC4899", "#8B5CF6"],
  },
  {
    id: "רגליים",
    name: "רגליים",
    icon: "human-handsdown",
    color: "#10B981",
    gradient: ["#10B981", "#059669"],
  },
  {
    id: "ליבה",
    name: "ליבה",
    icon: "grid",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#DC2626"],
  },
] as const;

/**
 * טיפוסים למודול
 */
export type MuscleGroup = (typeof muscleGroups)[number];
export type MuscleGroupId = MuscleGroup["id"];

/**
 * פונקציית עזר למציאת קבוצת שרירים לפי ID
 */
export const getMuscleGroupById = (id: string): MuscleGroup | undefined => {
  return muscleGroups.find((group) => group.id === id);
};

/**
 * פונקציית עזר לקבלת צבע לפי רמת קושי
 */
export const getDifficultyColor = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return designSystem.colors.secondary.main;
    case "intermediate":
      return designSystem.colors.accent.orange;
    case "advanced":
      return designSystem.colors.semantic.error;
    default:
      return designSystem.colors.primary.main;
  }
};

/**
 * פונקציית עזר לקבלת טקסט לפי רמת קושי
 */
export const getDifficultyText = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "בינוני";
    case "advanced":
      return "מתקדם";
    default:
      return "";
  }
};
