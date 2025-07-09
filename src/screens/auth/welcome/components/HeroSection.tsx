// src/screens/auth/welcome/components/HeroSection.tsx - רכיב Hero עם לוגו וכותרת מואנמים

import React from "react";
import { View, Text, StyleSheet, Animated, Platform } from "react-native";
import { HeroSectionProps, welcomeColors } from "../types";

// רכיב Hero עם אנימציות מרהיבות לחוויה מרגשת
export const HeroSection: React.FC<HeroSectionProps> = ({
  fadeAnim,
  logoScale,
  titleSlide,
  subtitleSlide,
}) => {
  return (
    <View style={styles.logoSection}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoGlow} />
        <Text style={styles.logo}>💪</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [{ translateY: titleSlide }],
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.title}>Gymovo</Text>
        <View style={styles.accentLine} />
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ translateY: subtitleSlide }],
          opacity: fadeAnim,
        }}
      >
        <Text style={styles.subtitle}>התוכנית האישית שלך לחדר הכושר</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    backgroundColor: welcomeColors.logoGlow,
    borderRadius: 60,
    opacity: 0.2,
    top: -10,
  },
  logo: {
    fontSize: 64,
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: welcomeColors.text,
    marginBottom: 8,
    letterSpacing: -1,
    fontFamily: Platform.select({
      ios: "Avenir-Heavy",
      android: "sans-serif-condensed",
    }),
  },
  accentLine: {
    width: 60,
    height: 4,
    backgroundColor: welcomeColors.accentLine,
    borderRadius: 2,
    shadowColor: welcomeColors.accentLine,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  subtitle: {
    fontSize: 18,
    color: welcomeColors.subtitle,
    textAlign: "center",
    fontWeight: "400",
  },
});

export default HeroSection;
