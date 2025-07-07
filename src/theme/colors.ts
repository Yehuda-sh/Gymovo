// src/theme/colors.ts - גרסה פשוטה שעובדת

export const colors = {
  // צבעים ראשיים
  primary: "#00ff88", // ירוק נאון אנרגטי
  primaryLight: "#33ff99",
  primaryDark: "#00cc6a",

  // צבעים משניים
  secondary: "#1a1a1a", // אפור כהה
  secondaryLight: "#333333",
  secondaryDark: "#0a0a0a",

  // רקעים כהים
  background: "#0a0a0a", // שחור עמוק
  backgroundSecondary: "#1a1a1a", // אפור כהה
  surface: "#262626", // משטח כהה
  surfaceElevated: "#333333", // משטח מורם

  // טקסט על רקע כהה
  text: "#ffffff", // לבן נקי
  textSecondary: "#cccccc", // אפור בהיר
  textMuted: "#888888", // אפור עמום
  textInverse: "#000000", // שחור (עבור רקע בהיר)

  // צבעי אקסנט ספורטיביים
  accent: "#ff6b35", // כתום אנרגטי
  accentBlue: "#007aff", // כחול טכנולוגי
  accentPurple: "#8b5cf6", // סגול חזק

  // סטטוסים
  success: "#00ff88", // זהה לפרימרי
  successDark: "#00cc6a",
  warning: "#ffab00", // כתום חם
  warningDark: "#e68900",
  error: "#ff3366", // אדום חזק - הוספת error
  errorDark: "#cc0033",
  info: "#007aff",
  infoDark: "#0051d5",

  // גבולות וקווים
  border: "#333333",
  borderLight: "#444444",
  borderAccent: "#00ff88",
  borderError: "#ff3366",
  borderSuccess: "#00ff88",
  borderWarning: "#ffab00",

  // אפקטים וצללים
  shadow: "rgba(0, 0, 0, 0.5)",
  shadowGlow: "rgba(0, 255, 136, 0.3)",
  overlay: "rgba(0, 0, 0, 0.8)",
  overlayLight: "rgba(0, 0, 0, 0.6)",

  // צבעים נוספים לרכיבים
  skeleton: "#e1e9ee",
  skeletonHighlight: "#f5f7fa",

  // מצבי disabled
  disabled: "#666666",
  disabledBackground: "#2a2a2a",

  // רקעי כרטיסים ורכיבים
  cardBackground: "#1e1e1e",
  cardBorder: "#333333",

  // צבעי מצבי טפסים
  inputBackground: "rgba(255, 255, 255, 0.05)",
  inputBorder: "rgba(255, 255, 255, 0.1)",
  inputFocus: "#00ff88",
  inputError: "#ff3366",

  // גרדיאנטים ספורטיביים
  gradients: {
    primary: ["#00ff88", "#00cc6a"],
    dark: ["#0a0a0a", "#1a1a1a"],
    accent: ["#ff6b35", "#ff8c42"],
    energy: ["#00ff88", "#007aff"],
    error: ["#ff3366", "#cc0033"],
    warning: ["#ffab00", "#e68900"],
    success: ["#00ff88", "#00cc6a"],
  },

  // צבעי תרגילים וקטגוריות
  exercise: {
    chest: "#ff6b35",
    back: "#007aff",
    shoulders: "#8b5cf6",
    arms: "#00ff88",
    legs: "#fbbf24",
    core: "#f59e0b",
    cardio: "#ef4444",
    flexibility: "#10b981",
  },

  // צבעי רמות קושי
  difficulty: {
    beginner: "#10b981", // ירוק
    intermediate: "#f59e0b", // כתום
    advanced: "#ef4444", // אדום
  },

  // צבעי מטרות
  goals: {
    muscle_gain: "#8b5cf6",
    strength: "#ef4444",
    weight_loss: "#f59e0b",
    endurance: "#06b6d4",
    general_fitness: "#10b981",
  },
};

// נושא כהה מלא
export const darkTheme = {
  ...colors,
  // כל הצבעים כבר מותאמים לכהה
};

// נושא בהיר (לעתיד אם נרצה)
export const lightTheme = {
  ...colors,
  primary: "#007aff",
  background: "#ffffff",
  surface: "#f8f9fa",
  text: "#000000",
  textSecondary: "#666666",
  skeleton: "#f0f0f0",
  cardBackground: "#ffffff",
  inputBackground: "#f8f9fa",
  // וכו'...
};

// פונקציות עזר לצבעים
export const getExerciseColor = (category: string): string => {
  return (
    colors.exercise[category as keyof typeof colors.exercise] || colors.accent
  );
};

export const getDifficultyColor = (difficulty: string): string => {
  return (
    colors.difficulty[difficulty as keyof typeof colors.difficulty] ||
    colors.textMuted
  );
};

export const getGoalColor = (goal: string): string => {
  return colors.goals[goal as keyof typeof colors.goals] || colors.primary;
};

// פונקציה ליצירת צבע עם אלפא
export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

// יצוא ברירת מחדל
export default colors;
