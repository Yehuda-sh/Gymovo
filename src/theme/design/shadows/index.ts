// src/theme/design/shadows/index.ts
// מערכת צללים מדורגת עבור Android ו-iOS

import { ViewStyle } from "react-native";
import { colors } from "../../colors";

/**
 * מערכת צללים בת 6 דרגות
 * כולל תמיכה בעלבציון וגלואינג
 */
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  xs: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  } as ViewStyle,

  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 2.62,
    elevation: 4,
  } as ViewStyle,

  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
  } as ViewStyle,

  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.21,
    shadowRadius: 6.65,
    elevation: 8,
  } as ViewStyle,

  xl: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 11.95,
    elevation: 12,
  } as ViewStyle,

  // צללים מיוחדים
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  } as ViewStyle,

  glowDanger: {
    shadowColor: "#ff3366",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  } as ViewStyle,

  glowSuccess: {
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  } as ViewStyle,

  glowWarning: {
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  } as ViewStyle,
} as const;

/**
 * טיפוסים עבור מפתחות הצללים
 */
export type ShadowKey = keyof typeof shadows;

/**
 * פונקציה לקבלת צל
 * @param key - מפתח הצל
 * @returns סגנון הצל
 */
export const getShadow = (key: ShadowKey): ViewStyle => {
  return shadows[key];
};

/**
 * פונקציה ליצירת צל מותאם
 * @param color - צבע הצל
 * @param intensity - עוצמת הצל (0-1)
 * @param radius - רדיוס הצל
 * @param elevation - עלבציון לAndroid
 * @returns סגנון צל מותאם
 */
export const createCustomShadow = (
  color: string = "#000000",
  intensity: number = 0.2,
  radius: number = 4,
  elevation: number = 6
): ViewStyle => {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: radius / 2 },
    shadowOpacity: intensity,
    shadowRadius: radius,
    elevation: elevation,
  };
};

/**
 * צללים עבור רכיבים ספציפיים
 */
export const componentShadows = {
  // Cards
  card: shadows.sm,
  cardHover: shadows.md,
  cardPressed: shadows.xs,

  // Buttons
  button: shadows.xs,
  buttonHover: shadows.sm,
  buttonPressed: shadows.none,

  // Modals
  modal: shadows.xl,
  overlay: shadows.lg,

  // Navigation
  tabBar: shadows.md,
  header: shadows.sm,

  // Floating elements
  fab: shadows.lg,
  tooltip: shadows.md,
  dropdown: shadows.lg,
} as const;

/**
 * צללים עבור מצבי כושר
 */
export const fitnessShadows = {
  // Workout cards
  workoutCard: shadows.sm,
  activeWorkout: shadows.glow,
  completedWorkout: shadows.glowSuccess,

  // Exercise items
  exerciseItem: shadows.xs,
  exerciseItemActive: shadows.sm,

  // Progress indicators
  progressCard: shadows.sm,
  achievementBadge: shadows.md,

  // Stats
  statCard: shadows.xs,
  statCardHighlight: shadows.sm,
} as const;

/**
 * פונקציה לקבלת צל לפי מצב
 * @param isPressed - האם הרכיב נלחץ
 * @param isHovered - האם הרכיב בהוגר
 * @param isActive - האם הרכיב פעיל
 * @returns סגנון צל מתאים
 */
export const getInteractiveShadow = (
  isPressed: boolean = false,
  isHovered: boolean = false,
  isActive: boolean = false
): ViewStyle => {
  if (isPressed) return shadows.none;
  if (isActive) return shadows.glow;
  if (isHovered) return shadows.md;
  return shadows.sm;
};
