// src/screens/auth/welcome/components/useWelcomeAnimations.ts - hook לניהול אנימציות Welcome

import { useEffect, useRef, useCallback, useMemo } from "react";
import { Animated, Easing, useColorScheme } from "react-native";

// Animation configuration
interface AnimationConfig {
  enableAnimations?: boolean;
  animationSpeed?: "slow" | "normal" | "fast";
  staggerDelay?: number;
  useSpring?: boolean;
}

// Animation timings by speed
const ANIMATION_TIMINGS = {
  slow: { fade: 1500, slide: 1200, scale: 1000 },
  normal: { fade: 1000, slide: 800, scale: 700 },
  fast: { fade: 500, slide: 400, scale: 350 },
} as const;

// Custom hook לניהול אנימציות כניסה מרהיבות
export const useWelcomeAnimations = (config: AnimationConfig = {}) => {
  const {
    enableAnimations = true,
    animationSpeed = "normal",
    staggerDelay = 200,
    useSpring = true,
  } = config;

  const colorScheme = useColorScheme();
  const timings = ANIMATION_TIMINGS[animationSpeed];

  // Core animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(50)).current;
  const subtitleSlide = useRef(new Animated.Value(30)).current;
  const buttonsSlide = useRef(new Animated.Value(100)).current;

  // Additional animations
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const backgroundScale = useRef(new Animated.Value(1.1)).current;
  const particleAnimation = useRef(new Animated.Value(0)).current;

  // Interpolations
  const interpolations = useMemo(
    () => ({
      logoRotation: logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      }),
      glowPulse: glowOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
      }),
      particleY: particleAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -100],
      }),
    }),
    [logoRotate, glowOpacity, particleAnimation]
  );

  // Reset all animations
  const resetAnimations = useCallback(() => {
    fadeAnim.setValue(0);
    logoScale.setValue(0.2);
    logoRotate.setValue(0);
    titleSlide.setValue(50);
    subtitleSlide.setValue(30);
    buttonsSlide.setValue(100);
    glowOpacity.setValue(0);
    backgroundScale.setValue(1.1);
    particleAnimation.setValue(0);
  }, [
    fadeAnim,
    logoScale,
    logoRotate,
    titleSlide,
    subtitleSlide,
    buttonsSlide,
    glowOpacity,
    backgroundScale,
    particleAnimation,
  ]);

  // Continuous animations (glow, particles, etc.)
  const startContinuousAnimations = useCallback(() => {
    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle float
    Animated.loop(
      Animated.timing(particleAnimation, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [glowOpacity, particleAnimation]);

  // Main entrance animation
  const startAnimations = useCallback(() => {
    if (!enableAnimations) {
      // Skip animations if disabled
      fadeAnim.setValue(1);
      logoScale.setValue(1);
      titleSlide.setValue(0);
      subtitleSlide.setValue(0);
      buttonsSlide.setValue(0);
      return;
    }

    // Reset before starting
    resetAnimations();

    // Main animation sequence
    Animated.parallel([
      // Fade in כללי
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: timings.fade,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Background scale
      Animated.timing(backgroundScale, {
        toValue: 1,
        duration: timings.fade * 1.2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Logo animations
      useSpring
        ? Animated.spring(logoScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        : Animated.timing(logoScale, {
            toValue: 1,
            duration: timings.scale,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),

      // Logo rotation
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: timings.scale * 1.5,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Title slide
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: timings.slide,
        delay: staggerDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Subtitle slide
      Animated.timing(subtitleSlide, {
        toValue: 0,
        duration: timings.slide,
        delay: staggerDelay * 2,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // Buttons slide
      Animated.timing(buttonsSlide, {
        toValue: 0,
        duration: timings.slide,
        delay: staggerDelay * 3,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start continuous animations after entrance
      startContinuousAnimations();
    });
  }, [
    enableAnimations,
    fadeAnim,
    logoScale,
    logoRotate,
    titleSlide,
    subtitleSlide,
    buttonsSlide,
    backgroundScale,
    timings,
    staggerDelay,
    useSpring,
    resetAnimations,
    startContinuousAnimations,
  ]);

  // Exit animation
  const exitAnimation = useCallback(() => {
    return new Promise((resolve) => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => resolve(true));
    });
  }, [fadeAnim, logoScale]);

  // Shake animation (for errors)
  const shakeAnimation = useCallback((animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Bounce animation (for success)
  const bounceAnimation = useCallback((animatedValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Start animations on mount
  useEffect(() => {
    startAnimations();

    // Cleanup
    return () => {
      glowOpacity.stopAnimation();
      particleAnimation.stopAnimation();
    };
  }, [startAnimations, glowOpacity, particleAnimation]);

  // Restart animations when color scheme changes
  useEffect(() => {
    if (colorScheme) {
      resetAnimations();
      startAnimations();
    }
  }, [colorScheme, resetAnimations, startAnimations]);

  return {
    // Core animations
    fadeAnim,
    logoScale,
    logoRotate,
    titleSlide,
    subtitleSlide,
    buttonsSlide,

    // Additional animations
    glowOpacity,
    backgroundScale,
    particleAnimation,

    // Interpolations
    interpolations,

    // Methods
    startAnimations,
    resetAnimations,
    exitAnimation,
    shakeAnimation,
    bounceAnimation,

    // Config
    isAnimationEnabled: enableAnimations,
    animationSpeed,
  };
};

export default useWelcomeAnimations;
