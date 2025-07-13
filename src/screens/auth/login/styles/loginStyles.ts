// src/screens/auth/login/styles/loginStyles.ts - עיצוב בהשראת WelcomeScreen

import { Platform, StyleSheet } from "react-native";

// צבעים בהשראת WelcomeScreen
export const loginColors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  background: "#000000",
  surface: "#1a1a1a",
  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  danger: "#EF4444",
  logoGlow: "#3B82F6",
  accentLine: "#3B82F6",
  inputBackground: "rgba(255, 255, 255, 0.05)",
  inputBorder: "rgba(255, 107, 53, 0.3)",
  inputFocusBorder: "#FF6B35",
  gradientTop: "#0a0a0a",
  gradientBottom: "#1a1a1a",
  google: "#4285F4",
};

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  backgroundContainer: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  // Logo and Header
  headerSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 28,
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: loginColors.logoGlow,
    top: -20,
    left: -20,
    opacity: 0.15,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: loginColors.surface,
    borderWidth: 1.5,
    borderColor: loginColors.logoGlow,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: loginColors.logoGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: loginColors.text,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -1,
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-black",
  },
  subtitle: {
    fontSize: 17,
    color: loginColors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  accentLine: {
    width: 50,
    height: 4,
    backgroundColor: loginColors.accentLine,
    borderRadius: 2,
    shadowColor: loginColors.accentLine,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  // Form
  formSection: {
    width: "100%",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  inputBackground: {
    backgroundColor: loginColors.inputBackground,
    borderWidth: 1,
    borderColor: loginColors.inputBorder,
    borderRadius: 16,
  },
  inputFocused: {
    borderColor: loginColors.inputFocusBorder,
    borderWidth: 2,
  },
  input: {
    height: 60,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    color: loginColors.text,
    fontWeight: "500",
  },
  inputIcon: {
    position: "absolute",
    right: 20,
    top: 18,
  },
  passwordToggle: {
    position: "absolute",
    left: 16,
    top: 14,
    padding: 6,
    zIndex: 1,
  },
  // Actions
  actionsSection: {
    width: "100%",
    gap: 16,
    marginTop: 24,
  },
  loginButton: {
    height: 60,
    borderRadius: 16,
    backgroundColor: loginColors.primary,
    shadowColor: loginColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  backButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  // Error
  errorContainer: {
    width: "100%",
    marginBottom: 20,
  },
  // Forgot Password
  forgotPasswordContainer: {
    marginTop: -10,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: loginColors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
  // Signup Prompt
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signupText: {
    color: loginColors.textSecondary,
    fontSize: 14,
  },
  signupLink: {
    color: loginColors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  signupLinkTouchable: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  // Loading
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    color: loginColors.primary,
    fontSize: 16,
    marginTop: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  // Spacer
  spacer: {
    height: 16,
  },
});
