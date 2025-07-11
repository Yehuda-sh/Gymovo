// src/screens/auth/signup/types/index.ts - עם הוספת isLoading

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";

export type SignupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Signup"
>;
// צבעים מ-WelcomeScreen
export const welcomeColors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  background: "#000000",
  surface: "#1a1a1a",
  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  logoGlow: "#3B82F6",
  accentLine: "#3B82F6",
  gradientTop: "#0a0a0a",
  gradientBottom: "#1a1a1a",
  guestButtonBorder: "#64748B",
};

// נתוני הרשמה
export interface SignupData {
  email: string;
  password: string;
  age: number;
}

// Props לרכיבים שונים
export interface HeaderSectionProps {
  fadeAnim: any;
  slideAnim: any;
  headerScale: any;
}

export interface ProgressBarProps {
  progressAnim: any;
  currentStep: number;
  totalSteps: number;
}

export interface SignupFormProps {
  email: string;
  password: string;
  age: string;
  error: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onAgeChange: (age: string) => void;
  formSlide: any;
}

export interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

export interface SecurityNoteProps {
  visible: boolean;
}

export interface ActionButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean; // הוספה חדשה
}

export interface LoginPromptProps {
  onLoginPress: () => void;
}

// טיפוס לוולידציה
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// טיפוס לתוצאת הרשמה
export interface SignupResult {
  success: boolean;
  error?: string;
  data?: SignupData;
}

// אובייקט הצבעים של Signup - מעודכן
export const signupColors = {
  // צבעים בסיסיים
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00ff88",
  background: "#1a1a2e",
  surface: "#16213e",
  text: "#ffffff",
  textSecondary: "#cccccc",
  textMuted: "#888888",
  danger: "#ff3366",
  border: "#333333",

  // צבעים ספציפיים לSignup
  overlay: "rgba(0, 0, 0, 0.6)",

  // Input colors - משופרים
  inputBackground: "rgba(0, 0, 0, 0.7)",
  inputBorder: "rgba(102, 126, 234, 0.4)",
  inputBorderActive: "#667eea",
  inputBorderError: "#ff3366",
  inputText: "#ffffff",
  inputLabel: "rgba(255, 255, 255, 0.8)",
  inputPlaceholder: "rgba(255, 255, 255, 0.4)",

  // Logo and effects
  logoGlow: "rgba(102, 126, 234, 0.3)",
  primaryGlow: "rgba(102, 126, 234, 0.4)",

  // Error states
  errorBackground: "rgba(255, 51, 102, 0.1)",
  errorBorder: "rgba(255, 51, 102, 0.3)",
  errorText: "#ff3366",

  // Security note
  securityBackground: "rgba(0, 255, 136, 0.1)",
  securityBorder: "rgba(0, 255, 136, 0.3)",
  securityText: "rgba(255, 255, 255, 0.9)",

  // Progress
  progressBackground: "rgba(255, 255, 255, 0.1)",
  progressActive: "#667eea",
  progressText: "rgba(255, 255, 255, 0.8)",

  // Login prompt
  loginText: "rgba(255, 255, 255, 0.7)",
  loginLink: "#667eea",

  // Status indicators
  success: "#00ff88",
  warning: "#FFD23F",
  info: "#667eea",
};

// פונקציות עזר לצבעים
export const getInputColors = (hasValue: boolean, hasError: boolean) => ({
  border: hasError
    ? signupColors.inputBorderError
    : hasValue
    ? signupColors.inputBorderActive
    : signupColors.inputBorder,
  label: hasError
    ? signupColors.errorText
    : hasValue
    ? signupColors.inputBorderActive
    : signupColors.inputLabel,
  text: signupColors.inputText,
});

// טיפוסי אנימציה
export interface AnimationControls {
  fadeAnim: any;
  slideAnim: any;
  headerScale: any;
  formSlide: any;
  keyboardOffset: any;
  progressAnim: any;
  shakeAnim: any;
  successAnim: any;
  buttonPulse: any;
  playShakeAnimation: () => void;
  playSuccessAnimation: (callback?: () => void) => void;
  startEntryAnimations: () => void;
  resetAnimations: () => void;
}
