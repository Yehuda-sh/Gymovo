// src/screens/auth/signup/styles/signupStyles.ts

import { StyleSheet } from "react-native";
import { signupColors } from "../types";

export const signupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: signupColors.background,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: signupColors.overlay,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 120, // מקום לprogress bar
    paddingBottom: 40,
  },
  spacer: {
    minHeight: 20,
  },
});
