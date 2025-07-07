// src/theme/typography.ts - Enhanced Typography System לשלב 2

import { Platform, TextStyle } from "react-native";

// 🎨 Font Families - מותאמות לכושר וטכנולוגיה
export const fontFamilies = {
  // English Fonts
  primary: Platform.select({
    ios: "SF Pro Display", // Modern, athletic
    android: "Roboto",
    default: "System",
  }),

  secondary: Platform.select({
    ios: "SF Pro Text",
    android: "Roboto",
    default: "System",
  }),

  // טכנולוגיים לנתונים
  mono: Platform.select({
    ios: "SF Mono",
    android: "Roboto Mono",
    default: "Courier New",
  }),

  // מודרני לכותרות גדולות
  display: Platform.select({
    ios: "SF Pro Display",
    android: "Roboto Condensed",
    default: "System",
  }),

  // Hebrew Fonts
  hebrew: Platform.select({
    ios: "SF Pro Display", // תומך עברית מצוין
    android: "Noto Sans Hebrew",
    default: "System",
  }),
};

// 📏 Font Scales - responsive וגמיש
export const fontScale = {
  // Base sizes
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

// ⚖️ Font Weights
export const fontWeights = {
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

// 📐 Line Heights - המבוססים על golden ratio
export const lineHeights = {
  none: 1,
  tight: 1.1,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
  extraLoose: 2.0,
} as const;

// 🔤 Letter Spacing
export const letterSpacing = {
  tighter: -1.5,
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
  extraWide: 3,
} as const;

// 🎯 Typography Styles - מערכת שלמה לכל השימושים
export const typography = {
  // 📱 Headers - לכותרות ראשיות
  display: {
    fontFamily: fontFamilies.display,
    fontSize: fontScale.hero,
    fontWeight: fontWeights.black,
    lineHeight: fontScale.hero * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h1: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["5xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["5xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h2: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["4xl"] * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h3: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["3xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["3xl"] * lineHeights.normal,
  } as TextStyle,

  h4: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["2xl"] * lineHeights.normal,
  } as TextStyle,

  h5: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.xl,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.xl * lineHeights.normal,
  } as TextStyle,

  h6: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.lg * lineHeights.normal,
  } as TextStyle,

  // 📄 Body Text - לתוכן רגיל
  body: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.base * lineHeights.relaxed,
  } as TextStyle,

  bodyLarge: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.relaxed,
  } as TextStyle,

  bodySmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.sm * lineHeights.relaxed,
  } as TextStyle,

  // 🎯 Special Text Types
  subtitle: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.md * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  caption: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.xs * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  overline: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.xs,
    fontWeight: fontWeights.bold,
    lineHeight: fontScale.xs * lineHeights.normal,
    letterSpacing: letterSpacing.extraWide,
    textTransform: "uppercase" as const,
  } as TextStyle,

  // 🔘 Button Text - לכפתורים
  buttonLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.none,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  } as TextStyle,

  buttonMedium: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.base * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  buttonSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.sm * lineHeights.none,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // 🔢 Data & Numbers - לסטטיסטיקות ונתונים
  dataLarge: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["4xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  dataMedium: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["2xl"] * lineHeights.snug,
  } as TextStyle,

  dataSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.md * lineHeights.normal,
  } as TextStyle,

  // 🏷️ Labels & Form Elements
  label: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.sm * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  input: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.normal,
  } as TextStyle,

  placeholder: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.normal,
    opacity: 0.6,
  } as TextStyle,

  // 🇮🇱 Hebrew Specific Styles
  hebrewDisplay: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["4xl"] * lineHeights.snug,
    textAlign: "right" as const,
  } as TextStyle,

  hebrewTitle: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale["2xl"] * lineHeights.normal,
    textAlign: "right" as const,
  } as TextStyle,

  hebrewBody: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.md * lineHeights.relaxed,
    textAlign: "right" as const,
  } as TextStyle,

  hebrewCaption: {
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontScale.sm * lineHeights.normal,
    textAlign: "right" as const,
  } as TextStyle,

  // 🎮 App-Specific Styles לGymovo
  workoutTitle: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["2xl"] * lineHeights.tight,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  } as TextStyle,

  exerciseName: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.normal,
  } as TextStyle,

  setNumber: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.xl,
    fontWeight: fontWeights.bold,
    lineHeight: fontScale.xl * lineHeights.none,
  } as TextStyle,

  repCount: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.none,
  } as TextStyle,

  weight: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.md * lineHeights.none,
  } as TextStyle,

  timer: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["3xl"],
    fontWeight: fontWeights.bold,
    lineHeight: fontScale["3xl"] * lineHeights.none,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // 📊 Stats & Progress
  statsTitle: {
    fontFamily: fontFamilies.primary,
    fontSize: fontScale.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontScale.lg * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  } as TextStyle,

  statsValue: {
    fontFamily: fontFamilies.mono,
    fontSize: fontScale["3xl"],
    fontWeight: fontWeights.extraBold,
    lineHeight: fontScale["3xl"] * lineHeights.tight,
  } as TextStyle,

  statsUnit: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.sm * lineHeights.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase" as const,
  } as TextStyle,

  // 🚨 Status & Feedback
  success: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.base * lineHeights.normal,
  } as TextStyle,

  error: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.base * lineHeights.normal,
  } as TextStyle,

  warning: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontScale.base,
    fontWeight: fontWeights.medium,
    lineHeight: fontScale.base * lineHeights.normal,
  } as TextStyle,
};

// 🛠️ Typography Utilities
export const typographyUtils = {
  // פונקציה ליצירת text style מותאם
  createTextStyle: (
    size: keyof typeof fontScale,
    weight: keyof typeof fontWeights,
    family: keyof typeof fontFamilies = "secondary"
  ): TextStyle => ({
    fontFamily: fontFamilies[family],
    fontSize: fontScale[size],
    fontWeight: fontWeights[weight],
    lineHeight: fontScale[size] * lineHeights.normal,
  }),

  // פונקציה לטקסט עברי מותאם
  createHebrewStyle: (
    size: keyof typeof fontScale,
    weight: keyof typeof fontWeights
  ): TextStyle => ({
    fontFamily: fontFamilies.hebrew,
    fontSize: fontScale[size],
    fontWeight: fontWeights[weight],
    lineHeight: fontScale[size] * lineHeights.relaxed,
    textAlign: "right",
  }),

  // רספונסיבי text size
  getResponsiveSize: (baseSize: number, scaleFactor: number = 1): number => {
    return baseSize * scaleFactor;
  },
};

// 🎨 Custom Fonts Configuration
export const customFonts = {
  // כאשר תוסיף פונטים מותאמים מ-Sora
  // 'GymovoBold': require('../../assets/fonts/GymovoBold.ttf'),
  // 'GymovoDisplay': require('../../assets/fonts/GymovoDisplay.ttf'),
  // 'HebrewSport': require('../../assets/fonts/HebrewSport.ttf'),
};

// 📱 Text Variants לשימוש קל ברכיבים
export const textVariants = {
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

// ✅ Default Export
export default {
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacing,
  typography,
  textVariants,
  typographyUtils,
  customFonts,
};
