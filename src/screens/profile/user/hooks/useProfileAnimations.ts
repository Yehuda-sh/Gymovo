// src/screens/profile/user/hooks/useProfileAnimations.ts
// Hook לניהול אנימציות של הפרופיל

import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { ProfileAnimationsHook } from "../types";

export const useProfileAnimations = (): ProfileAnimationsHook => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // אנימציית כניסה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return {
    fadeAnim,
    slideAnim,
  };
};
