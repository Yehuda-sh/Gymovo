// src/theme/designSystem.ts
// Design System מאורגן עם מודולים נפרדים

// ייבוא מערכת הצבעים הקיימת
import { colors } from "./colors";

// ייבוא כל רכיבי מערכת העיצוב
import {
  spacing,
  getSpacing,
  getCustomSpacing,
  calculateGridItemWidth,
} from "./design/spacing";
import {
  typography,
  getTypography,
  createTypographyStyle,
} from "./design/typography";
import {
  shadows,
  getShadow,
  createCustomShadow,
  getInteractiveShadow,
} from "./design/shadows";
import {
  timing,
  easing,
  getTiming,
  createAnimation,
  getStateAnimation,
  getStaggerDelay,
} from "./design/animations";
import { button, card, input, container } from "./design/components";
import {
  borderRadius,
  getBorderRadius,
  getBreakpoint,
  getResponsiveValue,
  breakpoints,
  zIndex,
} from "./design/tokens";
import {
  statusColors,
  progressColors,
  getStatusColors,
  getProgressColors,
  getDifficultyColors,
  getIntensityColors,
} from "./design/status";
import {
  difficultyColors,
  getMuscleGroupColor,
  getDifficultyColor,
  getExerciseTypeColor,
  getIntensityColor,
} from "./design/fitness";

// ייבוא נוסף לרכיבים שצריכים להיות זמינים
export {
  spacing,
  typography,
  shadows,
  borderRadius,
  timing,
  easing,
  button,
  card,
  input,
  container,
  statusColors,
  progressColors,
  difficultyColors,
};

/**
 * אובייקט מרכזי לתאימות לאחור
 */
export const legacyDesignSystem = {
  spacing,
  typography,
  shadows,
  borderRadius,

  animations: {
    timing,
    easing,
  },

  components: {
    button,
    card,
    input,
    container,
  },

  statusColors,
  fitnessTokens: progressColors,

  colors,
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
  getIntensityColors,

  // Fitness helpers
  getMuscleGroupColor,
  getDifficultyColor,
  getExerciseTypeColor,
  getIntensityColor,
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
  zIndex,

  // Components
  button,
  card,
  input,
  container,

  // Status & Colors
  statusColors,
  progressColors,

  // Fitness specific
  difficultyColors,

  // Colors
  colors,
} as const;

// ברירת מחדל לייצוא
export default legacyDesignSystem;
