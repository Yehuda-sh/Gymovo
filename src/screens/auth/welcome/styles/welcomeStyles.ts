// src/screens/auth/welcome/styles/welcomeStyles.ts - מותאם למובייל

import { StyleSheet, Dimensions, Platform } from "react-native";
import { welcomeColors } from "../types";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 700;
const isTinyDevice = height < 600;
const isWideScreen = width > 768;
const isIOS = Platform.OS === "ios";

// Spacing constants
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Responsive values helper
const responsive = (small: number, normal: number, tiny?: number) => {
  if (tiny !== undefined && isTinyDevice) return tiny;
  return isSmallDevice ? small : normal;
};

export const welcomeStyles = StyleSheet.create({
  // Main containers
  container: {
    flex: 1,
    backgroundColor: welcomeColors.background,
  },
  content: {
    flex: 1,
    justifyContent: isSmallDevice ? "space-between" : "center",
    alignItems: "center",
    paddingTop: responsive(40, 60, 30),
    paddingBottom: responsive(80, 100, 60),
    paddingHorizontal: spacing.lg,
  },

  // Safe area adjustments
  safeArea: {
    flex: 1,
  },

  // Scroll container for very small devices
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },

  // Background and overlays
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },

  // Logo section
  logoSection: {
    alignItems: "center",
    marginBottom: responsive(spacing.lg, spacing.xl),
  },
  logoContainer: {
    marginBottom: responsive(20, 30, 15),
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: responsive(80, 100, 70),
    height: responsive(80, 100, 70),
    borderRadius: responsive(40, 50, 35),
    overflow: "hidden",
  },
  logoGlow: {
    position: "absolute",
    width: responsive(120, 150, 100),
    height: responsive(120, 150, 100),
    borderRadius: responsive(60, 75, 50),
    backgroundColor: welcomeColors.logoGlow,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },

  // Text styles
  title: {
    fontSize: responsive(28, 32, 24),
    fontWeight: "700",
    color: welcomeColors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: responsive(16, 18, 14),
    color: welcomeColors.subtitle,
    textAlign: "center",
    lineHeight: responsive(22, 26, 20),
    paddingHorizontal: spacing.lg,
  },

  // Actions section
  actionsContainer: {
    width: "100%",
    paddingHorizontal: spacing.lg,
    marginTop: responsive(10, 20),
    maxWidth: isWideScreen ? 400 : "100%",
    alignSelf: "center",
  },

  // Buttons base styles
  buttonBase: {
    height: responsive(48, 56, 44),
    borderRadius: responsive(12, 16, 10),
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  primaryButton: {
    backgroundColor: welcomeColors.primary,
    shadowColor: welcomeColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: welcomeColors.guestButtonBorder,
  },

  // Dev Mode styles
  devModeContainer: {
    position: "absolute",
    top: isIOS ? 50 : 30,
    right: spacing.md,
    zIndex: 999,
  },
  devIndicator: {
    backgroundColor: welcomeColors.devIndicator,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    opacity: 0.8,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  devIndicatorText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Dev Panel
  devPanel: {
    backgroundColor: welcomeColors.devPanel,
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: welcomeColors.devBorder,
    marginTop: spacing.lg,
    maxHeight: height * 0.6,
  },
  devPanelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  devTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: welcomeColors.devTitle,
  },
  devCloseButton: {
    padding: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: welcomeColors.closeButton,
  },

  // Demo users section
  demoSection: {
    marginBottom: spacing.lg,
  },
  demoSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: welcomeColors.demoSectionTitle,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  demoUsersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },

  // Reset button
  resetSection: {
    borderTopWidth: 1,
    borderTopColor: welcomeColors.devBorder,
    paddingTop: spacing.lg,
    marginTop: spacing.lg,
  },
  resetButton: {
    backgroundColor: welcomeColors.resetButton,
    borderWidth: 1,
    borderColor: welcomeColors.resetButtonBorder,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
  },
  resetButtonText: {
    color: welcomeColors.resetButtonText,
    fontSize: 14,
    fontWeight: "600",
  },

  // Compact styles for small devices
  compactContainer: {
    paddingVertical: responsive(10, 20, 5),
  },
  compactHeader: {
    marginBottom: responsive(15, 25, 10),
  },
  compactButton: {
    height: responsive(44, 52, 40),
  },
  compactText: {
    fontSize: responsive(14, 16, 12),
  },

  // Loading state
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loadingContent: {
    backgroundColor: welcomeColors.surface,
    padding: spacing.xl,
    borderRadius: 16,
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    color: welcomeColors.text,
    fontSize: 16,
    fontWeight: "500",
  },

  // Error state
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: welcomeColors.error,
    borderRadius: 8,
    padding: spacing.md,
    marginVertical: spacing.md,
  },
  errorText: {
    color: welcomeColors.error,
    fontSize: 14,
    textAlign: "center",
  },

  // Utility classes
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  gap: {
    gap: spacing.md,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// Export spacing for use in other components
export { spacing, responsive };

// Export platform checks
export const platformStyles = {
  isIOS,
  isSmallDevice,
  isTinyDevice,
  isWideScreen,
};
