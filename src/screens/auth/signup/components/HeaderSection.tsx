// src/screens/auth/signup/components/HeaderSection.tsx - מתוקן ללא שגיאות

import React, { useRef, useEffect } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderSectionProps } from "../types";

const { width } = Dimensions.get("window");

/**
 * Header משופר לSignupScreen עם עיצוב דומה ל-WelcomeScreen - ללא שגיאות
 */
const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.7,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, glowPulse]); // תיקון dependencies

  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: headerScale }],
        },
      ]}
    >
      {/* Logo Container with Glow */}
      <View style={styles.logoContainer}>
        {/* Multiple Glow Layers */}
        <Animated.View
          style={[
            styles.glowLayer1,
            {
              opacity: glowPulse,
              transform: [
                {
                  scale: glowPulse.interpolate({
                    inputRange: [0.7, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.glow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glowLayer2,
            {
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={["#FF6B35", "#F7931E"]}
            style={styles.glow}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>

        {/* Logo Background */}
        <View style={styles.logoBackground}>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0.9)", "rgba(0, 0, 0, 0.7)"]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>

        {/* Main Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.05],
                  }),
                },
                {
                  rotate: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "5deg"],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="person-add" size={44} color="#667eea" />
        </Animated.View>
      </View>

      {/* Title Section */}
      <Animated.View
        style={[
          styles.titleContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>הרשמה</Text>
        <Text style={styles.subtitle}>הצטרף לקהילת הכושר המתקדמת</Text>

        {/* Decorative Line */}
        <View style={styles.decorativeLine}>
          <LinearGradient
            colors={["transparent", "#667eea", "#764ba2", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.lineGradient}
          />
        </View>
      </Animated.View>

      {/* Floating Particles Effect */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${20 + index * 10}%`,
                top: `${30 + Math.sin(index) * 20}%`,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
                transform: [
                  {
                    translateY: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10 - index * 2],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  glowLayer1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  glowLayer2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  glow: {
    flex: 1,
    borderRadius: 70,
  },
  logoBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(102, 126, 234, 0.4)",
  },
  logoGradient: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
    letterSpacing: -1,
    textShadowColor: "rgba(102, 126, 234, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  decorativeLine: {
    width: width * 0.4,
    height: 3,
    marginTop: 8,
  },
  lineGradient: {
    flex: 1,
    borderRadius: 2,
  },
  particlesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(102, 126, 234, 0.6)",
  },
});

export default HeaderSection;
