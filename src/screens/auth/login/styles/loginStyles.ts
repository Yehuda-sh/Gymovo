// src/screens/auth/login/styles/loginStyles.ts - סטיילים מתוקנים

import { Platform, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 40,
  },
  spacer: {
    flex: 1,
    minHeight: 20,
    maxHeight: 40, // הגבלת הגובה המקסימלי
  },

  // Optional: Additional styles that might be used
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  formContainer: {
    width: "100%",
  },
  bottomSection: {
    width: "100%",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },

  // Loading overlay styles if needed
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  // Responsive styles
  smallDevice: {
    paddingHorizontal: 16,
  },
  largeDevice: {
    paddingHorizontal: 32,
  },
});

// Helper function for responsive padding
export const getResponsivePadding = () => {
  if (width < 375) {
    return loginStyles.smallDevice;
  } else if (width > 768) {
    return loginStyles.largeDevice;
  }
  return null;
};

// Export additional style constants if needed
export const LOGIN_CONSTANTS = {
  contentMaxWidth: 400,
  inputHeight: Platform.OS === "ios" ? 56 : 52,
  buttonHeight: 56,
  borderRadius: 16,
  animationDuration: 300,
};

// Dark mode support (if needed in future)
export const loginDarkStyles = StyleSheet.create({
  // Dark mode overrides would go here
});

// Export all styles
export default loginStyles;
