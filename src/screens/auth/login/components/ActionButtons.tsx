// src/screens/auth/login/components/ActionButtons.tsx

import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../../../components/common/Button";
import { colors } from "../../../../theme/colors";
import { ActionButtonsProps } from "../types";

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  onLogin,
  onBack,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>מתחבר...</Text>
      </View>
    );
  }

  return (
    <View style={styles.actionsSection}>
      <Button
        title="התחבר"
        onPress={onLogin}
        disabled={isLoading}
        variant="primary"
        style={styles.loginButton}
      />
      <Button
        title="חזור"
        onPress={onBack}
        disabled={isLoading}
        variant="outline"
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    width: "100%",
    gap: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    color: colors.primary,
    fontSize: 16,
    marginTop: 12,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 18,
  },
});

export default ActionButtons;
