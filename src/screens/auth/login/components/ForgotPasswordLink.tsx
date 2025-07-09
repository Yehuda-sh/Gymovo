// src/screens/auth/login/components/ForgotPasswordLink.tsx

import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";

interface ForgotPasswordLinkProps {
  onPress?: () => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.forgotPassword} onPress={onPress}>
      <Text style={styles.forgotPasswordText}>שכחת סיסמה?</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default ForgotPasswordLink;
