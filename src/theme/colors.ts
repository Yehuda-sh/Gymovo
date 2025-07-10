// src/theme/colors.ts
// מערכת צבעים מעודכנת עם כחול כצבע ראשי

export const colors = {
  // צבעים ראשיים - כחול ספורטיבי
  primary: "#007AFF", // כחול iOS
  primaryLight: "#3395FF",
  primaryDark: "#005BB5",

  // צבעים משניים
  secondary: "#1a1a1a", // אפור כהה
  secondaryLight: "#333333",
  secondaryDark: "#0a0a0a",

  // רקעים כהים
  background: "#000000", // שחור מלא
  backgroundSecondary: "#121212", // Material Dark
  surface: "#1E1E1E", // משטח מוגבה
  surfaceElevated: "#262626", // משטח מוגבה יותר

  // טקסט על רקע כהה
  text: "#FFFFFF", // לבן נקי
  textSecondary: "rgba(255, 255, 255, 0.7)", // 70% לבן
  textMuted: "rgba(255, 255, 255, 0.5)", // 50% לבן
  textDisabled: "rgba(255, 255, 255, 0.3)", // 30% לבן
  textInverse: "#000000", // שחור (עבור רקע בהיר)

  // צבעי אקסנט
  accent: "#00E676", // ירוק אנרגטי
  accentBlue: "#007AFF", // כחול (זהה לprimary)
  accentPurple: "#8B5CF6", // סגול
  accentOrange: "#FF6B35", // כתום

  // סטטוסים
  success: "#00E676", // ירוק
  successDark: "#00B248",
  warning: "#FFB74D", // כתום חם
  warningDark: "#F57C00",
  error: "#FF5252", // אדום
  errorDark: "#D32F2F",
  danger: "#FF5252", // alias ל-error
  dangerDark: "#D32F2F",
  info: "#40C4FF", // כחול בהיר
  infoDark: "#0288D1",

  // גבולות וקווים
  border: "rgba(255, 255, 255, 0.12)", // 12% לבן
  borderLight: "rgba(255, 255, 255, 0.08)", // 8% לבן
  borderAccent: "#007AFF",
  borderError: "#FF5252",
  borderSuccess: "#00E676",
  borderWarning: "#FFB74D",
  borderDanger: "#FF5252",

  // אפקטים וצללים
  shadow: "rgba(0, 0, 0, 0.5)",
  shadowGlow: "rgba(0, 122, 255, 0.3)", // כחול זוהר
  overlay: "rgba(0, 0, 0, 0.8)",
  overlayLight: "rgba(0, 0, 0, 0.6)",

  // צבעים נוספים לרכיבים
  skeleton: "#2A2A2A", // לאנימציות טעינה
  skeletonHighlight: "#3A3A3A",

  // מצבי לחיצה
  pressed: "rgba(255, 255, 255, 0.1)",
  focused: "rgba(0, 122, 255, 0.2)",
  selected: "rgba(0, 122, 255, 0.15)",

  // גרדיאנטים
  primaryGradient: ["#007AFF", "#005BB5"],
  accentGradient: ["#00E676", "#00B248"],
  darkGradient: ["#1E1E1E", "#000000"],

  // צבעים ייחודיים לכושר
  workoutActive: "#00E676",
  workoutCompleted: "#00B248",
  workoutSkipped: "#757575",
  exerciseCardio: "#FF6B35",
  exerciseStrength: "#007AFF",
  exerciseFlexibility: "#8B5CF6",

  // מפות שרירים
  muscleGroups: {
    chest: "#FF6B35",
    back: "#007AFF",
    legs: "#00E676",
    shoulders: "#FFB74D",
    arms: "#8B5CF6",
    core: "#FF5252",
    cardio: "#40C4FF",
  },
};

// Helper function for opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to RGB
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Dark theme optimized colors
export const darkColors = {
  ...colors,
  // Override specific colors for true dark theme
  background: "#000000",
  surface: "#121212",
  surfaceElevated: "#1E1E1E",
};

// Export default
export default colors;
