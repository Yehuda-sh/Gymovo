// src/screens/auth/welcome/components/ActionButtonsSection.tsx - סקציה מלאה

import React from "react";
import { View, StyleSheet } from "react-native";
import { ActionButtonsProps } from "../types";
import SocialLoginButtons from "./SocialLoginButtons";
import ActionButtons from "./ActionButtons";

interface ActionButtonsSectionProps extends ActionButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
}

export const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = ({
  onSignup,
  onLogin,
  onGoogleLogin,
  onAppleLogin,
  buttonsSlide,
  fadeAnim,
}) => {
  return (
    <View style={styles.container}>
      {/* כפתורי התחברות חברתית */}
      <SocialLoginButtons
        onGoogleLogin={onGoogleLogin}
        onAppleLogin={onAppleLogin}
        fadeAnim={fadeAnim}
      />

      {/* כפתורי הרשמה רגילים */}
      <ActionButtons
        onSignup={onSignup}
        onLogin={onLogin}
        buttonsSlide={buttonsSlide}
        fadeAnim={fadeAnim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default ActionButtonsSection;
