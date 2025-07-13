// src/screens/profile/user/styles/profileStyles.ts
// סגנונות וצבעים למסך פרופיל בעיצוב מודרני

import { StyleSheet } from "react-native";

// צבעים בהשראת מסכי ההתחברות
export const profileColors = {
  // רקעים וגרדיאנטים
  background: "#1a1a2e",
  surface: "#16213e",
  gradientDark: "#0f3460",
  gradientLight: "#667eea",
  gradientAccent: "#764ba2",

  // טקסט
  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.5)",

  // כפתורים וכרטיסים
  cardBackground: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.1)",
  buttonPrimary: "#667eea",
  buttonDanger: "#ff3366",

  // אייקונים
  iconPrimary: "#667eea",
  iconSecondary: "rgba(255, 255, 255, 0.6)",
  iconDanger: "#ff3366",

  // הדגשות
  accent: "#00ff88",
  warning: "#FFD23F",
  success: "#00ff88",
  error: "#ff3366",
};

// סגנונות בסיסיים (שאר הסגנונות בכל קומפוננטה)
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: profileColors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  errorText: {
    color: profileColors.text,
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: profileColors.text,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  // נשאר לתאימות אחורה
  quizCard: {
    marginBottom: 20,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
});
