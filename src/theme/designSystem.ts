// src/theme/designSystem.ts
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const designSystem = {
  // צבעים מתקדמים עם גרדיאנטים
  colors: {
    primary: {
      main: "#2E86FF",
      light: "#5FA3FF",
      dark: "#1968DB",
      gradient: ["#2E86FF", "#1968DB"],
    },
    secondary: {
      main: "#00D4AA",
      light: "#33DDBB",
      dark: "#00A888",
      gradient: ["#00D4AA", "#00A888"],
    },
    accent: {
      purple: "#8B5CF6",
      pink: "#EC4899",
      orange: "#F97316",
      gradient: ["#8B5CF6", "#EC4899"],
    },
    neutral: {
      black: "#0A0A0A",
      darkGray: "#1A1A1A",
      gray: "#2A2A2A",
      lightGray: "#3A3A3A",
      border: "#404040",
      text: {
        primary: "#FFFFFF",
        secondary: "#B0B0B0",
        tertiary: "#808080",
      },
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
    background: {
      primary: "#0A0A0A",
      secondary: "#111111",
      card: "#1A1A1A",
      elevated: "#222222",
      gradient: ["#0A0A0A", "#1A1A1A"],
    },
  },

  // טיפוגרפיה מתקדמת
  typography: {
    fontFamily: {
      regular: "System",
      medium: "System",
      bold: "System",
      black: "System",
    },
    sizes: {
      // Headings
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      h5: 18,
      h6: 16,
      // Body
      xlarge: 18,
      large: 16,
      medium: 14,
      small: 12,
      xsmall: 10,
      // Special
      display: 40,
      caption: 11,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
      wider: 1,
    },
  },

  // מרווחים עקביים
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // רדיוסים לפינות
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
    card: 16,
    button: 12,
    input: 8,
  },

  // צללים מתקדמים
  shadows: {
    none: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
      elevation: 12,
    },
    glow: {
      primary: {
        shadowColor: "#2E86FF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 0,
      },
      secondary: {
        shadowColor: "#00D4AA",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 0,
      },
    },
  },

  // אנימציות
  animations: {
    durations: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 500,
      verySlow: 1000,
    },
    easings: {
      // React Native Animated easings
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      linear: "linear",
      // Reanimated easings
      spring: {
        damping: 15,
        stiffness: 150,
      },
      bounce: {
        damping: 8,
        stiffness: 100,
      },
    },
  },

  // גדלי מסך ונקודות שבירה
  layout: {
    screenWidth: width,
    screenHeight: height,
    isSmallDevice: width < 375,
    contentPadding: 16,
    headerHeight: 56,
    tabBarHeight: 60,
    maxContentWidth: 600,
  },

  // אפקטים מיוחדים
  effects: {
    blur: {
      light: 10,
      medium: 20,
      strong: 30,
    },
    opacity: {
      disabled: 0.5,
      overlay: 0.7,
      subtle: 0.9,
    },
    scale: {
      pressed: 0.95,
      hover: 1.05,
      active: 0.98,
    },
  },

  // גרדיאנטים מוכנים
  gradients: {
    primary: {
      colors: ["#2E86FF", "#1968DB"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    secondary: {
      colors: ["#00D4AA", "#00A888"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    accent: {
      colors: ["#8B5CF6", "#EC4899"],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    dark: {
      colors: ["#1A1A1A", "#0A0A0A"],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    radial: {
      colors: ["rgba(46, 134, 255, 0.1)", "transparent"],
      center: { x: 0.5, y: 0.5 },
    },
  },

  // קונפיגורציה לרכיבים
  components: {
    button: {
      height: {
        small: 36,
        medium: 44,
        large: 52,
      },
      padding: {
        small: 12,
        medium: 16,
        large: 20,
      },
    },
    input: {
      height: 48,
      padding: 16,
    },
    card: {
      padding: 16,
      margin: 8,
    },
    avatar: {
      sizes: {
        small: 32,
        medium: 40,
        large: 56,
        xlarge: 72,
      },
    },
  },
};
