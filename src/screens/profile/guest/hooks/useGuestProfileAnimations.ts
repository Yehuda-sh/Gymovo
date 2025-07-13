// src/screens/profile/guest/hooks/useGuestProfileAnimations.ts
// Hook לניהול אנימציות במסך פרופיל אורח

import { useRef, useCallback } from "react";
import { Animated } from "react-native";

export const useGuestProfileAnimations = () => {
  // אנימציות בסיסיות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  // אנימציות לרכיבים ספציפיים
  const bannerSlide = useRef(new Animated.Value(-100)).current;
  const contentSlide = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // אנימציית גלילה
  const scrollY = useRef(new Animated.Value(0)).current;

  const startEntranceAnimation = useCallback(() => {
    // אנימציית רקע
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // אנימציית באנר
    Animated.spring(bannerSlide, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // אנימציות תוכן בהדרגה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(featuresAnim, {
        toValue: 1,
        duration: 600,
        delay: 600,
        useNativeDriver: true,
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return {
    fadeAnim,
    scaleAnim,
    backgroundOpacity,
    bannerSlide,
    contentSlide,
    featuresAnim,
    footerAnim,
    pulseAnim,
    scrollY,
    startEntranceAnimation,
    handleScroll,
  };
};
