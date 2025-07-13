// src/screens/workouts/start-workout/hooks/useWorkoutAnimations.ts
// Hook לניהול אנימציות מרכזיות למסך התחלת אימון

import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface AnimationConfig {
  fadeIn?: boolean;
  slide?: boolean;
  scale?: boolean;
  rotate?: boolean;
  delay?: number;
  duration?: number;
}

interface UseWorkoutAnimationsReturn {
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
  scaleAnim: Animated.Value;
  rotateAnim: Animated.Value;
  headerScaleAnim: Animated.Value;
  startEntrance: () => void;
  animateSelection: (isSelected: boolean) => void;
  animatePress: (callback?: () => void) => void;
  getAnimatedStyle: (config?: AnimationConfig) => any;
}

export const useWorkoutAnimations = (): UseWorkoutAnimationsReturn => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const headerScaleAnim = useRef(new Animated.Value(0.8)).current;

  // Start entrance animation
  const startEntrance = () => {
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Slide up
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Scale in
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      // Header scale
      Animated.spring(headerScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate selection state
  const animateSelection = (isSelected: boolean) => {
    Animated.parallel([
      // Rotate effect
      Animated.timing(rotateAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      // Scale effect
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1.05 : 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Animate press
  const animatePress = (callback?: () => void) => {
    Animated.sequence([
      // Scale down
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      // Bounce back
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  // Get animated style based on config
  const getAnimatedStyle = (config: AnimationConfig = {}) => {
    const {
      fadeIn = true,
      slide = true,
      scale = true,
      rotate = false,
      delay = 0,
      duration = 300,
    } = config;

    const styles: any = {};

    if (fadeIn) {
      styles.opacity = fadeAnim;
    }

    const transforms = [];

    if (slide) {
      transforms.push({
        translateY: slideAnim.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 50],
        }),
      });
    }

    if (scale) {
      transforms.push({ scale: scaleAnim });
    }

    if (rotate) {
      transforms.push({
        rotateY: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "5deg"],
        }),
      });
    }

    if (transforms.length > 0) {
      styles.transform = transforms;
    }

    return styles;
  };

  // Auto-start entrance animation
  useEffect(() => {
    startEntrance();
  }, []);

  return {
    fadeAnim,
    slideAnim,
    scaleAnim,
    rotateAnim,
    headerScaleAnim,
    startEntrance,
    animateSelection,
    animatePress,
    getAnimatedStyle,
  };
};
