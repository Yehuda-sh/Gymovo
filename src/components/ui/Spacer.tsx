// src/components/ui/Spacer.tsx
import React from "react";
import { View } from "react-native";
import { theme } from "../../theme";

type SpacingSize = keyof typeof theme.spacing;

interface SpacerProps {
  size?: SpacingSize;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = "md",
  horizontal = false,
}) => {
  const spacing = theme.spacing[size];

  return <View style={horizontal ? { width: spacing } : { height: spacing }} />;
};
