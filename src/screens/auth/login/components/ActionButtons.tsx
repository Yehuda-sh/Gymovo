// src/screens/auth/login/components/ActionButtons.tsx - גרסה קומפקטית למובייל

import React, { useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps } from "../types";
import { loginColors } from "../styles/loginStyles";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  onLogin,
  onBack,
}) => {
  // אנימציות לכפתורים
  const loginButtonScale = useRef(new Animated.Value(1)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isLoading) {
      Animated.timing(loadingOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const handleLoginPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(loginButtonScale, {
      toValue: 0.95,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleLoginPressOut = () => {
    Animated.spring(loginButtonScale, {
      toValue: 1,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
    if (!isLoading) {
      setTimeout(onLogin, 100);
    }
  };

  const handleBackPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(backButtonScale, {
      toValue: 0.95,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleBackPressOut = () => {
    Animated.spring(backButtonScale, {
      toValue: 1,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
    if (!isLoading) {
      setTimeout(onBack, 100);
    }
  };

  if (isLoading) {
    return (
      <Animated.View
        style={[styles.loadingContainer, { opacity: loadingOpacity }]}
      >
        <View style={styles.loadingInner}>
          <ActivityIndicator size="large" color={loginColors.primary} />
          <Text style={styles.loadingText}>מתחבר...</Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.actionsSection}>
      {/* כפתור התחברות */}
      <Animated.View
        style={[
          styles.buttonWrapper,
          { transform: [{ scale: loginButtonScale }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handleLoginPressIn}
          onPressOut={handleLoginPressOut}
          disabled={isLoading}
        >
          <LinearGradient
            colors={[loginColors.primary, loginColors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loginButton}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.loginButtonText}>התחבר</Text>
              <Ionicons name="arrow-forward" size={24} color="#fff" />
            </View>
            {/* Glow effect */}
            <View style={styles.buttonGlow} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* כפתור חזרה */}
      <Animated.View
        style={[
          styles.buttonWrapper,
          { transform: [{ scale: backButtonScale }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={handleBackPressIn}
          onPressOut={handleBackPressOut}
          disabled={isLoading}
          style={styles.backButton}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="arrow-back"
              size={22}
              color={loginColors.textSecondary}
            />
            <Text style={styles.backButtonText}>חזור</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    width: "100%",
    gap: isSmallDevice ? 12 : 16,
    marginTop: isSmallDevice ? 16 : 24,
  },
  buttonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
  },
  loginButton: {
    height: isSmallDevice ? 52 : 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonGlow: {
    position: "absolute",
    top: -40,
    left: "50%",
    width: 150,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 80,
    transform: [{ translateX: -75 }],
    opacity: 0.4,
  },
  backButton: {
    height: isSmallDevice ? 48 : 52,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginButtonText: {
    fontSize: isSmallDevice ? 16 : 17,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  backButtonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: loginColors.textSecondary,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: isSmallDevice ? 24 : 32,
  },
  loadingInner: {
    alignItems: "center",
    gap: 14,
  },
  loadingText: {
    color: loginColors.primary,
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default ActionButtons;
