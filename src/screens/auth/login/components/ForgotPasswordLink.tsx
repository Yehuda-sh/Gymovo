// src/screens/auth/login/components/ForgotPasswordLink.tsx - מעוצב לרקע גרדיאנט

import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface ForgotPasswordLinkProps {
  onPress?: () => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0.7)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        speed: 20,
        bounciness: 10,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 20,
        bounciness: 10,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      style={styles.forgotPasswordContainer}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.forgotPasswordButton,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconGlow} />
          <Ionicons name="key-outline" size={16} color="#667eea" />
        </View>
        <Text style={styles.forgotPasswordText}>שכחת סיסמה?</Text>
        <View style={styles.underline} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.05)",
  },
  iconContainer: {
    position: "relative",
    marginLeft: 8,
  },
  iconGlow: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#667eea",
    opacity: 0.15,
    top: -4,
    left: -4,
  },
  forgotPasswordText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  underline: {
    position: "absolute",
    bottom: 6,
    left: 12,
    right: 36,
    height: 1,
    backgroundColor: "#667eea",
    opacity: 0.3,
  },
});

export default ForgotPasswordLink;
