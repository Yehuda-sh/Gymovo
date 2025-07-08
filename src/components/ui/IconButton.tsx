// src/components/ui/IconButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../theme";

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "filled" | "outline";
  color?: string;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = "md",
  variant = "ghost",
  color = theme.colors.primary,
  disabled = false,
}) => {
  const sizes = {
    sm: 32,
    md: 44,
    lg: 56,
  };

  const buttonSize = sizes[size];

  const variantStyles = {
    ghost: {
      backgroundColor: "transparent",
    },
    filled: {
      backgroundColor: color,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: color,
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
        },
        variantStyles[variant],
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
