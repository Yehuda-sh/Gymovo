// src/components/ui/Typography.tsx
import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { theme } from "../../theme";

type TypographyVariant = keyof typeof theme.typography;

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  color = theme.colors.text,
  align = "left",
  style,
  children,
  ...props
}) => {
  return (
    <Text
      style={[theme.typography[variant], { color, textAlign: align }, style]}
      {...props}
    >
      {children}
    </Text>
  );
};
