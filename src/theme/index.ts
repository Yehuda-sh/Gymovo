// src/theme/index.ts
// מערכת Theme מרכזית עם תמיכת RTL מלאה

import { colors } from "./colors";
import {
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacing,
  typography,
  textVariants,
  typographyUtils,
} from "./typography";
import {
  rtlConfig,
  rtlText,
  rtlView,
  rtlSafe,
  rtlStyles,
  rtlIcons,
  rtlHelpers,
} from "./rtl";

export const theme = {
  // 🎨 צבעים
  colors,

  // 📏 ספייסינג
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // 🔤 טיפוגרפיה - עם RTL
  typography: typography,

  // 🎨 צללים
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.16,
      shadowRadius: 24,
      elevation: 12,
    },
  },

  // 📐 רדיוסים
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 999,
  },

  // ⏱️ אנימציות
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },

  // 📱 Breakpoints
  breakpoints: {
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // 🔄 RTL Utilities
  rtl: rtlStyles,
  rtlHelpers: rtlHelpers,
  rtlIcons: rtlIcons,
};

// Export typography utilities separately
export {
  fontFamilies,
  fontScale,
  fontWeights,
  lineHeights,
  letterSpacing,
  textVariants,
  typographyUtils,
};

// Export RTL utilities separately
export {
  rtlConfig,
  rtlText,
  rtlView,
  rtlSafe,
  rtlStyles,
  rtlIcons,
  rtlHelpers,
};

// TypeScript Types
export type Theme = typeof theme;
export type Colors = typeof theme.colors;
export type Spacing = keyof typeof theme.spacing;
export type Typography = keyof typeof theme.typography;
export type Shadows = keyof typeof theme.shadows;
export type BorderRadius = keyof typeof theme.borderRadius;
export type AnimationDuration = keyof typeof theme.animation;

// Default export
export default theme;
