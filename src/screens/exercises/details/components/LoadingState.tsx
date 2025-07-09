// src/screens/exercises/details/components/LoadingState.tsx
// רכיב מצב טעינה

import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { LoadingStateProps } from "../types";

const LoadingState: React.FC<LoadingStateProps> = ({
  loadingText = "טוען פרטי תרגיל...",
}) => {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{loadingText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default LoadingState;
