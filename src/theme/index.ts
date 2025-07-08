// src/theme/index.ts
import { colors } from "./colors";

export const theme = {
  // 🎨 צבעים - מיובאים מקובץ colors.ts
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

  // 🔤 טיפוגרפיה
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: "700" as const,
      lineHeight: 40,
      letterSpacing: -0.5,
      fontFamily: "System",
    },
    h2: {
      fontSize: 24,
      fontWeight: "600" as const,
      lineHeight: 32,
      fontFamily: "System",
    },
    h3: {
      fontSize: 20,
      fontWeight: "600" as const,
      lineHeight: 28,
      fontFamily: "System",
    },
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
      lineHeight: 24,
      fontFamily: "System",
    },
    caption: {
      fontSize: 14,
      fontWeight: "400" as const,
      lineHeight: 20,
      fontFamily: "System",
    },
    small: {
      fontSize: 12,
      fontWeight: "400" as const,
      lineHeight: 16,
      fontFamily: "System",
    },
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
      lineHeight: 24,
      letterSpacing: 0.5,
      fontFamily: "System",
    },
  },

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

  // 📱 Breakpoints (לעתיד)
  breakpoints: {
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

// TypeScript Types
export type Theme = typeof theme;
export type Colors = typeof theme.colors;
export type Spacing = keyof typeof theme.spacing;
export type Typography = keyof typeof theme.typography;
export type Shadows = keyof typeof theme.shadows;
export type BorderRadius = keyof typeof theme.borderRadius;
export type AnimationDuration = keyof typeof theme.animation;
