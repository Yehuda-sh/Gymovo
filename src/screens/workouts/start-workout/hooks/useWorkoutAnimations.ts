// src/screens/workouts/start-workout/hooks/useWorkoutAnimations.ts

import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing } from "react-native";

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
}

export const useWorkoutAnimations = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const animatePress = useCallback(
    (scale = 0.95) => {
      return Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: scale,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [scaleAnim]
  );

  const animateSlideIn = useCallback(
    (config: AnimationConfig = {}) => {
      const {
        duration = 300,
        delay = 0,
        easing = Easing.out(Easing.cubic),
      } = config;

      slideAnim.setValue(50);
      fadeAnim.setValue(0);

      return Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration,
          delay,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          delay,
          easing,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [slideAnim, fadeAnim]
  );

  const animateRotate = useCallback(
    (config: AnimationConfig = {}) => {
      const { duration = 300, delay = 0 } = config;

      return Animated.timing(rotateAnim, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [rotateAnim]
  );

  const getAnimatedStyle = useCallback(
    (
      options: {
        scale?: boolean;
        slide?: boolean;
        rotate?: boolean;
        fade?: boolean;
      } = {}
    ) => {
      const {
        scale = true,
        slide = true,
        rotate = false,
        fade = true,
      } = options;
      const styles: any = {};

      if (fade) {
        styles.opacity = fadeAnim;
      }

      const transforms: any[] = [];

      if (scale) {
        transforms.push({ scale: scaleAnim });
      }

      if (slide) {
        transforms.push({ translateY: slideAnim });
      }

      if (rotate) {
        transforms.push({
          rotateY: rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
          }),
        });
      }

      if (transforms.length > 0) {
        styles.transform = transforms;
      }

      return styles;
    },
    [fadeAnim, scaleAnim, slideAnim, rotateAnim]
  );

  return {
    fadeAnim,
    scaleAnim,
    slideAnim,
    rotateAnim,
    animatePress,
    animateSlideIn,
    animateRotate,
    getAnimatedStyle,
  };
};
