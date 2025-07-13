// src/screens/auth/login/components/HeaderSection.tsx - מעוצב לרקע גרדיאנט

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { HeaderSectionProps } from "../types";

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  // אנימציות נוספות ללוגו
  const logoRotate = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    // אנימציית סיבוב עדין ללוגו
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // אנימציית פעימה לזוהר
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.2,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "5deg"],
  });

  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          transform: [{ translateY: slideAnim }, { scale: headerScale }],
        },
      ]}
    >
      {/* Logo Container */}
      <View style={styles.logoContainer}>
        {/* Glow Effect */}
        <Animated.View style={[styles.logoGlow, { opacity: glowPulse }]} />

        {/* Secondary Glow */}
        <Animated.View
          style={[
            styles.logoGlowSecondary,
            {
              opacity: glowPulse.interpolate({
                inputRange: [0.2, 0.4],
                outputRange: [0.1, 0.2],
              }),
            },
          ]}
        />

        {/* Logo with gradient and blur */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <BlurView intensity={15} style={styles.logoBlur}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.logoFrame}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="fitness" size={40} color="#ffffff" />
              {/* Small accent dot */}
              <View style={styles.accentDot} />
            </LinearGradient>
          </BlurView>
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        התחברות
      </Animated.Text>

      {/* Subtitle */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.8],
            }),
          },
        ]}
      >
        כניסה מאובטחת לחשבון שלך
      </Animated.Text>

      {/* Accent Line with Gradient */}
      <Animated.View
        style={[
          styles.accentLineContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                scaleX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
              },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.accentLine}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 24,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    position: "relative",
  },
  logoGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#667eea",
    top: -10,
    left: -10,
  },
  logoGlowSecondary: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#764ba2",
    top: -20,
    left: -20,
  },
  logoBlur: {
    borderRadius: 40,
    overflow: "hidden",
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: "relative",
  },
  accentDot: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    opacity: 0.8,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-condensed",
    textShadowColor: "rgba(102, 126, 234, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  accentLineContainer: {
    overflow: "hidden",
    borderRadius: 2,
    height: 3,
    width: 60,
  },
  accentLine: {
    flex: 1,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default HeaderSection;
