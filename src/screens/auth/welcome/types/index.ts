// src/screens/auth/welcome/types/index.ts - מעודכן עם לחיצה על לוגו

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Animated } from "react-native";
import { RootStackParamList } from "../../../../types/navigation";
import { User } from "../../../../types/user";

// Navigation types
export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
>;

// Demo user types
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type FitnessGoal =
  | "build_muscle"
  | "lose_weight"
  | "get_stronger"
  | "general_fitness";

// הוספת טיפוס מורחב למשתמשי דמו
export interface DemoUserData extends User {
  color?: string;
  level: ExperienceLevel;
  goal: FitnessGoal;
}

// Animation types
export type AnimatedValue = Animated.Value;
export type AnimatedValueXY = Animated.ValueXY;

// Props לרכיבים שונים
export interface HeroSectionProps {
  fadeAnim: AnimatedValue;
  logoScale: AnimatedValue;
  titleSlide: AnimatedValue;
  subtitleSlide: AnimatedValue;
  onLogoPress?: () => void;
}

export interface ActionButtonsProps {
  onSignup: () => void;
  onLogin: () => void;
  buttonsSlide: AnimatedValue;
  fadeAnim: AnimatedValue;
  loading?: boolean; // הוספת אופציה ל-loading state
}

export interface GuestButtonProps {
  onGuestLogin: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  fadeAnim: AnimatedValue;
  loading?: boolean;
}

export interface DevPanelProps {
  visible: boolean;
  demoUsers: DemoUserData[];
  onDemoLogin: (user: DemoUserData) => void;
  onResetData: () => void;
}

export interface DemoUserCardProps {
  user: DemoUserData;
  onPress: (user: DemoUserData) => void;
  isSelected?: boolean;
}

export interface BackgroundGradientProps {
  visible?: boolean;
  theme?: "dark" | "light";
  enablePulse?: boolean;
  customColors?: GradientColors;
}

// Gradient color structure
export interface GradientColors {
  base: readonly [string, string, string];
  glow: readonly [string, string];
  cornerTop: string;
  cornerBottom: string;
}

// Dev Modal types
export interface DevModalProps {
  visible: boolean;
  onClose: () => void;
  demoUsers: DemoUserData[];
  onDemoLogin: (user: DemoUserData) => void;
  onResetData: () => void;
}

// Error handling
export interface WelcomeError {
  code: string;
  message: string;
  field?: "email" | "password" | "general";
}

// Theme configuration type
export interface WelcomeTheme {
  colors: typeof welcomeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}

// אובייקט הצבעים של Welcome
export const welcomeColors = {
  // צבעים עיקריים
  primary: "#3B82F6",
  primaryDark: "#2563EB",
  primaryLight: "#60A5FA",

  secondary: "#8B5CF6",
  secondaryDark: "#7C3AED",
  secondaryLight: "#A78BFA",

  background: "#000000",
  surface: "#1a1a1a",
  surfaceLight: "#2a2a2a",

  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  textDisabled: "#475569",

  // Status colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",

  // צבעים ספציפיים לWelcome
  logoGlow: "#3B82F6",
  accentLine: "#3B82F6",
  gradientTop: "#0a0a0a",
  gradientBottom: "#1a1a1a",
  subtitle: "rgba(255, 255, 255, 0.8)",

  // Dev Panel colors
  devPanel: "rgba(0, 0, 0, 0.8)",
  devBorder: "#374151",
  devIndicator: "#10B981",
  devTitle: "#10B981",
  demoSectionTitle: "#F59E0B",
  resetButton: "rgba(239, 68, 68, 0.2)",
  resetButtonBorder: "#ef4444",
  resetButtonText: "#ef4444",

  // Button colors
  guestButtonBorder: "#64748B",
  guestButtonBackground: "rgba(100, 116, 139, 0.1)",

  // Modal colors
  modalOverlay: "rgba(0, 0, 0, 0.8)",
  modalBackground: "#1a1a1a",
  modalBorder: "#374151",
  closeButton: "rgba(255, 255, 255, 0.1)",
} as const;

// Default theme
export const defaultTheme: WelcomeTheme = {
  colors: welcomeColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
};

// Type guards
export const isDemoUser = (user: User | DemoUserData): user is DemoUserData => {
  return "level" in user && "goal" in user;
};

// Utility types
export type ValueOf<T> = T[keyof T];
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
