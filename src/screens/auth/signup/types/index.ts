// src/screens/auth/signup/types/index.ts

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";

export type SignupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Signup"
>;

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

// אובייקט הצבעים של Signup
export const signupColors = {
  // יורש מהצבעים הכלליים
  primary: "#00ff88",
  background: "#000000",
  surface: "#262626",
  text: "#ffffff",
  textSecondary: "#cccccc",
  textMuted: "#888888",
  danger: "#ff3366",
  border: "#333333",

  // צבעים ספציפיים לSignup
  overlay: "rgba(0, 0, 0, 0.85)",
  inputBackground: "rgba(0, 0, 0, 0.6)",
  inputBorder: "rgba(0, 255, 136, 0.4)",
  logoGlow: "rgba(0, 255, 136, 0.2)",
  errorBackground: "rgba(239, 68, 68, 0.1)",
  errorBorder: "rgba(239, 68, 68, 0.3)",
  securityBackground: "rgba(0, 255, 136, 0.1)",
  securityBorder: "rgba(0, 255, 136, 0.3)",
  progressBackground: "rgba(255, 255, 255, 0.2)",
  loginText: "rgba(255, 255, 255, 0.7)",
  subtitle: "rgba(255, 255, 255, 0.7)",
  securityText: "rgba(255, 255, 255, 0.8)",
  progressText: "rgba(255, 255, 255, 0.7)",
};
