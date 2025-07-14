// src/screens/auth/welcome/components/index.ts

// Core Components - Default exports
export { default as BackgroundGradient } from "./BackgroundGradient";
export { default as HeroSection } from "./HeroSection";
export { default as ActionButtons } from "./ActionButtons";
export { default as GuestButton } from "./GuestButton";
export { default as SocialLoginButtons } from "./SocialLoginButtons";
export { default as ActionButtonsSection } from "./ActionButtonsSection";

// Dev Components
export { default as DemoUserCard } from "./DemoUserCard";
export { default as DevPanel } from "./DevPanel";

// Hooks
export { default as useWelcomeAnimations } from "./useWelcomeAnimations";

// Re-export types from parent (for convenience)
export type {
  WelcomeScreenProps,
  HeroSectionProps,
  ActionButtonsProps,
  GuestButtonProps,
  SocialLoginButtonsProps,
  DevPanelProps,
  DemoUserCardProps,
  BackgroundGradientProps,
  DevModalProps,
  DemoUserData,
  ExperienceLevel,
  FitnessGoal,
  WelcomeError,
  WelcomeTheme,
  GradientColors,
} from "../types";

// Re-export styles (only what exists)
export { welcomeStyles } from "../styles/welcomeStyles";
export { welcomeColors } from "../types";
