// src/screens/auth/login/components/SignupPrompt.tsx - בהשראת Welcome

import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { SignupPromptProps } from "../types";
import { loginColors } from "../styles/loginStyles";

const SignupPrompt: React.FC<SignupPromptProps> = ({ onSignupPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSignupPress();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.divider} />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>עדיין אין לך חשבון?</Text>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.7}
          style={styles.signupLinkTouchable}
        >
          <Text style={styles.signupLink}>הרשם עכשיו</Text>
          <Ionicons
            name="arrow-forward-circle-outline"
            size={18}
            color={loginColors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* קישוט תחתון */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorationDot} />
        <View style={[styles.decorationDot, styles.decorationDotCenter]} />
        <View style={styles.decorationDot} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 20,
  },
  divider: {
    width: 80,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  signupText: {
    color: loginColors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },
  signupLinkTouchable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  signupLink: {
    color: loginColors.primary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  bottomDecoration: {
    flexDirection: "row",
    gap: 8,
    marginTop: 32,
  },
  decorationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  decorationDotCenter: {
    backgroundColor: loginColors.primary,
    opacity: 0.6,
  },
});

export default SignupPrompt;
