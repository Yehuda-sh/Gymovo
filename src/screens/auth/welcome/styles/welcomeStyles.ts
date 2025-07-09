// src/screens/auth/welcome/styles/welcomeStyles.ts - סטיילים עיקריים לWelcome

import { StyleSheet, Platform } from "react-native";
import { welcomeColors } from "../types";

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: welcomeColors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
});
