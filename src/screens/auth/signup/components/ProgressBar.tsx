// src/screens/auth/signup/components/ProgressBar.tsx - מתוקן ללא שגיאות

import React, { useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  Animated, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProgressBarProps } from "../types";

const { width } = Dimensions.get("window");

/**
 * Progress Bar מתוקן עם ניגודיות משופרת - ללא שגיאות
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

    // Pulse animation for active step
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim, pulseAnim]); // תיקון dependencies

  // Animate progress when currentStep changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim, progressPercentage]); // תיקון dependencies

  // חישוב רוחב קו החיבור
  const connectionLineWidth = width / totalSteps - 46;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
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
                    transform: isCurrent ? [{ scale: pulseAnim }] : [{ scale: 1 }],
                  },
                ]}
              >
                {/* Outer Glow Ring for Current Step */}
                {isCurrent && (
                  <Animated.View
                    style={[
                      styles.outerGlow,
                      {
                        opacity: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.4, 0.8],
                        }),
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={["#667eea", "#764ba2"]}
                      style={styles.outerGlowGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                  </Animated.View>
                )}

                {/* Middle Ring */}
                <View
                  style={[
                    styles.middleRing,
                    isCompleted && styles.middleRingCompleted,
                    isCurrent && styles.middleRingCurrent,
                  ]}
                />

                {/* Step Circle */}
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCompleted,
                    isCurrent && styles.stepCurrent,
                    isFuture && styles.stepFuture,
                  ]}
                >
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
                  <View style={[styles.connectionLine, { width: connectionLineWidth }]}>
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
              colors={["#667eea", "#764ba2", "#667eea"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
            
            {/* Moving Shimmer Effect */}
            <Animated.View
              style={[
                styles.shimmer,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                  transform: [
                    {
                      translateX: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, 50],
                      }),
                    },
                  ],
                },
              ]}
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
    paddingHorizontal: 32,
    paddingBottom: 20,
    alignItems: "center",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
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
  outerGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 1,
  },
  outerGlowGradient: {
    flex: 1,
    borderRadius: 30,
  },
  middleRing: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 2,
  },
  middleRingCompleted: {
    borderColor: "#667eea",
    backgroundColor: "rgba(102, 126, 234, 0.2)",
  },
  middleRingCurrent: {
    borderColor: "#667eea",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 3,
  },
  stepCompleted: {
    backgroundColor: "#667eea",
    borderColor: "#ffffff",
  },
  stepCurrent: {
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    borderColor: "#667eea",
  },
  stepFuture: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  stepNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.5)",
  },
  stepNumberCurrent: {
    color: "#667eea",
    fontSize: 16,
  },
  stepNumberFuture: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  checkmark: {
    fontSize: 18,
    fontWeight: "900",
    color: "#ffffff",
  },
  connectionLine: {
    position: "absolute",
    left: 46,
    top: 22,
    height: 3,
    zIndex: 1,
  },
  lineBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
  },
  lineProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "0%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
  },
  lineCompleted: {
    width: "100%",
    backgroundColor: "#667eea",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 8,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressGradient: {
    flex: 1,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
  },
  stepLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
});

export default ProgressBar;