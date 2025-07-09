// src/theme/design/index.ts
// נקודת כניסה ראשית לכל מערכת העיצוב

// ייבוא כל רכיבי מערכת העיצוב
import {
  spacing,
  getSpacing,
  getCustomSpacing,
  calculateGridItemWidth,
} from "./spacing";
import { typography, getTypography, createTypographyStyle } from "./typography";
import {
  shadows,
  getShadow,
  createCustomShadow,
  getInteractiveShadow,
} from "./shadows";
import {
  timing,
  easing,
  getTiming,
  createAnimation,
  getStateAnimation,
  getStaggerDelay,
} from "./animations";
import { button, card, input, container, list, modal } from "./components";
import {
  borderRadius,
  getBorderRadius,
  getBreakpoint,
  getResponsiveValue,
  breakpoints,
  iconSizes,
  heights,
  widths,
  zIndex,
} from "./tokens";
import {
  statusColors,
  progressColors as statusProgressColors,
  getStatusColors,
  getProgressColors,
  getDifficultyColors,
  getIntensityColors as getStatusIntensityColors,
} from "./status";
import {
  difficultyColors,
  muscleGroupColors,
  fitnessSizes,
  workoutStatusColors,
  fitnessStyles,
  getMuscleGroupColor,
  getDifficultyColor,
  getExerciseTypeColor,
  getIntensityColor as getFitnessIntensityColor,
} from "./fitness";

// Spacing System - Export all spacing related items
export { spacing, getSpacing, getCustomSpacing, calculateGridItemWidth };

// Typography System - Export all typography related items
export { typography, getTypography, createTypographyStyle };

// Shadow System - Export all shadow related items
export { shadows, getShadow, createCustomShadow, getInteractiveShadow };

// Animation System - Export all animation related items (excluding conflicting ones)
export {
  timing,
  easing,
  getTiming,
  createAnimation,
  getStateAnimation,
  getStaggerDelay,
};

// Component Styles - Export all component related items
export { button, card, input, container, list, modal };

// Design Tokens - Export all token related items
export {
  borderRadius,
  getBorderRadius,
  getBreakpoint,
  getResponsiveValue,
  breakpoints,
  iconSizes,
  heights,
  widths,
  zIndex,
};

// Status Colors - Export status related items with renamed conflicting exports
export { statusColors, getStatusColors, getDifficultyColors };
export { progressColors as statusProgressColors, getProgressColors };
export { getIntensityColors as getStatusIntensityColors };

// Fitness Tokens - Export fitness related items with renamed conflicting exports
export {
  difficultyColors,
  muscleGroupColors,
  fitnessSizes,
  workoutStatusColors,
  fitnessStyles,
};
export { getMuscleGroupColor, getDifficultyColor, getExerciseTypeColor };
export { getIntensityColor as getFitnessIntensityColor };

// For backward compatibility, export progressColors as the status version
export { progressColors } from "./status";
export { intensityColors } from "./status";

/**
 * אובייקט מרכזי עם כל מערכת העיצוב
 */
export const designSystem = {
  // Core systems
  spacing,
  typography,
  shadows,
  animations: { timing, easing },

  // Tokens
  borderRadius,
  breakpoints,
  iconSizes,
  heights,
  widths,
  zIndex,

  // Components
  button,
  card,
  input,
  container,
  list,
  modal,

  // Status & Colors
  statusColors,
  progressColors: statusProgressColors,
  intensityColors: getStatusIntensityColors,

  // Fitness specific
  difficultyColors,
  muscleGroupColors,
  fitnessSizes,
  workoutStatusColors,
  fitnessStyles,
} as const;

/**
 * פונקציות עזר נפוצות
 */
export const helpers = {
  // Spacing helpers
  getSpacing,
  getCustomSpacing,
  calculateGridItemWidth,

  // Typography helpers
  getTypography,
  createTypographyStyle,

  // Shadow helpers
  getShadow,
  createCustomShadow,
  getInteractiveShadow,

  // Animation helpers
  getTiming,
  createAnimation,
  getStateAnimation,
  getStaggerDelay,

  // Token helpers
  getBorderRadius,
  getBreakpoint,
  getResponsiveValue,

  // Status helpers
  getStatusColors,
  getProgressColors,
  getDifficultyColors,
  getIntensityColors: getStatusIntensityColors,

  // Fitness helpers
  getMuscleGroupColor,
  getDifficultyColor,
  getExerciseTypeColor,
  getIntensityColor: getFitnessIntensityColor,
} as const;

/**
 * קבועים גלובליים
 */
export const constants = {
  // Base unit (4px)
  BASE_UNIT: 4,

  // Golden ratio
  GOLDEN_RATIO: 1.618,

  // Common aspect ratios
  ASPECT_RATIOS: {
    square: 1,
    card: 1.5,
    video: 16 / 9,
    photo: 4 / 3,
  },

  // Z-index layers
  Z_INDEX: zIndex,

  // Breakpoints
  BREAKPOINTS: breakpoints,

  // Animation durations
  DURATIONS: timing,
} as const;

/**
 * תמיכה בthemes (לעתיד)
 */
export const themes = {
  default: designSystem,
  // ניתן להוסיף themes נוספים כאן
} as const;

/**
 * ברירת מחדל לייצוא
 */
export default designSystem;
