// src/theme/typography.ts
// מערכת טיפוגרפיה מתוקנת עם תמיכת RTL מלאה

import { Platform, TextStyle } from "react-native";

/**
 * Font Families - מותאמות לעברית
 */
const fontFamilies = {
  // Primary fonts with Hebrew support
  primary: Platform.select({
    ios: "System", // SF Pro supports Hebrew well
    android: "sans-serif",
    default: "System",
  }),

  secondary: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),

  // Monospace for numbers
  mono: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }),

  // Hebrew optimized
  hebrew: Platform.select({
    ios: "System",
    android: "sans-serif",
    default: "System",
  }),
};

/**
 * Font Scales
 */
const fontScale = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  "4xl": 32,
  "5xl": 40,
  "6xl": 48,
  hero: 56,
  massive: 64,
} as const;

/**
 * Font Weights
 */
const fontWeights = {
  thin: "100" as const,
  extraLight: "200" as const,
  light: "300" as const,
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extraBold: "800" as const,
  black: "900" as const,
} as const;

/**
 * Line Heights
 */
const lineHeights = {
  none: 1,
  tight: 1.2,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.75,
  extraLoose: 2,
} as const;

/**
 * Letter Spacing
 */
const letterSpacing = {
  tighter: -1.5,
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
  extraWide: 3,
} as const;

/**
 * Base RTL text style
 */
const rtlBase: TextStyle = {
  textAlign: "right",
  writingDirection: "rtl",
};

/**
 * Typography Styles - כל הסגנונות עם RTL
 */
const typography = {
  // Display & Headers - RTL aligned
  display: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.hero,
    fontWeight: fontWeights.black,
    lineHeight: fontScale.hero * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    ...rtlBase,
  } as TextStyle,

  h1: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["5xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["5xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
    ...rtlBase,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["4xl"] * lineHeights.snug,
    ...rtlBase,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["3xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["3xl"] * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  h4: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["2xl"] * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  h5: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.xl,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.xl * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  h6: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.lg * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  // Body Text - RTL aligned
  body: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.base * lineHeights.relaxed,
    ...rtlBase,
  } as TextStyle,

  bodyLarge: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.relaxed,
    ...rtlBase,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.sm * lineHeights.relaxed,
    ...rtlBase,
  } as TextStyle,

  // Special Text Types - RTL aligned
  subtitle: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.md * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    ...rtlBase,
  } as TextStyle,

  caption: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.xs * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    ...rtlBase,
  } as TextStyle,

  overline: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.xs,
    fontWeight: fontWeights.bold,
    lineHeight: fontScale.xs * lineHeights.normal,
    letterSpacing: letterSpacing.extraWide,
    textTransform: "uppercase" as const,
    ...rtlBase,
  } as TextStyle,

  // Buttons - Center aligned for buttons
  buttonLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textAlign: "center", // Buttons are usually centered
  } as TextStyle,

  buttonMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.base * lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textAlign: "center",
  } as TextStyle,

  buttonSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.sm * lineHeights.none,
    letterSpacing: letterSpacing.normal,
    textAlign: "center",
  } as TextStyle,

  // Data & Numbers - Can be LTR for numbers
  dataLarge: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["4xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
    textAlign: "center", // Numbers usually centered
  } as TextStyle,

  dataMedium: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["2xl"] * lineHeights.snug,
    textAlign: "center",
  } as TextStyle,

  dataSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.md * lineHeights.normal,
    textAlign: "center",
  } as TextStyle,

  // Form Elements - RTL aligned
  label: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    ...rtlBase,
  } as TextStyle,

  input: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  placeholder: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.normal,
    opacity: 0.6,
    ...rtlBase,
  } as TextStyle,

  // Hebrew Specific - Already RTL
  hebrewDisplay: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["4xl"] * lineHeights.snug,
    ...rtlBase,
  } as TextStyle,

  hebrewTitle: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["2xl"] * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  hebrewBody: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.relaxed,
    ...rtlBase,
  } as TextStyle,

  hebrewCaption: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.sm * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  // App Specific - Workout styles
  workoutTitle: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["2xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    ...rtlBase,
  } as TextStyle,

  exerciseName: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  setNumber: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.xl,
    fontWeight: fontWeights.bold,
    lineHeight: fontScale.xl * lineHeights.none,
    textAlign: "center",
  } as TextStyle,

  repCount: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.none,
    textAlign: "center",
  } as TextStyle,

  weight: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.md * lineHeights.none,
    textAlign: "center",
  } as TextStyle,

  timer: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["3xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["3xl"] * lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textAlign: "center",
  } as TextStyle,

  // Stats
  statsTitle: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
    ...rtlBase,
  } as TextStyle,

  statsValue: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["3xl"],
    fontWeight: fontWeights.extraBold,
    lineHeight: fontScale["3xl"] * lineHeights.tight,
    textAlign: "center",
  } as TextStyle,

  statsUnit: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase" as const,
    ...rtlBase,
  } as TextStyle,

  // Status messages
  success: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.base * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  error: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.base * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,

  warning: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.base * lineHeights.normal,
    ...rtlBase,
  } as TextStyle,
};

/**
 * Typography Utilities
 */
const typographyUtils = {
  // Create text style with RTL
  createTextStyle: (
    size: keyof typeof fontScale,
    weight: keyof typeof fontWeights,
    family: keyof typeof fontFamilies = "secondary",
    align: "left" | "center" | "right" = "right"
  ): TextStyle => ({
    fontFamily: fontFamilies[family],
    fontSize: fontScale[size],
    fontWeight: fontWeights[weight],
    lineHeight: fontScale[size] * lineHeights.normal,
    textAlign: align,
    writingDirection: "rtl",
  }),

  // Create Hebrew text style
  createHebrewStyle: (
    size: keyof typeof fontScale,
    weight: keyof typeof fontWeights
  ): TextStyle => ({
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale[size],
    fontWeight: fontWeights[weight],
    lineHeight: fontScale[size] * lineHeights.relaxed,
    textAlign: "right",
    writingDirection: "rtl",
  }),

  // Get responsive size
  getResponsiveSize: (baseSize: number, scaleFactor: number = 1): number => {
    return baseSize * scaleFactor;
  },

  // Apply RTL to any text style
  applyRTL: (style: TextStyle): TextStyle => ({
    ...style,
    textAlign: "right",
    writingDirection: "rtl",
  }),

  // Center text (for buttons, numbers, etc)
  centerText: (style: TextStyle): TextStyle => ({
    ...style,
    textAlign: "center",
  }),
};

/**
 * Text Variants
 */
const textVariants = {
  // Headers
  display: typography.display,
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  h4: typography.h4,
  h5: typography.h5,
  h6: typography.h6,

  // Body
  body: typography.body,
  "body-large": typography.bodyLarge,
  "body-small": typography.bodySmall,

  // Special
  subtitle: typography.subtitle,
  caption: typography.caption,
  overline: typography.overline,

  // Buttons
  button: typography.buttonMedium,
  "button-large": typography.buttonLarge,
  "button-small": typography.buttonSmall,

  // Data
  data: typography.dataMedium,
  "data-large": typography.dataLarge,
  "data-small": typography.dataSmall,

  // Hebrew
  hebrew: typography.hebrewBody,
  "hebrew-title": typography.hebrewTitle,
  "hebrew-display": typography.hebrewDisplay,

  // App Specific
  "workout-title": typography.workoutTitle,
  "exercise-name": typography.exerciseName,
  timer: typography.timer,
  "stats-value": typography.statsValue,
} as const;

export type TextVariant = keyof typeof textVariants;

/**
 * Default Export
 */
export default {
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacing,
  typography,
  textVariants,
  typographyUtils,
};

// Named exports for easier use
export {
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacing,
  typography,
  textVariants,
  typographyUtils,
};
