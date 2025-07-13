// src/screens/auth/login/types/index.ts - עם צבעים מעודכנים

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

// אובייקט הצבעים של Login - מעודכן לרקע גרדיאנט
export const loginColors = {
  // צבעים ראשיים - תואמים לגרדיאנט
  primary: "#667eea",
  secondary: "#764ba2",
  accent: "#00ff88",

  // רקעים שקופים לרקע גרדיאנט
  background: "transparent",
  surface: "rgba(0, 0, 0, 0.3)",

  // טקסט
  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.8)",
  textMuted: "rgba(255, 255, 255, 0.5)",

  // צבעי שגיאה
  danger: "#ff3366",
  border: "rgba(255, 255, 255, 0.2)",

  // צבעים ספציפיים לLogin
  inputBackground: "rgba(0, 0, 0, 0.4)",
  inputBorder: "rgba(102, 126, 234, 0.4)",
  logoGlow: "rgba(102, 126, 234, 0.3)",
  errorBackground: "rgba(239, 68, 68, 0.1)",
  errorBorder: "rgba(239, 68, 68, 0.3)",
  signupText: "rgba(255, 255, 255, 0.7)",
  subtitle: "rgba(255, 255, 255, 0.7)",
};
