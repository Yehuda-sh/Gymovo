// src/screens/auth/welcome/styles/welcomeStyles.ts - מותאם למובייל

import { StyleSheet, Dimensions } from "react-native";
import { welcomeColors } from "../types";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: welcomeColors.background,
  },
  content: {
    flex: 1,
    justifyContent: isSmallDevice ? "space-between" : "center",
    alignItems: "center",
    paddingTop: isSmallDevice ? 40 : 60,
    paddingBottom: isSmallDevice ? 80 : 100,
  },
  // רקע גרדיאנט
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  // לוגו
  logoContainer: {
    marginBottom: isSmallDevice ? 20 : 30,
  },
  // פעולות
  actionsContainer: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: isSmallDevice ? 10 : 20,
  },
  // Dev Panel
  devIndicator: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: welcomeColors.devIndicator,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    opacity: 0.8,
  },
  devIndicatorText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  devPanel: {
    backgroundColor: welcomeColors.devPanel,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: welcomeColors.devBorder,
    marginTop: 20,
  },
  devTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: welcomeColors.devTitle,
    marginBottom: 16,
    textAlign: "center",
  },
  demoSection: {
    marginBottom: 20,
  },
  demoSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: welcomeColors.demoSectionTitle,
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: welcomeColors.resetButton,
    borderWidth: 1,
    borderColor: welcomeColors.resetButtonBorder,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: welcomeColors.resetButtonText,
    fontSize: 14,
    fontWeight: "600",
  },
  // קומפקטיות למובייל
  compactContainer: {
    paddingVertical: isSmallDevice ? 10 : 20,
  },
  compactHeader: {
    marginBottom: isSmallDevice ? 15 : 25,
  },
  compactButton: {
    height: isSmallDevice ? 48 : 56,
  },
});
