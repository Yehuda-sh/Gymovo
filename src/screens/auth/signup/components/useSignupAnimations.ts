// src/screens/auth/signup/components/useSignupAnimations.ts

import { useEffect, useRef } from "react";
import { Animated, Keyboard } from "react-native";

export const useSignupAnimations = () => {
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const headerScale = useRef(new Animated.Value(0.5)).current;
  const formSlide = useRef(new Animated.Value(300)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations - רצף מתקדם
    Animated.sequence([
      // Phase 1: Header מלמעלה
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(headerScale, {
          toValue: 1,
          tension: 40,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2: Form מלמטה
      Animated.spring(formSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      // Phase 3: Progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false, // false כי זה width
      }),
    ]).start();

    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        Animated.timing(keyboardOffset, {
          toValue: -event.endCoordinates.height / 4,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [
    fadeAnim,
    formSlide,
    headerScale,
    keyboardOffset,
    slideAnim,
    progressAnim,
  ]);

  // Shake animation לשגיאות
  const playShakeAnimation = () => {
    Animated.sequence([
      Animated.timing(formSlide, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(formSlide, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(formSlide, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Success animation
  const playSuccessAnimation = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1.1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  return {
    fadeAnim,
    slideAnim,
    headerScale,
    formSlide,
    progressAnim,
    keyboardOffset,
    playShakeAnimation,
    playSuccessAnimation,
  };
};
