// src/theme/designSystem.ts
// Design System מאורגן עם מודולים נפרדים

// ייבוא כל מערכת העיצוב מהמודולים החדשים
export * from "./design";

// תאימות לאחור - שמירה על exports הישנים
export {
  // Core systems
  spacing,
  typography,
  shadows,
  borderRadius,

  // Animations
  timing as animations,

  // Components
  button as components,
  card,
  input,
  container,

  // Status & Colors
  statusColors,
  progressColors as fitnessTokens,

  // Helpers
  helpers,
  designSystem,
  constants,
} from "./design";

// ייבוא מערכת הצבעים הקיימת
import { colors } from "./colors";

/**
 * אובייקט מרכזי לתאימות לאחור
 */
export const legacyDesignSystem = {
  spacing: require("./design/spacing").spacing,
  typography: require("./design/typography").typography,
  shadows: require("./design/shadows").shadows,
  borderRadius: require("./design/tokens").borderRadius,

  animations: {
    timing: require("./design/animations").timing,
    easing: require("./design/animations").easing,
  },

  components: {
    button: require("./design/components").button,
    card: require("./design/components").card,
    input: require("./design/components").input,
    container: require("./design/components").container,
  },

  statusColors: require("./design/status").statusColors,
  fitnessTokens: require("./design/fitness").difficultyColors,

  colors,
} as const;

// ברירת מחדל לייצוא
export default legacyDesignSystem;
