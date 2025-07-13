// src/screens/auth/login/components/ForgotPasswordLink.tsx - גרסה קומפקטית

import React from "react";
import { Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { loginColors } from "../styles/loginStyles";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>שכחתי סיסמה</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginTop: isSmallDevice ? -8 : -10,
    marginBottom: isSmallDevice ? 8 : 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: {
    fontSize: isSmallDevice ? 13 : 14,
    color: loginColors.textSecondary,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});

export default ForgotPasswordLink;
