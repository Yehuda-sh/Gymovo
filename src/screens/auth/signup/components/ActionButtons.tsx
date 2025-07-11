// src/screens/auth/signup/components/ActionButtons.tsx
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { ActionButtonsProps } from "../types";

const colors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  textSecondary: "rgba(255, 255, 255, 0.85)",
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
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.gradientButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.primaryButtonText}>המשך</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
        <Text style={styles.secondaryButtonText}>חזור</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsSection: {
    marginTop: 10,
  },
  primaryButton: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default ActionButtons;
