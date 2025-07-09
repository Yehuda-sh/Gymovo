// src/hooks/useAnimatedValue.ts - 🎬 Hook לניהול ערכי אנימציה

import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing } from "react-native";

/**
 * Hook ליצירת וניהול ערך אנימציה
 * @param initialValue - ערך התחלתי
 * @returns Animated.Value
 */
export const useAnimatedValue = (initialValue: number = 0): Animated.Value => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    // איפוס הערך בכל פעם שהערך ההתחלתי משתנה
    animatedValue.setValue(initialValue);
  }, [initialValue, animatedValue]);

  return animatedValue;
};

/**
 * Hook לאנימציית fade in/out
 * @param visible - האם האלמנט מוצג
 * @param duration - משך האנימציה במילישניות
 * @returns Animated.Value
 */
export const useFadeAnimation = (
  visible: boolean,
  duration: number = 300
): Animated.Value => {
  const fadeAnim = useAnimatedValue(visible ? 1 : 0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration,
      useNativeDriver: true,
    }).start();
  }, [visible, duration, fadeAnim]);

  return fadeAnim;
};

/**
 * Hook לאנימציית scale
 * @param pressed - האם האלמנט לחוץ
 * @param pressedScale - גודל בעת לחיצה
 * @param duration - משך האנימציה
 * @returns Animated.Value
 */
export const useScaleAnimation = (
  pressed: boolean,
  pressedScale: number = 0.95,
  duration: number = 150
): Animated.Value => {
  const scaleAnim = useAnimatedValue(1);

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: pressed ? pressedScale : 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, [pressed, pressedScale, duration, scaleAnim]);

  return scaleAnim;
};

/**
 * Hook לאנימציית slide
 * @param visible - האם האלמנט מוצג
 * @param slideDirection - כיוון הזזה
 * @param slideDistance - מרחק הזזה
 * @param duration - משך האנימציה
 * @returns Animated.Value
 */
export const useSlideAnimation = (
  visible: boolean,
  slideDirection: "up" | "down" | "left" | "right" = "up",
  slideDistance: number = 50,
  duration: number = 300
): Animated.Value => {
  const slideAnim = useAnimatedValue(visible ? 0 : slideDistance);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : slideDistance,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, slideDistance, duration, slideAnim]);

  return slideAnim;
};

/**
 * Hook לאנימציית spring עם bounce
 * @param triggered - האם האנימציה מופעלת
 * @param fromValue - ערך התחלה
 * @param toValue - ערך יעד
 * @returns Animated.Value ופונקציית הפעלה
 */
export const useSpringAnimation = (
  triggered: boolean,
  fromValue: number = 0,
  toValue: number = 1
): [Animated.Value, () => void] => {
  const springAnim = useAnimatedValue(fromValue);

  const trigger = useCallback(() => {
    springAnim.setValue(fromValue);
    Animated.spring(springAnim, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [springAnim, fromValue, toValue]);

  useEffect(() => {
    if (triggered) {
      trigger();
    }
  }, [triggered, trigger]);

  return [springAnim, trigger];
};

/**
 * Hook לאנימציית rotation
 * @param rotating - האם האלמנט מסתובב
 * @param duration - משך סיבוב אחד במילישניות
 * @returns Animated.Value
 */
export const useRotationAnimation = (
  rotating: boolean,
  duration: number = 2000
): Animated.Value => {
  const rotateAnim = useAnimatedValue(0);

  useEffect(() => {
    if (rotating) {
      const startRotation = () => {
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished && rotating) {
            startRotation();
          }
        });
      };
      startRotation();
    }
  }, [rotating, duration, rotateAnim]);

  return rotateAnim;
};

/**
 * Hook לאנימציית progress bar
 * @param progress - אחוז התקדמות (0-100)
 * @param duration - משך האנימציה
 * @returns Animated.Value
 */
export const useProgressAnimation = (
  progress: number,
  duration: number = 500
): Animated.Value => {
  const progressAnim = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: Math.max(0, Math.min(100, progress)),
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // Width animation can't use native driver
    }).start();
  }, [progress, duration, progressAnim]);

  return progressAnim;
};
