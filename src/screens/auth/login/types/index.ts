// src/screens/auth/login/types/index.ts

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

// Props לרכיבים שונים
export interface HeaderSectionProps {
  fadeAnim: any;
  slideAnim: any;
  headerScale: any;
}

export interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  formSlide: any;
}

export interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
}

export interface ActionButtonsProps {
  isLoading: boolean;
  onLogin: () => void;
  onBack: () => void;
}

export interface SignupPromptProps {
  onSignupPress: () => void;
}

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

// טיפוס לוולידציה
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// טיפוס לתוצאת התחברות
export interface LoginResult {
  success: boolean;
  error?: string;
}

// אובייקט הצבעים של Login
export const loginColors = {
  // יורש מהצבעים הכלליים
  primary: "#00ff88",
  background: "#0a0a0a",
  surface: "#262626",
  text: "#ffffff",
  textSecondary: "#cccccc",
  textMuted: "#888888",
  danger: "#ff3366",
  border: "#333333",

  // צבעים ספציפיים לLogin
  inputBackground: "rgba(0, 0, 0, 0.6)",
  inputBorder: "rgba(0, 255, 136, 0.4)",
  logoGlow: "rgba(0, 255, 136, 0.2)",
  errorBackground: "rgba(239, 68, 68, 0.1)",
  errorBorder: "rgba(239, 68, 68, 0.3)",
  signupText: "rgba(255, 255, 255, 0.7)",
  subtitle: "rgba(255, 255, 255, 0.7)",
};
