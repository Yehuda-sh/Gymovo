// src/screens/auth/signup/components/LoginPrompt.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../theme/colors";
import { LoginPromptProps, signupColors } from "../types";

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginPress }) => {
  return (
    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>יש לך כבר חשבון? </Text>
      <TouchableOpacity onPress={onLoginPress}>
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
    marginTop: 16,
  },
  loginText: {
    color: signupColors.loginText,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default LoginPrompt;
