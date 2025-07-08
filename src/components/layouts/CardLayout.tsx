// src/components/layouts/CardLayout.tsx
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../theme";

interface CardLayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: keyof typeof theme.shadows;
}

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  style,
  shadow = "sm",
}) => {
  return (
    <View style={[styles.card, theme.shadows[shadow], style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
});
