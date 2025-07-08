// src/components/ui/Divider.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../theme";

interface DividerProps {
  color?: string;
  thickness?: number;
  spacing?: keyof typeof theme.spacing;
}

export const Divider: React.FC<DividerProps> = ({
  color = theme.colors.border,
  thickness = 1,
  spacing = "md",
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical: theme.spacing[spacing],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "100%",
  },
});
