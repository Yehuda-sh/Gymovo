// src/screens/auth/signup/components/useSignupAnimations.ts

import { useEffect, useRef, useCallback } from "react";
import { Animated, Keyboard } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Hook מתקדם לניהול אנימציות במסך ההרשמה
 * מבוסס על useWelcomeAnimations עם שיפורים למסך signup
 */
export const useSignupAnimations = () => {
  // אנימציות בסיסיות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;
  const formSlide = useRef(new Animated.Value(30)).current;
  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // אנימציות מתקדמות
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  // הפעלת אנימציות כניסה
  const startEntryAnimations = useCallback(() => {
    Animated.parallel([
      // Fade in כללי
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Header slide and scale
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(headerScale, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        // Form entrance
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [fadeAnim, slideAnim, headerScale, formSlide]);

  // אנימציית רעידה לשגיאות
  const playShakeAnimation = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim]);

  // אנימציית הצלחה
  const playSuccessAnimation = useCallback(
    (onComplete?: () => void) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.sequence([
        // Scale up success indicator
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Brief pause
        Animated.delay(300),
        // Fade out entire screen
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    },
    [successAnim, fadeAnim, slideAnim]
  );

  // אנימציית פעימה לכפתורים
  const startButtonPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [buttonPulse]);

  // טיפול במקלדת
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      "keyboardWillShow",
      (event) => {
        Animated.timing(keyboardOffset, {
          toValue: -event.endCoordinates.height / 4,
          duration: event.duration || 250,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      "keyboardWillHide",
      (event) => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: event.duration || 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardOffset]);

  // הפעלת אנימציות כניסה בטעינה
  useEffect(() => {
    startEntryAnimations();
    startButtonPulse();
  }, [startEntryAnimations, startButtonPulse]);

  // אנימציית loading למצבי המתנה
  const playLoadingAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 0.95,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [buttonPulse]);

  // איפוס אנימציות
  const resetAnimations = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    headerScale.setValue(0.8);
    formSlide.setValue(30);
    keyboardOffset.setValue(0);
    shakeAnim.setValue(0);
    successAnim.setValue(0);
    buttonPulse.setValue(1);
  }, [
    fadeAnim,
    slideAnim,
    headerScale,
    formSlide,
    keyboardOffset,
    shakeAnim,
    successAnim,
    buttonPulse,
  ]);

  return {
    // Animated Values
    fadeAnim,
    slideAnim,
    headerScale,
    formSlide,
    keyboardOffset,
    progressAnim,
    shakeAnim,
    successAnim,
    buttonPulse,

    // Animation Functions
    startEntryAnimations,
    playShakeAnimation,
    playSuccessAnimation,
    startButtonPulse,
    playLoadingAnimation,
    resetAnimations,

    // Transform Objects (עבור שימוש בסגנונות)
    transforms: {
      shake: { translateX: shakeAnim },
      success: { scale: successAnim },
      buttonPulse: { scale: buttonPulse },
    },
  };
};

export default useSignupAnimations;
