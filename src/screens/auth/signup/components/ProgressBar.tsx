// src/screens/auth/signup/components/ProgressBar.tsx

import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../theme/colors";
import { ProgressBarProps, signupColors } from "../types";

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressAnim,
  currentStep,
  totalSteps,
}) => {
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${(currentStep / totalSteps) * 100}%`],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>
      <Text style={styles.progressText}>
        שלב {currentStep} מתוך {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    position: "absolute",
    top: 60,
    left: 32,
    right: 32,
    zIndex: 1,
  },
  progressBackground: {
    height: 4,
    backgroundColor: signupColors.progressBackground,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressText: {
    color: signupColors.progressText,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
  },
});

export default ProgressBar;
