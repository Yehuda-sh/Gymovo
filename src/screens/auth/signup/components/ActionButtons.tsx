// src/screens/auth/signup/components/ActionButtons.tsx

import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../../../../components/common/Button";
import { colors } from "../../../../theme/colors";
import { ActionButtonsProps } from "../types";

const ActionButtons: React.FC<ActionButtonsProps> = ({ onNext, onBack }) => {
  return (
    <View style={styles.actionsSection}>
      <Button
        title="המשך לשאלון"
        onPress={onNext}
        variant="primary"
        style={styles.nextButton}
      />
      <Button
        title="חזור"
        onPress={onBack}
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
  nextButton: {
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
