// src/screens/auth/welcome/components/BackgroundGradient.tsx - רכיב רקע עם גרדיאנט

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { BackgroundGradientProps, welcomeColors } from "../types";

const { height } = Dimensions.get("window");

// רכיב רקע עם גרדיאנט בעל השפעה דרמטית
export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <View style={[styles.backgroundGradient, styles.gradientTop]} />
      <View style={[styles.backgroundGradient, styles.gradientBottom]} />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundGradient: {
    position: "absolute",
    width: "100%",
    height: height * 0.5,
  },
  gradientTop: {
    top: 0,
    backgroundColor: welcomeColors.gradientTop,
    opacity: 0.8,
  },
  gradientBottom: {
    bottom: 0,
    backgroundColor: welcomeColors.gradientBottom,
    opacity: 0.6,
  },
});

export default BackgroundGradient;
