// src/screens/auth/welcome/components/GuestButton.tsx - גרסה קומפקטית

import React, { useRef, useCallback, memo, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { GuestButtonProps } from "../types";

const { width, height } = Dimensions.get("window");
const isSmallDevice = height < 700;
const isTinyDevice = height < 600;

// Theme colors
const guestButtonColors = {
  text: "#94A3B8",
  textLight: "#CBD5E1",
  icon: "#64748B",
  background: "rgba(100, 116, 139, 0.1)",
  backgroundHover: "rgba(100, 116, 139, 0.15)",
  border: "rgba(100, 116, 139, 0.3)",
  borderHover: "rgba(100, 116, 139, 0.4)",
  iconBackground: "rgba(100, 116, 139, 0.1)",
};

// Animation config
const ANIMATION_CONFIG = {
  entrance: {
    duration: 800,
    delay: 600,
  },
  press: {
    scale: 0.95,
    speed: 20,
    bounciness: 5,
  },
  hover: {
    duration: 200,
  },
};

export const GuestButton: React.FC<GuestButtonProps> = memo(
  ({ onGuestLogin, loading = false, disabled = false }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Entrance animation
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.entrance.duration,
        delay: ANIMATION_CONFIG.entrance.delay,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    // Pulse animation
    useEffect(() => {
      if (!disabled && !loading) {
        const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.02,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        );
        pulseAnimation.start();

        return () => {
          pulseAnimation.stop();
        };
      }
    }, [disabled, loading, pulseAnim]);

    const handlePressIn = useCallback(() => {
      if (loading || disabled) return;

      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      Animated.spring(scaleAnim, {
        toValue: ANIMATION_CONFIG.press.scale,
        speed: ANIMATION_CONFIG.press.speed,
        bounciness: ANIMATION_CONFIG.press.bounciness,
        useNativeDriver: true,
      }).start();
    }, [loading, disabled, scaleAnim]);

    const handlePressOut = useCallback(() => {
      if (loading || disabled) return;

      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: ANIMATION_CONFIG.press.speed,
        bounciness: ANIMATION_CONFIG.press.bounciness,
        useNativeDriver: true,
      }).start();

      setTimeout(() => onGuestLogin(), 100);
    }, [loading, disabled, scaleAnim, onGuestLogin]);

    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            (loading || disabled) && styles.buttonDisabled,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={loading || disabled}
          accessible={true}
          accessibilityLabel="כניסה כאורח"
          accessibilityHint="התחל להשתמש באפליקציה ללא צורך בהרשמה"
          accessibilityRole="button"
          accessibilityState={{
            disabled: loading || disabled,
            busy: loading,
          }}
        >
          <View style={styles.contentContainer}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                (loading || disabled) && styles.iconContainerDisabled,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={isTinyDevice ? 14 : 16}
                color={
                  loading || disabled
                    ? guestButtonColors.textLight
                    : guestButtonColors.icon
                }
              />
            </View>

            {/* Text */}
            <Text
              style={[
                styles.text,
                (loading || disabled) && styles.textDisabled,
              ]}
            >
              {loading ? "רגע אחד..." : "כניסה מהירה ללא הרשמה"}
            </Text>

            {/* Arrow */}
            {!loading && (
              <Ionicons
                name="arrow-forward-outline"
                size={isTinyDevice ? 14 : 16}
                color={
                  loading || disabled
                    ? guestButtonColors.textLight
                    : guestButtonColors.icon
                }
              />
            )}
          </View>

          {/* Info text */}
          {!loading && !disabled && (
            <Text style={styles.infoText}>נתונים נשמרים עד 30 יום</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

GuestButton.displayName = "GuestButton";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: isTinyDevice ? 16 : isSmallDevice ? 20 : 30,
    alignSelf: "center",
    width: width - 48,
    maxWidth: 320,
  },
  button: {
    borderRadius: isTinyDevice ? 20 : 24,
    backgroundColor: guestButtonColors.background,
    borderWidth: 1,
    borderColor: guestButtonColors.border,
    paddingVertical: isTinyDevice ? 8 : 10,
    paddingHorizontal: isTinyDevice ? 14 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: guestButtonColors.backgroundHover,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: isTinyDevice ? 6 : 8,
  },
  iconContainer: {
    width: isTinyDevice ? 22 : 24,
    height: isTinyDevice ? 22 : 24,
    borderRadius: isTinyDevice ? 11 : 12,
    backgroundColor: guestButtonColors.iconBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerDisabled: {
    backgroundColor: "rgba(100, 116, 139, 0.05)",
  },
  text: {
    fontSize: isTinyDevice ? 13 : 14,
    color: guestButtonColors.text,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  textDisabled: {
    color: guestButtonColors.textLight,
  },
  infoText: {
    fontSize: 11,
    color: guestButtonColors.textLight,
    textAlign: "center",
    marginTop: 4,
    opacity: 0.8,
  },
});

export default GuestButton;
