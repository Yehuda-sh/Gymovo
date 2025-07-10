// src/theme/index.ts
// מערכת Theme מרכזית עם תמיכת RTL מלאה

import { colors } from "./colors";

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

  // 🔤 טיפוגרפיה מלאה
  typography: {
    h1: { fontSize: 32, fontWeight: "bold" as const, lineHeight: 40 },
    h2: { fontSize: 28, fontWeight: "bold" as const, lineHeight: 36 },
    h3: { fontSize: 24, fontWeight: "600" as const, lineHeight: 32 },
    h4: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 24 },
    bodyLarge: { fontSize: 18, fontWeight: "400" as const, lineHeight: 26 },
    caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 },
    small: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
    fontSize: {
      small: 12,
      medium: 16,
      large: 20,
      xlarge: 24,
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      bold: "700",
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

  // 📱 Breakpoints
  breakpoints: {
    sm: 320,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // 🔄 RTL Support (basic)
  rtl: {
    isRTL: false,
    textAlign: "left",
    flexDirection: "row",
  },
};

// Export colors separately
export { colors };

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
