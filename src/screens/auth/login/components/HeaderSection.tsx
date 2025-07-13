// src/screens/auth/login/components/HeaderSection.tsx - בהשראת WelcomeScreen

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderSectionProps } from "../types";
import { loginColors } from "../styles/loginStyles";

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  // אנימציות נוספות
  const glowAnim = useRef(new Animated.Value(0.15)).current;
  const iconRotation = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // אנימציית Glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.15,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // אנימציית סיבוב איקון
    Animated.loop(
      Animated.timing(iconRotation, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // אנימציית Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const iconSpin = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          transform: [{ translateY: slideAnim }, { scale: headerScale }],
          opacity: fadeAnim,
        },
      ]}
    >
      {/* לוגו עם אפקטים */}
      <View style={styles.logoContainer}>
        {/* Glow Effect */}
        <Animated.View
          style={[
            styles.logoGlow,
            {
              opacity: glowAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />

        {/* Logo Frame */}
        <View style={styles.logoFrame}>
          <Animated.View
            style={{
              transform: [{ rotate: iconSpin }],
            }}
          >
            <Ionicons name="barbell" size={48} color="#FFFFFF" />
          </Animated.View>
        </View>

        {/* Decorative rings */}
        <View style={[styles.ring, styles.ring1]} />
        <View style={[styles.ring, styles.ring2]} />
      </View>

      {/* כותרת */}
      <Animated.Text
        style={[
          styles.title,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        התחברות
      </Animated.Text>

      {/* כותרת משנה */}
      <Text style={styles.subtitle}>כניסה מאובטחת לחשבון שלך</Text>

      {/* קו דקורטיבי */}
      <LinearGradient
        colors={[loginColors.logoGlow, loginColors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentLine}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    position: "relative",
    marginBottom: 32,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: loginColors.primary,
    opacity: 0.2,
  },
  logoFrame: {
    width: 120,
    height: 120,
    borderRadius: 40,
    backgroundColor: loginColors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: loginColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  ring: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: loginColors.logoGlow,
  },
  ring1: {
    width: 110,
    height: 110,
    opacity: 0.3,
  },
  ring2: {
    width: 130,
    height: 130,
    opacity: 0.15,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: loginColors.text,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -1,
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-black",
    textShadowColor: "rgba(255, 107, 53, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 17,
    color: loginColors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 0.3,
    fontWeight: "500",
  },
  accentLine: {
    width: 60,
    height: 4,
    borderRadius: 2,
    shadowColor: loginColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default HeaderSection;
