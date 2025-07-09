// src/screens/profile/guest/types/index.ts
// טיפוסים עבור רכיבי מסך פרופיל אורח

export interface GuestProfileIconProps {
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
}

export interface GuestProfileContentProps {
  title?: string;
  subtitle?: string;
}

export interface GuestProfileActionsProps {
  onSignupPress: () => void;
  buttonTitle?: string;
}

export interface GuestProfileNavigationHook {
  navigateToSignup: () => void;
}
