// src/screens/auth/signup/components/ErrorDisplay.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";
import { ErrorDisplayProps, signupColors } from "../types";

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  if (!error) return null;

  return (
    <Animated.View style={styles.errorContainer}>
      <Ionicons name="warning" size={20} color={colors.danger} />
      <Text style={styles.errorText}>{error}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Ionicons name="close" size={16} color={colors.danger} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: signupColors.errorBackground,
    borderColor: signupColors.errorBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    textAlign: "right",
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default ErrorDisplay;
