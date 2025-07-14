// src/screens/auth/signup/components/ProgressBar.tsx
import React, { useMemo } from "react";
import { View, Text, Animated, StyleSheet, useColorScheme } from "react-native";
import { ProgressBarProps, signupColors } from "../types";

const ProgressBar: React.FC<ProgressBarProps> = React.memo(
  ({ progressAnim, currentStep, totalSteps }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    // חישוב אחוז התקדמות
    const progressPercentage = useMemo(
      () => Math.round((currentStep / totalSteps) * 100),
      [currentStep, totalSteps]
    );

    // צבעים דינמיים
    const colors = useMemo(
      () => ({
        primary: isDark ? "#667eea" : signupColors.primary,
        text: isDark ? "#f7fafc" : signupColors.text,
        textMuted: isDark ? "#a0aec0" : signupColors.textMuted,
        inputBorder: isDark ? "#4a5568" : signupColors.inputBorder,
        completedStep: isDark ? "#48bb78" : "#38a169",
      }),
      [isDark]
    );

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
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
        accessibilityRole="progressbar"
        accessibilityLabel={`שלב ${currentStep} מתוך ${totalSteps}`}
        accessibilityValue={{
          min: 1,
          max: totalSteps,
          now: currentStep,
          text: `${progressPercentage}% הושלם`,
        }}
      >
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarBackground,
              { backgroundColor: colors.inputBorder },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: colors.primary,
                  width: `${progressPercentage}%`,
                  transform: [
                    {
                      scaleX: progressAnim,
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <React.Fragment key={step}>
              <Animated.View
                style={[
                  styles.stepCircle,
                  step <= currentStep && [
                    styles.stepCircleActive,
                    {
                      backgroundColor:
                        step < currentStep
                          ? colors.completedStep
                          : colors.primary,
                    },
                  ],
                  {
                    transform: [
                      {
                        scale: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange:
                            step === currentStep ? [0.8, 1.1] : [0.8, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    step <= currentStep && styles.stepTextActive,
                  ]}
                >
                  {step < currentStep ? "✓" : step}
                </Text>
              </Animated.View>
              {step < totalSteps && (
                <View
                  style={[
                    styles.stepLine,
                    step < currentStep && styles.stepLineActive,
                    {
                      backgroundColor:
                        step < currentStep
                          ? colors.completedStep
                          : colors.inputBorder,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          שלב {currentStep} מתוך {totalSteps} • {progressPercentage}% הושלם
        </Text>
      </Animated.View>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: signupColors.inputBorder,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  stepCircleActive: {
    borderColor: signupColors.primary,
  },
  stepText: {
    fontSize: 12,
    color: signupColors.text,
    fontWeight: "700",
  },
  stepTextActive: {
    color: "white",
  },
  stepLine: {
    width: 35,
    height: 2,
    backgroundColor: signupColors.inputBorder,
    marginHorizontal: 6,
  },
  stepLineActive: {
    backgroundColor: signupColors.primary,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
});

export default ProgressBar;
