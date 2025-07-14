// src/screens/auth/welcome/components/BackgroundGradient.tsx - רכיב רקע משופר עם גרדיאנט

import React, { useRef, useEffect, memo } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BackgroundGradientProps } from "../types";

const { width, height } = Dimensions.get("window");

// Animation configuration
const ANIMATION_CONFIG = {
  pulseDuration: 4000,
  minOpacity: 0.05,
  maxOpacity: 0.15,
  useNativeDriver: true,
};

// Default gradient colors
const gradientColors = {
  base: ["#1a1a2e", "#16213e", "#0f3460"] as const,
  glow: ["#667eea", "#764ba2"] as const,
  cornerTop: "rgba(102,126,234,0.1)",
  cornerBottom: "rgba(118,75,162,0.1)",
};

export const BackgroundGradient: React.FC<BackgroundGradientProps> = memo(
  ({ visible = true }) => {
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

    // Fade animation when visibility changes
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [visible, fadeAnim]);

    // Pulse animation
    useEffect(() => {
      if (!visible) return;

      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: ANIMATION_CONFIG.pulseDuration,
            useNativeDriver: ANIMATION_CONFIG.useNativeDriver,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: ANIMATION_CONFIG.pulseDuration,
            useNativeDriver: ANIMATION_CONFIG.useNativeDriver,
          }),
        ])
      );

      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }, [visible, pulseAnim]);

    // Don't render if not visible
    if (!visible) return null;

    return (
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
        pointerEvents="none"
      >
        {/* רקע בסיס עם גרדיאנט כהה */}
        <LinearGradient
          colors={gradientColors.base}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.5, 1]}
        />

        {/* שכבת glow עדינה */}
        <Animated.View
          style={[
            styles.glowOverlay,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  ANIMATION_CONFIG.minOpacity,
                  ANIMATION_CONFIG.maxOpacity,
                ],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={gradientColors.glow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        {/* אפקט gradient נוסף בפינות */}
        <View style={styles.cornerGradientTop}>
          <LinearGradient
            colors={[gradientColors.cornerTop, "transparent"] as const}
            style={styles.cornerGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>

        <View style={styles.cornerGradientBottom}>
          <LinearGradient
            colors={["transparent", gradientColors.cornerBottom] as const}
            style={styles.cornerGradient}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
        </View>

        {/* Side gradients for wider screens */}
        {width > 768 && (
          <>
            <View style={styles.sideGradientLeft}>
              <LinearGradient
                colors={[gradientColors.cornerTop, "transparent"] as const}
                style={styles.sideGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </View>
            <View style={styles.sideGradientRight}>
              <LinearGradient
                colors={["transparent", gradientColors.cornerBottom] as const}
                style={styles.sideGradient}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
            </View>
          </>
        )}
      </Animated.View>
    );
  }
);

BackgroundGradient.displayName = "BackgroundGradient";

const styles = StyleSheet.create({
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cornerGradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  cornerGradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
  cornerGradient: {
    flex: 1,
  },
  sideGradientLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.2,
  },
  sideGradientRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: width * 0.2,
  },
  sideGradient: {
    flex: 1,
  },
});

export default BackgroundGradient;
