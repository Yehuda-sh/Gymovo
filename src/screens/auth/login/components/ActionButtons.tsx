// src/screens/auth/login/components/ActionButtons.tsx - כפתורים בהשראת Welcome

import React, { useRef } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps } from "../types";
import { loginColors } from "../styles/loginStyles";

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
    gap: 16,
    marginTop: 32,
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  loginButton: {
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonGlow: {
    position: "absolute",
    top: -50,
    left: "50%",
    width: 200,
    height: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 100,
    transform: [{ translateX: -100 }],
    opacity: 0.5,
  },
  backButton: {
    height: 56,
    borderRadius: 16,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: loginColors.textSecondary,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingInner: {
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: loginColors.primary,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});

export default ActionButtons;
