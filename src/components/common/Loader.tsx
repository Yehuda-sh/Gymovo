// src/components/common/Loader.tsx

import React from "react";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  variant?: "overlay" | "inline";
  size?: "small" | "large";
  style?: ViewStyle;
};

// רכיב טעינה גמיש, יכול להיות כיסוי מסך או רכיב פנימי
const Loader = ({ variant = "overlay", size = "large", style }: Props) => {
  if (variant === "inline") {
    return (
      <ActivityIndicator size={size} color={colors.primary} style={style} />
    );
  }

  return (
    <View style={[styles.overlayContainer, style]}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 10,
  },
});

export default Loader;
