// src/screens/workouts/active-workout/components/ProgressRing.tsx

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ProgressRingProps, workoutColors } from "../types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// 🎯 טבעת התקדמות ויזואלית
const ProgressRing: React.FC<ProgressRingProps> = ({ progress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const size = 50;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.progressRingContainer}>
      <Svg width={size} height={size}>
        <Circle
          stroke={workoutColors.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          stroke={workoutColors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
      </Svg>
      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressRingContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: workoutColors.primary,
  },
});

export default ProgressRing;
