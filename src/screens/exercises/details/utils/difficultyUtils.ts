// src/screens/exercises/details/utils/difficultyUtils.ts
// פונקציות עזר לרמת קושי

import { colors } from "../../../theme/colors";
import { DifficultyUtils } from "../types";

// פונקציה לקבלת צבע לפי רמת קושי
export const getDifficultyColor = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return "#4ade80"; // ירוק
    case "intermediate":
      return "#facc15"; // צהוב
    case "advanced":
      return "#f87171"; // אדום
    default:
      return colors.textSecondary;
  }
};

// פונקציה לתרגום רמת קושי לעברית
export const getDifficultyText = (difficulty?: string): string => {
  switch (difficulty) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "בינוני";
    case "advanced":
      return "מתקדם";
    default:
      return "לא צוין";
  }
};

// אובייקט עם כל פונקציות העזר
export const difficultyUtils: DifficultyUtils = {
  getDifficultyColor,
  getDifficultyText,
};
