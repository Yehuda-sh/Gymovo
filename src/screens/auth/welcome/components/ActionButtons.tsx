// src/screens/auth/welcome/components/ActionButtons.tsx - כפתורים משופרים בסגנון ProfileScreen

import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps, welcomeColors } from "../types";

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSignup,
  onLogin,
  buttonsSlide,
  fadeAnim,
}) => {
  // אנימציות לחיצה
  const primaryScale = useRef(new Animated.Value(1)).current;
  const secondaryScale = useRef(new Animated.Value(1)).current;

  const handlePrimaryPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(primaryScale, {
      toValue: 0.95,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePrimaryPressOut = () => {
    Animated.spring(primaryScale, {
      toValue: 1,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  const handleSecondaryPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(secondaryScale, {
      toValue: 0.95,
      speed: 20,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleSecondaryPressOut = () => {
    Animated.spring(secondaryScale, {
      toValue: 1,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.buttonsSection,
        {
          transform: [{ translateY: buttonsSlide }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.primaryActions}>
        {/* כפתור ראשי */}
        <Animated.View
          style={[
            styles.primaryButtonWrapper,
            {
              transform: [{ scale: primaryScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onSignup}
            onPressIn={handlePrimaryPressIn}
            onPressOut={handlePrimaryPressOut}
            activeOpacity={1}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>התחל עכשיו</Text>
              <View style={styles.iconWrapper}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* כפתור משני */}
        <Animated.View
          style={[
            styles.secondaryButtonWrapper,
            {
              transform: [{ scale: secondaryScale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onLogin}
            onPressIn={handleSecondaryPressIn}
            onPressOut={handleSecondaryPressOut}
            activeOpacity={1}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
              style={styles.secondaryGradient}
            >
              <Text style={styles.secondaryButtonText}>יש לי חשבון</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonsSection: {
    paddingTop: 32,
  },
  primaryActions: {
    gap: 12,
  },
  primaryButtonWrapper: {
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 10,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonWrapper: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  secondaryGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: "rgba(102,126,234,0.5)",
    borderRadius: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.3,
  },
});

export default ActionButtons;
