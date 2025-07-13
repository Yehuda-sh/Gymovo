// src/screens/profile/guest/types/guestProfileTypes.ts
// טיפוסים עבור רכיבי מסך פרופיל אורח

import { Animated } from "react-native";

export interface GuestProfileHeaderProps {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export interface GuestProfileBannerProps {
  onPress: () => void;
  animation: Animated.AnimatedValue;
}

export interface GuestProfileFeaturesProps {
  fadeAnim: Animated.Value;
  staggerDelay?: number;
}

export interface GuestProfileActionsProps {
  onConvertPress: () => void;
  onSignupPress: () => void;
  slideAnim: Animated.Value;
  pulseAnim: Animated.Value;
}

export interface GuestProfileFooterProps {
  onAlternativeSignup?: () => void;
  fadeAnim: Animated.Value;
}

export interface GuestProfileNavigationHook {
  navigateToConvertGuest: () => void;
  navigateToSignup: () => void;
  navigateToSettings: () => void;
}
