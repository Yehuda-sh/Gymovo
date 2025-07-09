// src/theme/design/index.ts
// נקודת כניסה ראשית לכל מערכת העיצוב

// Spacing System
export * from "./spacing";
export { spacing, componentSpacing, mobileSpacing } from "./spacing";

// Typography System
export * from "./typography";
export { typography, fontSizes, fontWeights, fitnessTypography } from "./typography";

// Shadow System
export * from "./shadows";
export { shadows, componentShadows, fitnessShadows } from "./shadows";

// Animation System
export * from "./animations";
export { timing, easing, presets, screenTransitions, fitnessAnimations } from "./animations";

// Component Styles
export * from "./components";
export { button, card, input, container, list, modal, fitnessComponents } from "./components";

// Design Tokens
export * from "./tokens";
export { borderRadius, breakpoints, iconSizes, heights, widths, zIndex } from "./tokens";

// Status Colors
export * from "./status";
export { statusColors, fitnessStatusColors, progressColors, intensityColors } from "./status";

// Fitness Tokens
export * from "./fitness";
export { 
  difficultyColors, 
  muscleGroupColors, 
  fitnessSizes, 
  workoutStatusColors, 
  fitnessStyles 
} from "./fitness";

/**
 * אובייקט מרכזי עם כל מערכת העיצוב
 */
export const designSystem = {
  // Core systems
  spacing: require("./spacing").spacing,
  typography: require("./typography").typography,
  shadows: require("./shadows").shadows,
  animations: require("./animations"),
  
  // Tokens
  borderRadius: require("./tokens").borderRadius,
  breakpoints: require("./tokens").breakpoints,
  iconSizes: require("./tokens").iconSizes,
  heights: require("./tokens").heights,
  widths: require("./tokens").widths,
  zIndex: require("./tokens").zIndex,
  
  // Components
  button: require("./components").button,
  card: require("./components").card,
  input: require("./components").input,
  container: require("./components").container,
  list: require("./components").list,
  modal: require("./components").modal,
  
  // Status & Colors
  statusColors: require("./status").statusColors,
  progressColors: require("./status").progressColors,
  intensityColors: require("./status").intensityColors,
  
  // Fitness specific
  difficultyColors: require("./fitness").difficultyColors,
  muscleGroupColors: require("./fitness").muscleGroupColors,
  fitnessSizes: require("./fitness").fitnessSizes,
  workoutStatusColors: require("./fitness").workoutStatusColors,
  fitnessStyles: require("./fitness").fitnessStyles,
  fitnessAnimations: require("./fitness").fitnessAnimations,
} as const;

/**
 * פונקציות עזר נפוצות
 */
export const helpers = {
  // Spacing helpers
  getSpacing: require("./spacing").getSpacing,
  getCustomSpacing: require("./spacing").getCustomSpacing,
  calculateGridItemWidth: require("./spacing").calculateGridItemWidth,
  
  // Typography helpers
  getTypography: require("./typography").getTypography,
  createTypographyStyle: require("./typography").createTypographyStyle,
  
  // Shadow helpers
  getShadow: require("./shadows").getShadow,
  createCustomShadow: require("./shadows").createCustomShadow,
  getInteractiveShadow: require("./shadows").getInteractiveShadow,
  
  // Animation helpers
  getTiming: require("./animations").getTiming,
  createAnimation: require("./animations").createAnimation,
  getStateAnimation: require("./animations").getStateAnimation,
  getStaggerDelay: require("./animations").getStaggerDelay,
  
  // Token helpers
  getBorderRadius: require("./tokens").getBorderRadius,
  getBreakpoint: require("./tokens").getBreakpoint,
  getResponsiveValue: require("./tokens").getResponsiveValue,
  
  // Status helpers
  getStatusColors: require("./status").getStatusColors,
  getProgressColors: require("./status").getProgressColors,
  getDifficultyColors: require("./status").getDifficultyColors,
  getIntensityColors: require("./status").getIntensityColors,
  
  // Fitness helpers
  getMuscleGroupColor: require("./fitness").getMuscleGroupColor,
  getDifficultyColor: require("./fitness").getDifficultyColor,
  getExerciseTypeColor: require("./fitness").getExerciseTypeColor,
  getIntensityColor: require("./fitness").getIntensityColor,
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
    video: 16/9,
    photo: 4/3,
  },
  
  // Z-index layers
  Z_INDEX: require("./tokens").zIndex,
  
  // Breakpoints
  BREAKPOINTS: require("./tokens").breakpoints,
  
  // Animation durations
  DURATIONS: require("./animations").timing,
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