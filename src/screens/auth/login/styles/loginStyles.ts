// src/screens/auth/login/styles/loginStyles.ts

import { Platform, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
});
