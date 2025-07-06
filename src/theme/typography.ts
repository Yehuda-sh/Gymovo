// src/theme/typography.ts - פונטים מקצועיים

import { Platform } from "react-native";

// מפת פונטים מקצועיים לפלטפורמות שונות
export const fonts = {
  // פונטים אנגליים מקצועיים
  english: {
    // פונט ראשי - מודרני וחד
    primary: Platform.select({
      ios: "Futura",
      android: "sans-serif-condensed",
      default: "System",
    }),

    // פונט מונו - טכנולוגי
    mono: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "Courier",
    }),

    // פונט display - מרשים לכותרות
    display: Platform.select({
      ios: "Avenir Next",
      android: "sans-serif-medium",
      default: "System",
    }),

    // פונט light - אלגנטי
    light: Platform.select({
      ios: "Helvetica Neue",
      android: "sans-serif-light",
      default: "System",
    }),
  },

  // פונטים עבריים
  hebrew: {
    primary: Platform.select({
      ios: "Hebrew",
      android: "sans-serif",
      default: "System",
    }),

    secondary: Platform.select({
      ios: "Hebrew",
      android: "sans-serif-medium",
      default: "System",
    }),
  },
};

// סגנונות טיפוגרפיה מקצועיים
export const typography = {
  // כותרות אנגליות
  brandTitle: {
    fontFamily: fonts.english.primary,
    fontSize: 48,
    fontWeight: "900" as const,
    letterSpacing: 8,
    textTransform: "uppercase" as const,
  },

  tagline: {
    fontFamily: fonts.english.mono,
    fontSize: 16,
    fontWeight: "800" as const,
    letterSpacing: 4,
    textTransform: "uppercase" as const,
  },

  buttonText: {
    fontFamily: fonts.english.display,
    fontSize: 16,
    fontWeight: "700" as const,
    letterSpacing: 1,
  },

  devText: {
    fontFamily: fonts.english.mono,
    fontSize: 12,
    fontWeight: "800" as const,
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },

  // טקסטים עבריים
  hebrewTitle: {
    fontFamily: fonts.hebrew.primary,
    fontSize: 20,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },

  hebrewBody: {
    fontFamily: fonts.hebrew.secondary,
    fontSize: 16,
    fontWeight: "400" as const,
    textAlign: "center" as const,
  },

  // גדלים ומשקלים
  sizes: {
    xs: 10,
    sm: 12,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    hero: 56,
  },

  weights: {
    light: "300" as const,
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
    black: "900" as const,
  },

  // גובהי שורה
  lineHeights: {
    tight: 1.1,
    snug: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 2,
  },
};

// אם אתה רוצה פונטים מותאמים אישית, הוסף אותם כך:
export const customFonts = {
  // TODO: להוסיף פונטים מותאמים
  // 'RobotoCondensed-Bold': require('../assets/fonts/RobotoCondensed-Bold.ttf'),
  // 'Orbitron-Black': require('../assets/fonts/Orbitron-Black.ttf'),
};
