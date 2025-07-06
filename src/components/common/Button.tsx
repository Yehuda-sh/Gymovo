// src/components/common/Button.tsx

import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";

type ButtonVariant = "primary" | "secondary" | "outline" | "success" | "danger";

type Props = {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  variant?: ButtonVariant;
  children?: React.ReactNode;
};

// רכיב כפתור גמיש עם מספר סגנונות (variants), תמיכה בטעינה, והשבתה
const Button = ({
  title,
  onPress,
  disabled,
  loading,
  style,
  variant = "primary",
  children,
}: Props) => {
  const buttonVariantStyle = styles[variant];
  const textVariantStyle = styles[`${variant}Text`];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonVariantStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textVariantStyle.color} />
      ) : (
        children || <Text style={[styles.text, textVariantStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    width: "100%",
  },
  text: { fontWeight: "bold", fontSize: 16, letterSpacing: 1 },
  disabled: { opacity: 0.5 },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: "#fff" },
  secondary: { backgroundColor: colors.secondary },
  secondaryText: { color: "#fff" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlineText: { color: colors.primary },
  success: { backgroundColor: "#27ae60" },
  successText: { color: "#fff" },
  danger: { backgroundColor: "#c0392b" },
  dangerText: { color: "#fff" },
});

export default Button;
