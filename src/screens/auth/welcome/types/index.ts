// src/screens/auth/welcome/types/index.ts

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";
import { User } from "../../../../types/user";

export type WelcomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Welcome"
>;

// הוספת טיפוס מורחב למשתמשי דמו
export interface DemoUserData extends User {
  color?: string;
  level: "beginner" | "intermediate" | "advanced";
  goal: "build_muscle" | "lose_weight" | "get_stronger" | "general_fitness";
}

// Props לרכיבים שונים
export interface HeroSectionProps {
  fadeAnim: any;
  logoScale: any;
  titleSlide: any;
  subtitleSlide: any;
}

export interface ActionButtonsProps {
  onSignup: () => void;
  onLogin: () => void;
  buttonsSlide: any;
  fadeAnim: any;
}

export interface GuestButtonProps {
  onGuestLogin: () => void;
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
}

export interface BackgroundGradientProps {
  visible?: boolean;
}

// אובייקט הצבעים של Welcome
export const welcomeColors = {
  // צבעים עיקריים
  primary: "#3B82F6",
  background: "#000000",
  surface: "#1a1a1a",
  text: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",

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
};
