// src/screens/auth/signup/components/SecurityNote.tsx

import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SecurityNoteProps, signupColors } from "../types";

const SecurityNote: React.FC<SecurityNoteProps> = ({ visible }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

      // Glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible, fadeAnim, glowAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel="הנתונים שלך מוגנים בהצפנה מתקדמת"
    >
      {/* Background with Gradient Border */}
      <LinearGradient
        colors={[signupColors.securityBorder, signupColors.primaryGlow]}
        style={styles.border}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Icon with Glow */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.iconGlow,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.7],
                  }),
                  backgroundColor: signupColors.securityBackground,
                },
              ]}
            />
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={signupColors.success}
              style={styles.icon}
            />
          </View>

          {/* Text */}
          <Text style={styles.text}>הנתונים שלך מוגנים בהצפנה מתקדמת</Text>

          {/* Additional Security Indicators */}
          <View style={styles.indicators}>
            <View style={styles.indicator}>
              <Ionicons
                name="lock-closed"
                size={12}
                color={signupColors.info}
              />
            </View>
            <View style={styles.indicator}>
              <Ionicons
                name="checkmark-circle"
                size={12}
                color={signupColors.success}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  border: {
    padding: 1.5,
    borderRadius: 12,
  },
  content: {
    backgroundColor: signupColors.securityBackground,
    borderRadius: 10.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconContainer: {
    position: "relative",
    marginRight: 10,
  },
  iconGlow: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -3,
    left: -3,
  },
  icon: {
    zIndex: 1,
  },
  text: {
    color: signupColors.securityText,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
    letterSpacing: -0.2,
  },
  indicators: {
    flexDirection: "row",
    marginLeft: 8,
    gap: 4,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SecurityNote;
