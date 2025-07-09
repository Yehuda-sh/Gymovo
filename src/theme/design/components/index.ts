// src/theme/design/components/index.ts
// סגנונות בסיסיים לרכיבים נפוצים

import { ViewStyle, TextStyle } from "react-native";
import { colors } from "../../colors";
import { spacing } from "../spacing";
import { borderRadius } from "../tokens";
import { shadows } from "../shadows";

/**
 * סגנונות כפתורים
 */
export const button = {
  base: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: spacing.sm,
    minHeight: 48,
  } as ViewStyle,

  // Variants
  primary: {
    backgroundColor: colors.primary,
  } as ViewStyle,

  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,

  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  } as ViewStyle,

  ghost: {
    backgroundColor: "transparent",
  } as ViewStyle,

  danger: {
    backgroundColor: colors.error,
  } as ViewStyle,

  success: {
    backgroundColor: colors.success,
  } as ViewStyle,

  // Sizes
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  } as ViewStyle,

  medium: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  } as ViewStyle,

  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 56,
  } as ViewStyle,

  // States
  disabled: {
    opacity: 0.5,
  } as ViewStyle,

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,
} as const;

/**
 * סגנונות כרטיסיות
 */
export const card = {
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  } as ViewStyle,

  elevated: {
    ...shadows.sm,
  } as ViewStyle,

  interactive: {
    borderColor: colors.primary + "30",
  } as ViewStyle,

  // Variants
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.border,
  } as ViewStyle,

  filled: {
    backgroundColor: colors.surface,
    borderWidth: 0,
  } as ViewStyle,

  // Sizes
  small: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
  } as ViewStyle,

  medium: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
  } as ViewStyle,

  large: {
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
  } as ViewStyle,
} as const;

/**
 * סגנונות שדות קלט
 */
export const input = {
  base: {
    backgroundColor: colors.surface + "80",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    color: colors.text,
    minHeight: 48,
  } as ViewStyle & TextStyle,

  // States
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surface + "FF",
  } as ViewStyle,

  error: {
    borderColor: colors.error,
    backgroundColor: colors.error + "10",
  } as ViewStyle,

  disabled: {
    backgroundColor: colors.surface + "40",
    color: colors.text + "60",
  } as ViewStyle & TextStyle,

  // Sizes
  small: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    fontSize: 14,
  } as ViewStyle & TextStyle,

  large: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
    fontSize: 18,
  } as ViewStyle & TextStyle,
} as const;

/**
 * סגנונות קונטיינרים
 */
export const container = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,

  content: {
    flex: 1,
    padding: spacing.xl,
  } as ViewStyle,

  centered: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: spacing.xl,
  } as ViewStyle,

  row: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  column: {
    flexDirection: "column" as const,
  } as ViewStyle,

  spaceBetween: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  spaceAround: {
    flexDirection: "row" as const,
    justifyContent: "space-around" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  spaceEvenly: {
    flexDirection: "row" as const,
    justifyContent: "space-evenly" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  wrap: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
  } as ViewStyle,
} as const;

/**
 * סגנונות רשימות
 */
export const list = {
  container: {
    flex: 1,
  } as ViewStyle,

  item: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,

  itemLast: {
    borderBottomWidth: 0,
  } as ViewStyle,

  separator: {
    height: 1,
    backgroundColor: colors.border,
  } as ViewStyle,

  header: {
    padding: spacing.md,
    backgroundColor: colors.surface + "80",
  } as ViewStyle,

  footer: {
    padding: spacing.md,
    alignItems: "center" as const,
  } as ViewStyle,
} as const;

/**
 * סגנונות מודאליים
 */
export const modal = {
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  } as ViewStyle,

  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    padding: spacing.xxl,
    margin: spacing.xl,
    maxWidth: "90%",
    maxHeight: "80%",
    ...shadows.xl,
  } as ViewStyle,

  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,

  content: {
    flex: 1,
    padding: spacing.lg,
  } as ViewStyle,

  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row" as const,
    justifyContent: "flex-end" as const,
    gap: spacing.md,
  } as ViewStyle,
} as const;

/**
 * סגנונות עבור מרכיבי כושר
 */
export const fitnessComponents = {
  // Workout card
  workoutCard: {
    ...card.base,
    ...card.elevated,
    marginBottom: spacing.md,
  } as ViewStyle,

  // Exercise item
  exerciseItem: {
    ...card.base,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  } as ViewStyle,

  // Set row
  setRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  } as ViewStyle,

  // Progress bar
  progressBar: {
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: "hidden" as const,
  } as ViewStyle,

  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  } as ViewStyle,

  // Stats card
  statsCard: {
    ...card.base,
    alignItems: "center" as const,
    padding: spacing.lg,
    minWidth: 100,
  } as ViewStyle,

  // Timer
  timerContainer: {
    ...card.base,
    ...card.elevated,
    alignItems: "center" as const,
    padding: spacing.xxl,
  } as ViewStyle,
} as const; 