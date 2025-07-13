// src/screens/auth/login/components/index.ts - אינדקס מלא של כל הרכיבים

// Main UI Components
export { default as HeaderSection } from "./HeaderSection";
export { default as LoginForm } from "./LoginForm";
export { default as ErrorDisplay } from "./ErrorDisplay";
export { default as ActionButtons } from "./ActionButtons";
export { default as SignupPrompt } from "./SignupPrompt";
export { default as ForgotPasswordLink } from "./ForgotPasswordLink";

// Utilities and Validation
export * from "./ValidationUtils";

// Custom Hooks
export { useLoginAnimations } from "./useLoginAnimations";

// Optional: Loading components if exists
// export { default as LoadingOverlay } from "./LoadingOverlay";

// Optional: Social login components if exists
// export { default as SocialLoginButtons } from "./SocialLoginButtons";

// Re-export types if needed for external use
export type {
  HeaderSectionProps,
  LoginFormProps,
  ErrorDisplayProps,
  ActionButtonsProps,
  SignupPromptProps,
  ValidationResult,
  LoginResult,
} from "../types";
