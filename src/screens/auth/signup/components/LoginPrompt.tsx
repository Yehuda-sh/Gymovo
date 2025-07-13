// src/screens/auth/signup/components/LoginPrompt.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { signupColors } from "../types";
import { LoginPromptProps } from "../types";

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginPress }) => {
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>יש לך כבר חשבון? </Text>
      <TouchableOpacity
        onPress={onLoginPress}
        accessibilityRole="link"
        accessibilityLabel="התחבר כאן"
        style={styles.loginLinkTouchable}
      >
        <Text style={styles.loginLink}>התחבר כאן</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  loginText: {
    color: signupColors.loginText,
    fontSize: 14,
  },
  loginLink: {
    color: signupColors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  loginLinkTouchable: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});

export default LoginPrompt;
