// src/screens/auth/signup/components/ProgressBar.tsx

import React from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { ProgressBarProps, signupColors } from "../types";

const colors = {
  primary: signupColors.primary,
  text: signupColors.text,
  textMuted: signupColors.textMuted,
  inputBorder: signupColors.inputBorder,
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressAnim,
  currentStep,
  totalSteps,
}) => {
  return (
    <Animated.View
      style={[
        styles.progressContainer,
        {
          opacity: progressAnim,
          transform: [
            {
              translateY: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={`שלב ${currentStep} מתוך ${totalSteps}`}
    >
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <View
              style={[
                styles.stepCircle,
                step <= currentStep && styles.stepCircleActive,
              ]}
            >
              <Text style={styles.stepText}>
                {step < currentStep ? "✓" : step}
              </Text>
            </View>
            {step < totalSteps && (
              <View
                style={[
                  styles.stepLine,
                  step < currentStep && styles.stepLineActive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.progressText}>
        שלב {currentStep} מתוך {totalSteps}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stepText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: "600",
  },
  stepLine: {
    width: 30,
    height: 1,
    backgroundColor: colors.inputBorder,
    marginHorizontal: 5,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: 11,
  },
});

export default ProgressBar;
