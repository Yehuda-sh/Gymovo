// src/screens/auth/welcome/components/useWelcomeAnimations.ts - hook לניהול אנימציות Welcome

import { useEffect, useRef, useCallback } from "react";
import { Animated } from "react-native";

// Custom hook לניהול אנימציות כניסה מרהיבות
export const useWelcomeAnimations = () => {
  // אנימציות בשימוש בלבד
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const titleSlide = useRef(new Animated.Value(50)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;

  // הפעלת אנימציות
  const startAnimations = useCallback(() => {
    // אנימציה ראשית
    Animated.parallel([
      // Fade in כללי
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // לוגו
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // כותרת
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      // תת כותרת
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
      // כפתורים
      Animated.timing(buttonsSlide, {
        toValue: 0,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScale, titleSlide, subtitleSlide, buttonsSlide]);

  // הפעלת אנימציות בעת טעינת הרכיב
  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  return {
    fadeAnim,
    logoScale,
    titleSlide,
    subtitleSlide,
    buttonsSlide,
    startAnimations,
  };
};

export default useWelcomeAnimations;
