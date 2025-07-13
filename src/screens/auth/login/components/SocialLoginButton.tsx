// src/screens/auth/login/components/SocialLoginButton.tsx - כפתור Google

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

interface SocialLoginButtonProps {
  onGoogleLogin: () => void;
  fadeAnim: any;
  loading?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  onGoogleLogin,
  fadeAnim,
  loading = false,
}) => {
  const googleScale = useRef(new Animated.Value(1)).current;

  // Google Touch Feedback
  const handleGooglePressIn = () => {
    if (loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(googleScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleGooglePressOut = () => {
    if (loading) return;
    Animated.spring(googleScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onGoogleLogin(), 100);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {/* קו מפריד */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>או</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* כפתור Google */}
      <Animated.View
        style={[
          styles.buttonWrapper,
          {
            transform: [{ scale: googleScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.socialButton, loading && styles.disabledButton]}
          onPressIn={handleGooglePressIn}
          onPressOut={handleGooglePressOut}
          activeOpacity={1}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Google</Text>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: isSmallDevice ? 12 : 16,
  },
  // קו מפריד
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: isSmallDevice ? 12 : 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  dividerText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  buttonWrapper: {
    width: "100%",
    height: isSmallDevice ? 48 : 52,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4285F4",
    borderRadius: 14,
    gap: 8,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  socialButtonText: {
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default SocialLoginButton;
