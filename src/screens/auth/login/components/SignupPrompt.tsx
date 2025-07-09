// src/screens/auth/login/components/SignupPrompt.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../../theme/colors";
import { SignupPromptProps, loginColors } from "../types";

const SignupPrompt: React.FC<SignupPromptProps> = ({ onSignupPress }) => {
  return (
    <View style={styles.signupContainer}>
      <Text style={styles.signupText}>אין לך חשבון? </Text>
      <TouchableOpacity onPress={onSignupPress}>
        <Text style={styles.signupLink}>הירשם עכשיו</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    color: loginColors.signupText,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SignupPrompt;
