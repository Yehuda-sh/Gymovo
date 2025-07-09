// src/theme/design/typography/index.ts
// מערכת טיפוגרפיה מקצועית עם תמיכה בעברית

import { Platform, TextStyle } from "react-native";

/**
 * מערכת טיפוגרפיה בת 8 דרגות
 * כולל headers, body text, ותווים מיוחדים
 */
export const typography = {
  // Headers - כותרות
  h1: {
    fontSize: 32,
    fontWeight: "900" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,

  h2: {
    fontSize: 28,
    fontWeight: "800" as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  } as TextStyle,

  h3: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  } as TextStyle,

  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  } as TextStyle,

  h5: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  } as TextStyle,

  h6: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 22,
  } as TextStyle,

  // Body Text - טקסט גוף
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
  } as TextStyle,

  bodySemiBold: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  } as TextStyle,

  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  } as TextStyle,

  bodyLarge: {
    fontSize: 18,
    fontWeight: "400" as const,
    lineHeight: 26,
  } as TextStyle,

  // Special Text - טקסט מיוחד
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  } as TextStyle,

  overline: {
    fontSize: 10,
    fontWeight: "700" as const,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  } as TextStyle,

  label: {
    fontSize: 14,
    fontWeight: "500" as const,
    lineHeight: 20,
  } as TextStyle,

  // Button Text - טקסט כפתורים
  buttonLarge: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  } as TextStyle,

  buttonMedium: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 20,
  } as TextStyle,

  buttonSmall: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 18,
  } as TextStyle,

  // Code & Data - קוד ונתונים
  mono: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  } as TextStyle,
} as const;

/**
 * טיפוסים עבור מפתחות הטיפוגרפיה
 */
export type TypographyKey = keyof typeof typography;

/**
 * גודלי פונט נפוצים
 */
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
  enormous: 36,
} as const;

/**
 * משקלי פונט
 */
export const fontWeights = {
  thin: "100" as const,
  ultraLight: "200" as const,
  light: "300" as const,
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  heavy: "800" as const,
  black: "900" as const,
} as const;

/**
 * גובה שורות
 */
export const lineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;

/**
 * מרווחי אותיות
 */
export const letterSpacings = {
  tighter: -0.5,
  tight: -0.3,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 1.5,
} as const;

/**
 * פונקציה לקבלת סגנון טיפוגרפיה
 * @param key - מפתח הטיפוגרפיה
 * @returns סגנון הטקסט
 */
export const getTypography = (key: TypographyKey): TextStyle => {
  return typography[key];
};

/**
 * פונקציה ליצירת סגנון טיפוגרפיה מותאם
 * @param base - סגנון בסיסי
 * @param overrides - שינויים
 * @returns סגנון מותאם
 */
export const createTypographyStyle = (
  base: TypographyKey,
  overrides: Partial<TextStyle>
): TextStyle => {
  return {
    ...typography[base],
    ...overrides,
  };
};

/**
 * סגנונות מיוחדים לכושר
 */
export const fitnessTypography = {
  // מספרי סטטיסטיקות
  statNumber: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 28,
  } as TextStyle,

  statLabel: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 16,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
  } as TextStyle,

  // מספרי סטים
  setNumber: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  } as TextStyle,

  // זמנים
  timer: {
    fontSize: 32,
    fontWeight: "800" as const,
    lineHeight: 40,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  } as TextStyle,

  // קלוריות
  calories: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 24,
  } as TextStyle,
} as const;
