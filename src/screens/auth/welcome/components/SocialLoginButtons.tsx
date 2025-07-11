// src/screens/auth/welcome/components/SocialLoginButtons.tsx - התחברות מהירה

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rtlStyles } from "../../../../theme/rtl";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const newColors = {
  primary: "#FF6B35",
  accent: "#FFD23F",
  google: "#4285F4",
  apple: "#000000",
};

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  fadeAnim: any;
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onAppleLogin,
  fadeAnim,
}) => {
  const googleScale = useRef(new Animated.Value(1)).current;
  const appleScale = useRef(new Animated.Value(1)).current;

  // Google Touch Feedback
  const handleGooglePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(googleScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleGooglePressOut = () => {
    Animated.spring(googleScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onGoogleLogin(), 100);
  };

  // Apple Touch Feedback
  const handleApplePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(appleScale, {
      toValue: 0.95,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleApplePressOut = () => {
    Animated.spring(appleScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
    setTimeout(() => onAppleLogin(), 100);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* קו מפריד עם "או" */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={[styles.dividerText, rtlStyles.text]}>או</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* כפתורי התחברות - קומפקטיים יותר */}
      <View style={styles.socialButtonsRow}>
        {/* כפתור Google */}
        <Animated.View
          style={[
            styles.buttonWrapper,
            { transform: [{ scale: googleScale }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPressIn={handleGooglePressIn}
            onPressOut={handleGooglePressOut}
            activeOpacity={1}
          >
            <Ionicons name="logo-google" size={18} color="#fff" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* כפתור Apple */}
        <Animated.View
          style={[styles.buttonWrapper, { transform: [{ scale: appleScale }] }]}
        >
          <TouchableOpacity
            style={[styles.socialButton, styles.appleButton]}
            onPressIn={handleApplePressIn}
            onPressOut={handleApplePressOut}
            activeOpacity={1}
          >
            <Ionicons name="logo-apple" size={18} color="#fff" />
            <Text style={styles.socialButtonText}>Apple</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    width: "100%",
  },
  // קו מפריד
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
  socialButtonsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonWrapper: {
    flex: 1,
    height: 44, // קטן יותר
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12, // קטן יותר
    paddingHorizontal: 14,
    borderRadius: 10, // פחות מעוגל
    gap: 6, // פחות רווח
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    height: 44, // גובה קטן יותר
  },
  googleButton: {
    backgroundColor: newColors.google,
  },
  appleButton: {
    backgroundColor: newColors.apple,
  },
  socialButtonText: {
    fontSize: 13, // קטן יותר
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});

export default SocialLoginButtons;
