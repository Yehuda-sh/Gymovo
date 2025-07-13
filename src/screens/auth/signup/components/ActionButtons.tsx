// src/screens/auth/signup/components/ActionButtons.tsx

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps, signupColors } from "../types";

const colors = {
  primary: signupColors.primary,
  secondary: signupColors.secondary,
  textSecondary: signupColors.textSecondary,
};

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNext,
  onBack,
  isLoading = false,
}) => {
  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onNext();
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <View style={styles.buttonsSection}>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleNext}
        activeOpacity={0.8}
        disabled={isLoading}
        accessibilityLabel="המשך"
        accessibilityRole="button"
        accessibilityState={{ busy: isLoading, disabled: isLoading }}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isLoading ? (
            <ActivityIndicator
              size={Platform.OS === "ios" ? "small" : 18}
              color="#fff"
              style={{ paddingVertical: 2 }}
            />
          ) : (
            <Text style={styles.primaryButtonText}>המשך</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleBack}
        disabled={isLoading}
        accessibilityLabel="חזור"
        accessibilityRole="button"
        accessibilityState={{ disabled: isLoading }}
      >
        <Text style={styles.secondaryButtonText}>חזור</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsSection: {
    marginTop: 18,
    marginBottom: 8,
  },
  primaryButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 14,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default ActionButtons;
