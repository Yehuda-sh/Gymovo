// src/theme/colors.ts - עדכון לנושא כהה וספורטיבי

export const colors = {
  // צבעים ראשיים - גישה ספורטיבית
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
  danger: "#ff3366", // אדום חזק
  dangerDark: "#cc0033",

  // גבולות וקווים
  border: "#333333",
  borderLight: "#444444",
  borderAccent: "#00ff88",

  // אפקטים וצללים
  shadow: "rgba(0, 0, 0, 0.5)", // צל כהה יותר
  shadowGlow: "rgba(0, 255, 136, 0.3)", // זוהר ירוק
  overlay: "rgba(0, 0, 0, 0.8)", // אוברליי כהה
  overlayLight: "rgba(0, 0, 0, 0.6)",

  // גרדיאנטים ספורטיביים
  gradients: {
    primary: ["#00ff88", "#00cc6a"],
    dark: ["#0a0a0a", "#1a1a1a"],
    accent: ["#ff6b35", "#ff8c42"],
    energy: ["#00ff88", "#007aff"],
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
  // וכו'...
};
