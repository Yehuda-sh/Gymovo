// src/components/ui/Badge.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme";

interface BadgeProps {
  label: string;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "primary",
  size = "md",
}) => {
  const variantColors = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantColors[variant],
          paddingHorizontal:
            size === "sm" ? theme.spacing.sm : theme.spacing.md,
          paddingVertical: size === "sm" ? theme.spacing.xs : theme.spacing.sm,
        },
      ]}
    >
      <Text style={[styles.text, size === "sm" && styles.smallText]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    ...theme.typography.caption,
    color: "#fff",
    fontWeight: "600",
  },
  smallText: {
    ...theme.typography.small,
  },
});
