// src/screens/auth/login/components/ActionButtons.tsx - עם Button מתקדם

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "../../../../components/common/Button";
import { ActionButtonsProps } from "../types";

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isLoading,
  onLogin,
  onBack,
}) => {
  // אם טוען - נציג הודעת טעינה מיוחדת
  if (isLoading) {
    return (
      <View style={styles.actionsSection}>
        <Button
          title="מתחבר..."
          onPress={() => {}} // לא פעיל
          variant="primary"
          size="large"
          loading={true}
          disabled={true}
          hapticFeedback="none"
          glowEffect={false}
          style={styles.loadingButton}
        />

        <Text style={styles.loadingMessage}>מאמת את הפרטים שלך... 🔐</Text>
      </View>
    );
  }

  return (
    <View style={styles.actionsSection}>
      {/* כפתור התחברות ראשי */}
      <Button
        title="התחבר"
        onPress={onLogin}
        variant="primary"
        size="large"
        icon="log-in-outline"
        iconPosition="left"
        hapticFeedback="medium"
        glowEffect={true}
        pulseAnimation={true}
        style={styles.loginButton}
      />

      {/* כפתור חזור */}
      <Button
        title="חזור"
        onPress={onBack}
        variant="outline"
        size="large"
        icon="chevron-forward" // RTL
        iconPosition="right"
        hapticFeedback="light"
        glowEffect={false}
        style={styles.backButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    width: "100%",
    gap: 16,
    paddingVertical: 8,
  },
  loginButton: {
    marginBottom: 4,
  },
  backButton: {
    // העיצוב מגיע מהרכיב Button
  },
  loadingButton: {
    marginBottom: 16,
  },
  loadingMessage: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: -0.3,
  },
});

export default ActionButtons;
