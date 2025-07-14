// src/theme/designSystem.ts
// מערכת עיצוב מרכזית לאפליקציה

export const designSystem = {
  // צבעים ראשיים
  colors: {
    primary: {
      main: "#007AFF",
      light: "#4DA2FF",
      dark: "#0051D5",
      contrast: "#FFFFFF",
    },
    secondary: {
      main: "#5856D6",
      light: "#8280E0",
      dark: "#3F3DBF",
      contrast: "#FFFFFF",
    },
    accent: {
      purple: "#8B5CF6",
      pink: "#EC4899",
      orange: "#F97316",
      blue: "#3B82F6",
      green: "#10B981",
      yellow: "#F59E0B",
      red: "#EF4444",
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    neutral: {
      white: "#FFFFFF",
      black: "#000000",
      gray: {
        50: "#F9FAFB",
        100: "#F3F4F6",
        200: "#E5E7EB",
        300: "#D1D5DB",
        400: "#9CA3AF",
        500: "#6B7280",
        600: "#4B5563",
        700: "#374151",
        800: "#1F2937",
        900: "#111827",
      },
    },
  },

  // גרדיאנטים
  gradients: {
    primary: {
      colors: ["#007AFF", "#0051D5"],
      angle: 45,
    },
    secondary: {
      colors: ["#5856D6", "#8B5CF6"],
      angle: 45,
    },
    accent: {
      purple: {
        colors: ["#8B5CF6", "#EC4899"],
        angle: 45,
      },
      orange: {
        colors: ["#F97316", "#EF4444"],
        angle: 45,
      },
      blue: {
        colors: ["#3B82F6", "#007AFF"],
        angle: 45,
      },
      green: {
        colors: ["#10B981", "#059669"],
        angle: 45,
      },
    },
  },

  // מרווחים
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // טיפוגרפיה
  typography: {
    fontFamily: {
      primary: "System",
      secondary: "System",
      mono: "Menlo, monospace",
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // רדיוסים
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // צללים
  shadows: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    xxl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },

  // אנימציות
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      linear: "linear",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
    },
  },
} as const;

// טיפוסים
export type DesignSystem = typeof designSystem;
export type Color = keyof typeof designSystem.colors;
export type Spacing = keyof typeof designSystem.spacing;
export type FontSize = keyof typeof designSystem.typography.fontSize;
export type FontWeight = keyof typeof designSystem.typography.fontWeight;
export type BorderRadius = keyof typeof designSystem.borderRadius;
export type Shadow = keyof typeof designSystem.shadows;
