// src/screens/auth/welcome/components/ActionButtons.tsx - גרסה קומפקטית למובייל

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps, welcomeColors } from "../types";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

const newColors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  accent: "#FFD23F",
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSignup,
  onLogin,
  buttonsSlide,
  fadeAnim,
}) => {
  const signupScale = useRef(new Animated.Value(1)).current;
  const loginScale = useRef(new Animated.Value(1)).current;

  const handleSignupPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(signupScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleSignupPressOut = () => {
    Animated.spring(signupScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onSignup(), 100);
  };

  const handleLoginPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(loginScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleLoginPressOut = () => {
    Animated.spring(loginScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onLogin(), 100);
  };

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
        style={[styles.buttonWrapper, { transform: [{ scale: signupScale }] }]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handleSignupPressIn}
          onPressOut={handleSignupPressOut}
        >
          <LinearGradient
            colors={[newColors.primary, newColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.signupButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="rocket" size={22} color="#fff" />
              <Text style={styles.signupButtonText}>בואו נתחיל את המסע!</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* קישור כניסה */}
      <Animated.View
        style={[styles.loginContainer, { transform: [{ scale: loginScale }] }]}
      >
        <TouchableOpacity
          onPressIn={handleLoginPressIn}
          onPressOut={handleLoginPressOut}
          style={styles.loginButton}
          activeOpacity={1}
        >
          <Text style={styles.loginText}>יש לי חשבון</Text>
          <Ionicons name="log-in-outline" size={18} color={newColors.primary} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: isSmallDevice ? 10 : 20,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  signupButton: {
    height: isSmallDevice ? 54 : 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: newColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  signupButtonText: {
    fontSize: isSmallDevice ? 17 : 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
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
  },
  loginText: {
    fontSize: 15,
    fontWeight: "600",
    color: newColors.primary,
  },
});

export default ActionButtons;
