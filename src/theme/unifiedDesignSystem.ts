// src/theme/unifiedDesignSystem.ts
// 🎨 מערכת עיצוב מאוחדת לאפליקציה - מבוססת על מסכי Login/Welcome

import { Platform, TextStyle, ViewStyle } from "react-native";

// 🎨 פלטת צבעים ראשית - מבוססת על מסכי Auth
export const unifiedColors = {
  // צבעי גרדיאנט ראשיים
  gradients: {
    primary: ["#667eea", "#764ba2"] as [string, string],
    secondary: ["#764ba2", "#667eea"] as [string, string],
    background: ["#0f0c29", "#302b63", "#24243e"] as [string, string, string],
    dark: ["#1a1a2e", "#16213e", "#0f3460"] as [string, string, string],
    overlay: ["#000000", "#130F40"] as [string, string],
    success: ["#00ff88", "#00d68f"] as [string, string],
    error: ["#ff3366", "#ff5252"] as [string, string],
    warning: ["#FFD23F", "#FFB74D"] as [string, string],
    accent: ["#00ff88", "#00b248"] as [string, string],
  },

  // צבעים בודדים
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00ff88",

  // רקעים
  background: "#0f0c29",
  surface: "rgba(0, 0, 0, 0.3)",
  surfaceLight: "rgba(255, 255, 255, 0.05)",
  surfaceElevated: "rgba(0, 0, 0, 0.4)",

  // טקסט
  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  textMuted: "rgba(255, 255, 255, 0.5)",
  textDisabled: "rgba(255, 255, 255, 0.3)",

  // מצבים
  error: "#ff3366",
  success: "#00ff88",
  warning: "#FFD23F",
  info: "#667eea",

  // גבולות
  border: "rgba(255, 255, 255, 0.2)",
  borderLight: "rgba(255, 255, 255, 0.1)",
  borderActive: "#667eea",
  borderError: "#ff3366",

  // אינפוטים
  inputBackground: "rgba(0, 0, 0, 0.4)",
  inputBorder: "rgba(102, 126, 234, 0.4)",
  inputBorderActive: "#667eea",
  inputBorderError: "#ff3366",

  // אפקטים
  glow: "rgba(102, 126, 234, 0.3)",
  shadow: "rgba(0, 0, 0, 0.5)",
  overlay: "rgba(0, 0, 0, 0.8)",
  overlayLight: "rgba(0, 0, 0, 0.6)",

  // צבעים ייחודיים לכושר
  workoutActive: "#00ff88",
  workoutCompleted: "#00b248",
  workoutSkipped: "#757575",
  exerciseCardio: "#FF6B35",
  exerciseStrength: "#667eea",
  exerciseFlexibility: "#8B5CF6",
} as const;

// 📏 מרווחים אחידים
export const unifiedSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// 🔤 טיפוגרפיה אחידה
export const unifiedTypography = {
  fontFamily: {
    primary: Platform.OS === "ios" ? "System" : "Roboto",
    secondary: Platform.OS === "ios" ? "Avenir" : "sans-serif",
    mono: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },
  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    heavy: "800",
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

// 📐 רדיוסים אחידים
export const unifiedBorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

// 🎨 צללים אחידים
export const unifiedShadows = {
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
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  glow: {
    shadowColor: unifiedColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;

// ⏱️ אנימציות אחידות
export const unifiedAnimation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  easing: {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
  spring: {
    tension: 50,
    friction: 7,
  },
} as const;

// 🎯 עיצוב כפתורים אחיד
export const unifiedButtonStyles = {
  // גדלים
  sizes: {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      iconSize: 18,
      borderRadius: unifiedBorderRadius.md,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontSize: 16,
      iconSize: 20,
      borderRadius: unifiedBorderRadius.lg,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: 18,
      iconSize: 24,
      borderRadius: unifiedBorderRadius.xl,
    },
  },
  // וריאנטים
  variants: {
    primary: {
      gradient: [unifiedColors.primary, unifiedColors.secondary],
      textColor: "#ffffff",
      shadow: unifiedShadows.md,
    },
    secondary: {
      gradient: [unifiedColors.secondary, unifiedColors.primary],
      textColor: "#ffffff",
      shadow: unifiedShadows.sm,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: unifiedColors.primary,
      borderWidth: 2,
      textColor: unifiedColors.primary,
      shadow: unifiedShadows.none,
    },
    danger: {
      gradient: [unifiedColors.error, "#ff5252"],
      textColor: "#ffffff",
      shadow: unifiedShadows.md,
    },
    success: {
      gradient: [unifiedColors.success, "#00b248"],
      textColor: "#ffffff",
      shadow: unifiedShadows.md,
    },
  },
} as const;

// 🃏 עיצוב כרטיסים אחיד
export const unifiedCardStyles = {
  // וריאנטים
  variants: {
    default: {
      backgroundColor: unifiedColors.surface,
      borderColor: unifiedColors.border,
      borderWidth: 1,
      shadow: unifiedShadows.sm,
    },
    gradient: {
      backgroundColor: "transparent",
      shadow: unifiedShadows.md,
    },
    outline: {
      backgroundColor: "transparent",
      borderColor: unifiedColors.border,
      borderWidth: 1,
      shadow: unifiedShadows.none,
    },
    elevated: {
      backgroundColor: unifiedColors.surfaceElevated,
      shadow: unifiedShadows.lg,
    },
  },
  // גדלי padding
  padding: {
    none: 0,
    small: unifiedSpacing.md,
    medium: unifiedSpacing.lg,
    large: unifiedSpacing.xxl,
  },
  // גדלי margin
  margin: {
    none: 0,
    small: unifiedSpacing.sm,
    medium: unifiedSpacing.md,
    large: unifiedSpacing.lg,
  },
} as const;

// 📱 עיצוב מסכים אחיד
export const unifiedScreenStyles = {
  // רקעים
  backgrounds: {
    primary: {
      gradient: unifiedColors.gradients.background,
      overlay: unifiedColors.overlay,
    },
    secondary: {
      gradient: unifiedColors.gradients.dark,
      overlay: unifiedColors.overlayLight,
    },
  },
  // headers
  headers: {
    height: Platform.OS === "ios" ? 60 : 40,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: unifiedSpacing.lg,
  },
  // content
  content: {
    paddingHorizontal: unifiedSpacing.lg,
    paddingBottom: unifiedSpacing.xxl,
  },
} as const;

// 🎨 עיצוב אינפוטים אחיד
export const unifiedInputStyles = {
  // וריאנטים
  variants: {
    default: {
      backgroundColor: unifiedColors.inputBackground,
      borderColor: unifiedColors.inputBorder,
      borderWidth: 1,
      borderRadius: unifiedBorderRadius.lg,
    },
    focused: {
      backgroundColor: unifiedColors.inputBackground,
      borderColor: unifiedColors.inputBorderActive,
      borderWidth: 2,
      borderRadius: unifiedBorderRadius.lg,
    },
    error: {
      backgroundColor: unifiedColors.inputBackground,
      borderColor: unifiedColors.inputBorderError,
      borderWidth: 2,
      borderRadius: unifiedBorderRadius.lg,
    },
  },
  // גדלים
  sizes: {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      fontSize: 14,
      iconSize: 18,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      iconSize: 20,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 18,
      iconSize: 24,
    },
  },
} as const;

// 🎯 עיצוב מודאלים אחיד
export const unifiedModalStyles = {
  // רקע
  backdrop: {
    backgroundColor: unifiedColors.overlay,
  },
  // תוכן
  content: {
    backgroundColor: unifiedColors.surface,
    borderRadius: unifiedBorderRadius.xl,
    shadow: unifiedShadows.lg,
  },
  // header
  header: {
    borderBottomColor: unifiedColors.border,
    borderBottomWidth: 1,
  },
  // footer
  footer: {
    borderTopColor: unifiedColors.border,
    borderTopWidth: 1,
  },
} as const;

// 🎨 מערכת עיצוב מאוחדת מלאה
export const unifiedDesignSystem = {
  colors: unifiedColors,
  spacing: unifiedSpacing,
  typography: unifiedTypography,
  borderRadius: unifiedBorderRadius,
  shadows: unifiedShadows,
  animation: unifiedAnimation,
  button: unifiedButtonStyles,
  card: unifiedCardStyles,
  screen: unifiedScreenStyles,
  input: unifiedInputStyles,
  modal: unifiedModalStyles,
} as const;

// 📝 טיפים לשימוש
export const designGuidelines = {
  // עקרונות כלליים
  principles: {
    consistency: "השתמש באותם צבעים, מרווחים וטיפוגרפיה בכל מקום",
    hierarchy: "השתמש בגודל טקסט וצבעים כדי ליצור היררכיה ויזואלית",
    accessibility: "וודא ניגודיות מספקת בין טקסט לרקע",
    rtl: "תמיכה מלאה ב-RTL עם יישור טקסט ומיקום אלמנטים",
  },

  // שימוש בצבעים
  colorUsage: {
    primary: "לכפתורים ראשיים, קישורים ופעולות חשובות",
    secondary: "לכפתורים משניים ופעולות נוספות",
    accent: "להדגשות, הודעות הצלחה וסטטוסים חיוביים",
    error: "לשגיאות, אזהרות ופעולות מסוכנות",
    text: "לטקסט ראשי על רקע כהה",
    textSecondary: "לטקסט משני ותיאורים",
    textMuted: "לטקסט לא פעיל או מושבת",
  },

  // שימוש במרווחים
  spacingUsage: {
    xs: "מרווחים קטנים בין אלמנטים קרובים",
    sm: "מרווחים בין אלמנטים קשורים",
    md: "מרווחים בין קבוצות אלמנטים",
    lg: "מרווחים בין סקציות",
    xl: "מרווחים בין אזורים גדולים",
    xxl: "מרווחים לקצוות מסך",
  },

  // שימוש בטיפוגרפיה
  typographyUsage: {
    display: "כותרות ראשיות במסכים",
    xxxl: "כותרות משניות",
    xxl: "כותרות סקציות",
    xl: "כותרות קטנות",
    lg: "טקסט גוף גדול",
    md: "טקסט גוף רגיל",
    sm: "טקסט משני",
    xs: "טקסט קטן (תגיות, תאריכים)",
  },
} as const;

export default unifiedDesignSystem;
