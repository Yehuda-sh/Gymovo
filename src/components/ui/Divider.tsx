// src/components/ui/Divider.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { theme } from "../../theme";

type DividerVariant = "solid" | "dashed" | "dotted";
type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps {
  variant?: DividerVariant;
  orientation?: DividerOrientation;
  thickness?: number;
  color?: string;
  spacing?: number;
  label?: string;
  labelPosition?: "left" | "center" | "right";
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  variant = "solid",
  orientation = "horizontal",
  thickness = 1,
  color = theme.colors.border,
  spacing = theme.spacing.md,
  label,
  labelPosition = "center",
  style,
}) => {
  const isHorizontal = orientation === "horizontal";

  const dividerStyle: ViewStyle = {
    backgroundColor: variant === "solid" ? color : "transparent",
    [isHorizontal ? "height" : "width"]: thickness,
    [isHorizontal ? "marginVertical" : "marginHorizontal"]: spacing,
  };

  if (variant === "dashed") {
    dividerStyle.borderStyle = "dashed";
    dividerStyle[isHorizontal ? "borderTopWidth" : "borderLeftWidth"] =
      thickness;
    dividerStyle[isHorizontal ? "borderTopColor" : "borderLeftColor"] = color;
  } else if (variant === "dotted") {
    dividerStyle.borderStyle = "dotted";
    dividerStyle[isHorizontal ? "borderTopWidth" : "borderLeftWidth"] =
      thickness;
    dividerStyle[isHorizontal ? "borderTopColor" : "borderLeftColor"] = color;
  }

  if (!label) {
    return <View style={[dividerStyle, style]} />;
  }

  // עם תווית
  const containerStyle: ViewStyle = {
    flexDirection: isHorizontal ? "row" : "column",
    alignItems: "center",
    [isHorizontal ? "marginVertical" : "marginHorizontal"]: spacing,
  };

  const getFlexValues = () => {
    switch (labelPosition) {
      case "left":
        return { before: 0.2, after: 1 };
      case "right":
        return { before: 1, after: 0.2 };
      case "center":
      default:
        return { before: 1, after: 1 };
    }
  };

  const { before, after } = getFlexValues();

  return (
    <View style={[containerStyle, style]}>
      <View style={[dividerStyle, { flex: before, margin: 0 }]} />
      <Text style={styles.label}>{label}</Text>
      <View style={[dividerStyle, { flex: after, margin: 0 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    paddingHorizontal: theme.spacing.sm,
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});
