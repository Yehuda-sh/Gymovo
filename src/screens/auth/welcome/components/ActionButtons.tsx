// src/screens/auth/welcome/components/ActionButtons.tsx - גרסה קומפקטית למובייל

import React, { useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps } from "../types";

const { height, width } = Dimensions.get("window");
const isSmallDevice = height < 700;
const isNarrowDevice = width < 350;

// Theme colors
const theme = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  accent: "#FFD23F",
  // Dark mode variants
  primaryDark: "#E55A2B",
  secondaryDark: "#E5851A",
};

// Animation configuration
const ANIMATION_CONFIG = {
  tension: 300,
  friction: 10,
  useNativeDriver: true,
};

const PRESS_SCALE = 0.95;
const ANIMATION_DELAY = 100;

export const ActionButtons: React.FC<ActionButtonsProps> = memo(
  ({ onSignup, onLogin, buttonsSlide, fadeAnim }) => {
    const signupScale = useRef(new Animated.Value(1)).current;
    const loginScale = useRef(new Animated.Value(1)).current;

    // Press animations
    const animatePress = useCallback(
      (scale: Animated.Value, toValue: number) => {
        Animated.spring(scale, {
          toValue,
          ...ANIMATION_CONFIG,
        }).start();
      },
      []
    );

    // Signup button handlers
    const handleSignupPressIn = useCallback(() => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      animatePress(signupScale, PRESS_SCALE);
    }, [animatePress, signupScale]);

    const handleSignupPressOut = useCallback(() => {
      animatePress(signupScale, 1);
      setTimeout(() => onSignup(), ANIMATION_DELAY);
    }, [animatePress, signupScale, onSignup]);

    // Login button handlers
    const handleLoginPressIn = useCallback(() => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      animatePress(loginScale, PRESS_SCALE);
    }, [animatePress, loginScale]);

    const handleLoginPressOut = useCallback(() => {
      animatePress(loginScale, 1);
      setTimeout(() => onLogin(), ANIMATION_DELAY);
    }, [animatePress, loginScale, onLogin]);

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: buttonsSlide }],
            opacity: fadeAnim,
          },
        ]}
      >
        {/* כפתור הרשמה ראשי */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            { transform: [{ scale: signupScale }] },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={handleSignupPressIn}
            onPressOut={handleSignupPressOut}
            accessible={true}
            accessibilityLabel="הרשמה למערכת"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[theme.primary, theme.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.signupButton}
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="rocket"
                  size={isSmallDevice ? 20 : 22}
                  color="#fff"
                />
                <Text
                  style={[
                    styles.signupButtonText,
                    isNarrowDevice && styles.signupButtonTextSmall,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  בואו נתחיל את המסע!
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={isSmallDevice ? 18 : 20}
                  color="#fff"
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Divider with "או" */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>או</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* קישור כניסה */}
        <Animated.View
          style={[
            styles.loginContainer,
            { transform: [{ scale: loginScale }] },
          ]}
        >
          <TouchableOpacity
            onPressIn={handleLoginPressIn}
            onPressOut={handleLoginPressOut}
            style={styles.loginButton}
            activeOpacity={1}
            accessible={true}
            accessibilityLabel="כניסה לחשבון קיים"
            accessibilityRole="button"
          >
            <Text style={styles.loginText}>יש לי חשבון</Text>
            <Ionicons
              name="log-in-outline"
              size={isSmallDevice ? 16 : 18}
              color={theme.primary}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  }
);

ActionButtons.displayName = "ActionButtons";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: isSmallDevice ? 10 : 20,
  },
  buttonWrapper: {
    marginBottom: 12,
  },
  signupButton: {
    height: isSmallDevice ? 52 : 58,
    borderRadius: isSmallDevice ? 14 : 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: isSmallDevice ? 8 : 10,
    paddingHorizontal: 20,
  },
  signupButtonText: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  signupButtonTextSmall: {
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 40,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  loginContainer: {
    alignItems: "center",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  loginText: {
    fontSize: isSmallDevice ? 14 : 15,
    fontWeight: "600",
    color: theme.primary,
  },
});

// Export both named and default
export { ActionButtons as default };
