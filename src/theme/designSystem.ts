// src/theme/designSystem.ts - Design System מתוקן סופית לקבצי colors קיימים

import { Platform, TextStyle, ViewStyle } from "react-native";
import { colors } from "./colors";

// 📐 Spacing Scale - מערכת רווחים עקבית
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  enormous: 64,
  // Quick access
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
  9: 48,
  10: 64,
} as const;

// 🎨 Typography System - מערכת פונטים מקצועית
export const typography = {
  // Headers
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

  // Body Text
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

  // Special Text
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

  // Button Text
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

  // Code & Data
  mono: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  } as TextStyle,
} as const;

// 🌚 Shadow System - צללים מדורגים
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  xs: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 2.62,
    elevation: 4,
  },

  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.19,
    shadowRadius: 5.62,
    elevation: 6,
  },

  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.21,
    shadowRadius: 6.65,
    elevation: 8,
  },

  xl: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 11.95,
    elevation: 12,
  },

  // צללים מיוחדים
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  glowDanger: {
    shadowColor: "#ff3366",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
} as const;

// 📏 Border Radius Scale
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  full: 999,
} as const;

// ⚡ Animation Timing
export const animations = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    // React Native Easing equivalents
    linear: { duration: 250 },
    spring: { tension: 100, friction: 8 },
    bounce: { tension: 50, friction: 4 },
  },
} as const;

// 📱 Component Styles - סגנונות בסיסיים לרכיבים
export const components = {
  // Button Styles
  button: {
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

    primary: {
      backgroundColor: colors.primary,
    } as ViewStyle,

    secondary: {
      backgroundColor: "#1a1a1a", // צבע קבוע במקום colors.surface
      borderWidth: 1,
      borderColor: "#333333", // צבע קבוע במקום colors.border
    } as ViewStyle,

    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: colors.primary,
    } as ViewStyle,

    ghost: {
      backgroundColor: "transparent",
    } as ViewStyle,

    small: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      minHeight: 36,
    } as ViewStyle,

    large: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xxl,
      minHeight: 56,
    } as ViewStyle,
  },

  // Card Styles
  card: {
    base: {
      backgroundColor: "#1e1e1e", // צבע קבוע
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#333333", // צבע קבוע
    } as ViewStyle,

    elevated: {
      ...shadows.sm,
    } as ViewStyle,

    interactive: {
      borderColor: "#444444", // צבע קבוע
    } as ViewStyle,
  },

  // Input Styles
  input: {
    base: {
      backgroundColor: "rgba(255, 255, 255, 0.05)", // צבע קבוע
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)", // צבע קבוע
      borderRadius: borderRadius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      fontSize: 16,
      color: "#ffffff", // צבע קבוע במקום colors.text
      minHeight: 48,
    } as ViewStyle & TextStyle,

    focused: {
      borderColor: colors.primary,
      borderWidth: 2,
    } as ViewStyle,

    error: {
      borderColor: "#ff3366", // צבע קבוע
      backgroundColor: "rgba(255, 51, 102, 0.05)",
    } as ViewStyle,
  },

  // Container Styles
  container: {
    screen: {
      flex: 1,
      backgroundColor: "#0a0a0a", // צבע קבוע במקום colors.background
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

    spaceBetween: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    } as ViewStyle,
  },
} as const;

// 🚦 Status Colors - צבעים לפי סטטוס
export const statusColors = {
  success: {
    background: `${colors.success}10`,
    border: colors.success,
    text: colors.success,
    icon: colors.success,
  },

  warning: {
    background: `${colors.warning}10`,
    border: colors.warning,
    text: colors.warning,
    icon: colors.warning,
  },

  danger: {
    background: "#ff336610", // צבע קבוע
    border: "#ff3366", // צבע קבוע
    text: "#ff3366", // צבע קבוע
    icon: "#ff3366", // צבע קבוע
  },

  info: {
    background: `${colors.info}10`,
    border: colors.info,
    text: colors.info,
    icon: colors.info,
  },
} as const;

// 🏋️ Fitness-specific Design Tokens
export const fitnessTokens = {
  // Exercise difficulty colors
  difficulty: {
    beginner: {
      color: colors.success,
      background: `${colors.success}15`,
      border: `${colors.success}30`,
    },
    intermediate: {
      color: colors.warning,
      background: `${colors.warning}15`,
      border: `${colors.warning}30`,
    },
    advanced: {
      color: "#ff3366", // צבע קבוע
      background: "#ff336615",
      border: "#ff336630",
    },
  },

  // Workout intensity
  intensity: {
    low: colors.success,
    medium: colors.warning,
    high: "#ff3366", // צבע קבוע
    extreme: "#ff6b35", // צבע קבוע
  },

  // Progress indicators
  progress: {
    incomplete: "#333333", // צבע קבוע
    inProgress: colors.primary,
    complete: colors.success,
  },
} as const;

// 📱 Breakpoints למסכים שונים
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// 🎯 Utility Functions
export const utils = {
  // צבע עם שקיפות
  withOpacity: (color: string, opacity: number): string => {
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },

  // צבע difficulty
  getDifficultyStyle: (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "קל":
        return fitnessTokens.difficulty.beginner;
      case "intermediate":
      case "בינוני":
        return fitnessTokens.difficulty.intermediate;
      case "advanced":
      case "מתקדם":
        return fitnessTokens.difficulty.advanced;
      default:
        return fitnessTokens.difficulty.intermediate;
    }
  },

  // משתני CSS למסכי רשת
  getCSSVariables: () => ({
    "--primary": colors.primary,
    "--background": "#0a0a0a",
    "--text": "#ffffff",
    "--spacing-md": `${spacing.md}px`,
    "--border-radius-md": `${borderRadius.md}px`,
  }),
} as const;

// 📦 Export everything
export const designSystem = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
  components,
  statusColors,
  fitnessTokens,
  breakpoints,
  utils,
} as const;

export default designSystem;
