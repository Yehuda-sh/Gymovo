// src/screens/auth/signup/components/ProgressBar.tsx - ניגודיות מושלמת

import React, { useRef, useEffect } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBarProps } from "../types";

const { width } = Dimensions.get("window");

// צבעים מתוקנים לניגודיות טובה
const progressColors = {
  // Current step - כתום בולט
  current: "#FF6B35",
  currentGlow: "rgba(255, 107, 53, 0.6)",
  currentBg: "rgba(255, 107, 53, 0.2)",

  // Completed step - לבן בהיר
  completed: "#FFFFFF",
  completedGlow: "rgba(255, 255, 255, 0.8)",
  completedBg: "rgba(255, 255, 255, 0.2)",

  // Future step - אפור בהיר שנראה על הרקע
  future: "rgba(255, 255, 255, 0.4)",
  futureBorder: "rgba(255, 255, 255, 0.3)",
  futureBg: "rgba(255, 255, 255, 0.1)",

  // Line colors
  lineCompleted: "#FF6B35",
  lineIncomplete: "rgba(255, 255, 255, 0.2)",

  // Progress bar
  progressTrack: "rgba(255, 255, 255, 0.2)",
  progressFill: "#FF6B35",

  // Text
  text: "rgba(255, 255, 255, 0.9)",
};

/**
 * Progress Bar מתוקן עם ניגודיות מושלמת
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  progressAnim,
  currentStep,
  totalSteps,
}) => {
  const insets = useSafeAreaInsets();
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const progressPercentage = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for current step
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim, pulseAnim]);

  // Animate progress when currentStep changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim, progressPercentage]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 15 }]}>
      {/* Steps Indicators */}
      <View style={styles.stepsContainer}>
        {[...Array(totalSteps)].map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isFuture = stepNumber > currentStep;

          return (
            <View key={stepNumber} style={styles.stepWrapper}>
              <Animated.View
                style={[
                  styles.stepIndicator,
                  {
                    transform: isCurrent
                      ? [{ scale: pulseAnim }]
                      : [{ scale: 1 }],
                  },
                ]}
              >
                {/* Glow Effect for Current Step */}
                {isCurrent && (
                  <Animated.View
                    style={[
                      styles.currentGlow,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.2, 0.4],
                        }),
                      },
                    ]}
                  />
                )}

                {/* Step Circle */}
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isCurrent && styles.stepCurrent,
                    isFuture && styles.stepFuture,
                  ]}
                >
                  {/* Background for better contrast */}
                  <View
                    style={[
                      styles.stepBackground,
                      isCompleted && styles.stepBackgroundCompleted,
                      isCurrent && styles.stepBackgroundCurrent,
                      isFuture && styles.stepBackgroundFuture,
                    ]}
                  />

                  {/* Content */}
                  {isCompleted ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        isCurrent && styles.stepNumberCurrent,
                        isFuture && styles.stepNumberFuture,
                      ]}
                    >
                      {stepNumber}
                    </Text>
                  )}
                </View>

                {/* Connection Line */}
                {index < totalSteps - 1 && (
                  <View style={styles.connectionLine}>
                    <View style={styles.lineBackground} />
                    <View
                      style={[
                        styles.lineProgress,
                        stepNumber < currentStep && styles.lineCompleted,
                      ]}
                    />
                  </View>
                )}
              </Animated.View>
            </View>
          );
        })}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                  extrapolate: "clamp",
                }),
              },
            ]}
          >
            <LinearGradient
              colors={["#FF6B35", "#F7931E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>
      </View>

      {/* Step Label */}
      <Text style={styles.stepLabel}>
        שלב {currentStep} מתוך {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24, // הקטנה מ-32
    paddingBottom: 15, // הקטנה מ-25
    alignItems: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12, // הקטנה מ-20
    width: "100%",
    paddingHorizontal: 10, // הקטנה מ-20
  },
  stepWrapper: {
    alignItems: "center",
    flex: 1,
  },
  stepIndicator: {
    alignItems: "center",
    position: "relative",
    zIndex: 2,
  },
  currentGlow: {
    position: "absolute",
    width: 32, // התאמה לגודל החדש
    height: 32, // התאמה לגודל החדש
    borderRadius: 16, // התאמה לגודל החדש
    backgroundColor: "rgba(255, 107, 53, 0.3)",
    zIndex: 0,
  },
  stepCircle: {
    width: 32, // הקטנה מ-40
    height: 32, // הקטנה מ-40
    borderRadius: 16, // הקטנה מ-20
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2, // הקטנה מ-3
    zIndex: 3,
    position: "relative",
  },
  stepBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 17,
    zIndex: -1,
  },
  stepBackgroundCompleted: {
    backgroundColor: progressColors.completedBg,
  },
  stepBackgroundCurrent: {
    backgroundColor: progressColors.currentBg,
  },
  stepBackgroundFuture: {
    backgroundColor: progressColors.futureBg,
  },
  stepCompleted: {
    backgroundColor: progressColors.completed,
    borderColor: progressColors.completed,
  },
  stepCurrent: {
    backgroundColor: progressColors.current,
    borderColor: "#FFFFFF",
    borderWidth: 3,
  },
  stepFuture: {
    backgroundColor: "transparent",
    borderColor: progressColors.futureBorder,
  },
  stepNumber: {
    fontSize: 14, // הקטנה מ-16
    fontWeight: "900",
    zIndex: 1,
  },
  stepNumberCurrent: {
    color: "#FFFFFF",
  },
  stepNumberFuture: {
    color: progressColors.future,
  },
  checkmark: {
    fontSize: 16, // הקטנה מ-18
    fontWeight: "900",
    color: progressColors.current,
    zIndex: 1,
  },
  connectionLine: {
    position: "absolute",
    left: 32, // התאמה לגודל החדש
    top: 15, // התאמה לגודל החדש
    width: width / 3 - 64, // התאמה לגודל החדש
    height: 2, // דק יותר
    zIndex: 1,
  },
  lineBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: progressColors.lineIncomplete,
    borderRadius: 2,
  },
  lineProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "0%",
    backgroundColor: progressColors.lineIncomplete,
    borderRadius: 2,
  },
  lineCompleted: {
    width: "100%",
    backgroundColor: progressColors.lineCompleted,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 8, // הקטנה מ-12
  },
  progressTrack: {
    height: 6, // הקטנה מ-8
    backgroundColor: progressColors.progressTrack,
    borderRadius: 3, // הקטנה מ-4
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 15,
    color: progressColors.text,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 4,
  },
});

export default ProgressBar;
