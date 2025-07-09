// src/screens/auth/quiz/components/useQuizAnimations.ts - hook לניהול אנימציות Quiz

import { useRef, useCallback } from "react";
import { Animated, Dimensions } from "react-native";
import { QuizAnimations } from "../types";

const { width } = Dimensions.get("window");

// Custom hook לניהול אנימציות מעבר בין שאלות
export const useQuizAnimations = (): QuizAnimations => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // אנימציה למעבר לשאלה הבאה
  const animateToNextQuestion = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return {
    slideAnim,
    fadeAnim,
    animateToNextQuestion,
  };
};

export default useQuizAnimations;
