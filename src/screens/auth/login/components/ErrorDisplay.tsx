// src/screens/auth/login/components/ErrorDisplay.tsx - מעוצב לרקע גרדיאנט

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { ErrorDisplayProps } from "../types";

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (error) {
      // Haptic feedback when error appears
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // Animate in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          speed: 14,
          bounciness: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          speed: 14,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  if (!error) return null;

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onDismiss) onDismiss();
  };

  return (
    <Animated.View
      style={[
        styles.errorWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <BlurView intensity={20} style={styles.errorBlur}>
        <LinearGradient
          colors={["rgba(255,51,102,0.15)", "rgba(255,82,82,0.1)"]}
          style={styles.errorGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.errorContainer}>
            {/* Icon with glow effect */}
            <View style={styles.iconContainer}>
              <View style={styles.iconGlow} />
              <Ionicons name="alert-circle" size={24} color="#ff3366" />
            </View>

            {/* Error text */}
            <Text style={styles.errorText}>{error}</Text>

            {/* Dismiss button */}
            {onDismiss && (
              <TouchableOpacity
                onPress={handleDismiss}
                style={styles.dismissButton}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                  style={styles.dismissGradient}
                >
                  <Ionicons name="close" size={18} color="#ff3366" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </BlurView>

      {/* Border gradient */}
      <View style={styles.borderContainer}>
        <LinearGradient
          colors={["#ff3366", "#ff5252"]}
          style={styles.borderGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorWrapper: {
    marginBottom: 16,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#ff3366",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  errorBlur: {
    borderRadius: 14,
  },
  errorGradient: {
    borderRadius: 14,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    position: "relative",
    marginLeft: 12,
  },
  iconGlow: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff3366",
    opacity: 0.2,
    top: -8,
    left: -8,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
    textAlign: "right",
    lineHeight: 22,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  dismissButton: {
    marginRight: 4,
  },
  dismissGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  borderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    padding: 1,
  },
  borderGradient: {
    flex: 1,
    borderRadius: 14,
    opacity: 0.3,
  },
});

export default ErrorDisplay;
