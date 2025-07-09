// src/screens/auth/welcome/components/ActionButtons.tsx - כפתורי הפעולה הראשיים

import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import Button from "../../../../components/common/Button";
import { ActionButtonsProps, welcomeColors } from "../types";

// כפתורי הפעולה הראשיים עם אנימציות כניסה חלקות
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSignup,
  onLogin,
  buttonsSlide,
  fadeAnim,
}) => {
  return (
    <Animated.View
      style={[
        styles.buttonsSection,
        {
          transform: [{ translateY: buttonsSlide }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.primaryActions}>
        <Button
          title="התחל עכשיו"
          onPress={onSignup}
          variant="primary"
          style={styles.primaryButton}
        />

        <Button
          title="יש לי חשבון"
          onPress={onLogin}
          variant="secondary"
          style={styles.secondaryButton}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonsSection: {
    paddingTop: 32,
  },
  primaryActions: {
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: welcomeColors.primary,
    shadowColor: welcomeColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    borderColor: welcomeColors.primary,
    borderWidth: 2,
  },
});

export default ActionButtons;
