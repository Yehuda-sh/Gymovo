// src/screens/auth/signup/components/ActionButtons.tsx - עם isLoading תמיכה

import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Button from "../../../../components/common/Button";

// Props interface
interface ActionButtonsProps {
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onNext,
  onBack,
  isLoading = false,
}) => {
  return (
    <View style={styles.actionsSection}>
      {/* כפתור המשך ראשי - עם העיצוב החדש */}
      <Button
        title={isLoading ? "רושם..." : "המשך לשאלון"}
        onPress={onNext}
        variant="primary"
        size="large"
        icon={isLoading ? undefined : "arrow-back"} // RTL - חץ לשמאל
        iconPosition="left"
        disabled={isLoading}
        loading={isLoading}
        hapticFeedback="heavy"
        glowEffect={true}
        pulseAnimation={!isLoading}
        style={styles.nextButton}
      />

      {/* כפתור חזור משני */}
      <Button
        title="חזור"
        onPress={onBack}
        variant="outline"
        size="large"
        icon="chevron-forward" // RTL - חץ ימינה לחזור
        iconPosition="right"
        disabled={isLoading}
        hapticFeedback="light"
        glowEffect={false}
        style={styles.backButton}
      />

      {/* הודעת מצב בזמן טעינה */}
      {isLoading && (
        <Text style={styles.loadingMessage}>מעבד את הפרטים שלך... ⚡</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    width: "100%",
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  nextButton: {
    // הסגנון מגיע מרכיב Button
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  backButton: {
    // הסגנון מגיע מרכיב Button
    borderColor: "rgba(255, 255, 255, 0.4)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  loadingMessage: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
    letterSpacing: -0.2,
  },
});

export default ActionButtons;
