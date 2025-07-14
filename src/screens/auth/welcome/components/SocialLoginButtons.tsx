// src/screens/auth/welcome/components/SocialLoginButtons.tsx - עם loading state

import React, { useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { rtlStyles } from "../../../../theme/rtl";
import * as Haptics from "expo-haptics";
import { SocialLoginButtonsProps } from "../types";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 700;

// Theme colors
const socialColors = {
  primary: "#FF6B35",
  accent: "#FFD23F",
  google: {
    light: "#4285F4",
    dark: "#1a73e8",
  },
  apple: {
    light: "#000000",
    dark: "#000000",
  },
  facebook: {
    light: "#1877f2",
    dark: "#1465d8",
  },
  divider: "rgba(255, 255, 255, 0.2)",
  dividerText: "rgba(255, 255, 255, 0.5)",
};

// Animation configuration
const ANIMATION_CONFIG = {
  tension: 300,
  friction: 10,
  pressScale: 0.95,
  pressDelay: 100,
  useNativeDriver: true,
};

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = memo(
  ({ onGoogleLogin, onAppleLogin, fadeAnim, loading = false }) => {
    const googleScale = useRef(new Animated.Value(1)).current;
    const appleScale = useRef(new Animated.Value(1)).current;
    const loadingOpacity = useRef(new Animated.Value(0)).current;

    // Loading animation
    React.useEffect(() => {
      Animated.timing(loadingOpacity, {
        toValue: loading ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [loading, loadingOpacity]);

    // Generic button press animation
    const animateButtonPress = useCallback(
      (scale: Animated.Value, onComplete: () => void) => {
        if (loading) return;

        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Press in
        Animated.spring(scale, {
          toValue: ANIMATION_CONFIG.pressScale,
          tension: ANIMATION_CONFIG.tension,
          friction: ANIMATION_CONFIG.friction,
          useNativeDriver: ANIMATION_CONFIG.useNativeDriver,
        }).start();

        // Press out
        setTimeout(() => {
          Animated.spring(scale, {
            toValue: 1,
            tension: ANIMATION_CONFIG.tension,
            friction: ANIMATION_CONFIG.friction,
            useNativeDriver: ANIMATION_CONFIG.useNativeDriver,
          }).start();

          // Trigger callback
          setTimeout(onComplete, ANIMATION_CONFIG.pressDelay);
        }, 150);
      },
      [loading]
    );

    // Google button handlers
    const handleGooglePress = useCallback(() => {
      animateButtonPress(googleScale, onGoogleLogin);
    }, [animateButtonPress, googleScale, onGoogleLogin]);

    // Apple button handlers
    const handleApplePress = useCallback(() => {
      animateButtonPress(appleScale, onAppleLogin);
    }, [animateButtonPress, appleScale, onAppleLogin]);

    // Button renderer
    const renderSocialButton = useCallback(
      (
        platform: "google" | "apple",
        scale: Animated.Value,
        onPress: () => void,
        colors: { light: string; dark: string }
      ) => {
        const iconName = platform === "google" ? "logo-google" : "logo-apple";
        const buttonText = platform === "google" ? "Google" : "Apple";

        return (
          <Animated.View
            style={[
              styles.buttonWrapper,
              { transform: [{ scale }] },
              Platform.OS !== "ios" && platform === "apple" && styles.hideApple,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.socialButton,
                { backgroundColor: colors.light },
                loading && styles.disabledButton,
              ]}
              onPress={onPress}
              activeOpacity={0.8}
              disabled={loading}
              accessible={true}
              accessibilityLabel={`התחבר עם ${buttonText}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: loading }}
            >
              <View style={styles.buttonContent}>
                {loading ? (
                  <Animated.View style={{ opacity: loadingOpacity }}>
                    <ActivityIndicator size="small" color="#fff" />
                  </Animated.View>
                ) : (
                  <>
                    <Ionicons
                      name={iconName as any}
                      size={isSmallDevice ? 16 : 18}
                      color="#fff"
                    />
                    <Text
                      style={[
                        styles.socialButtonText,
                        isSmallDevice && styles.smallText,
                      ]}
                      numberOfLines={1}
                    >
                      {buttonText}
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      },
      [loading, loadingOpacity, isSmallDevice]
    );

    // Show only Google button on Android
    const showAppleButton = Platform.OS === "ios";

    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* קו מפריד עם "או" */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={[styles.dividerText, rtlStyles.text]}>או התחבר עם</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* כפתורי התחברות */}
        <View
          style={[
            styles.socialButtonsRow,
            !showAppleButton && styles.singleButtonRow,
          ]}
        >
          {/* כפתור Google */}
          {renderSocialButton(
            "google",
            googleScale,
            handleGooglePress,
            socialColors.google
          )}

          {/* כפתור Apple - רק ב-iOS */}
          {showAppleButton &&
            renderSocialButton(
              "apple",
              appleScale,
              handleApplePress,
              socialColors.apple
            )}
        </View>

        {/* Privacy notice */}
        <Text style={styles.privacyText}>
          ההתחברות מאובטחת ולא נשתף את המידע שלך
        </Text>
      </Animated.View>
    );
  }
);

SocialLoginButtons.displayName = "SocialLoginButtons";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: isSmallDevice ? 12 : 16,
    width: "100%",
  },

  // Divider styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: isSmallDevice ? 12 : 16,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: socialColors.divider,
  },
  dividerText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: socialColors.dividerText,
    fontWeight: "500",
  },

  // Button row
  socialButtonsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  singleButtonRow: {
    maxWidth: 200,
    alignSelf: "center",
  },

  // Button styles
  buttonWrapper: {
    flex: 1,
    height: isSmallDevice ? 42 : 44,
    maxWidth: 180,
  },
  hideApple: {
    display: "none",
  },
  socialButton: {
    flex: 1,
    borderRadius: isSmallDevice ? 8 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    height: "100%",
    overflow: "hidden",
  },
  buttonContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: 14,
    gap: isSmallDevice ? 4 : 6,
  },
  socialButtonText: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  smallText: {
    fontSize: 11,
  },
  disabledButton: {
    opacity: 0.7,
  },

  // Privacy text
  privacyText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    marginTop: isSmallDevice ? 8 : 12,
  },
});

// Export both named and default
export { SocialLoginButtons as default };
