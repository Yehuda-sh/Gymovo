// src/screens/auth/welcome/components/ActionButtonsSection.tsx - סקציה מלאה

import React, { memo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ActionButtonsProps } from "../types";
import SocialLoginButtons from "./SocialLoginButtons";
import ActionButtons from "./ActionButtons";

const { height } = Dimensions.get("window");
const isSmallDevice = height < 700;

interface ActionButtonsSectionProps extends ActionButtonsProps {
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  loading?: boolean;
  socialLoginFirst?: boolean;
}

export const ActionButtonsSection: React.FC<ActionButtonsSectionProps> = memo(
  ({
    onSignup,
    onLogin,
    onGoogleLogin,
    onAppleLogin,
    buttonsSlide,
    fadeAnim,
    loading = false,
    socialLoginFirst = true,
  }) => {
    // רכיבי הכפתורים
    const socialButtons = (
      <SocialLoginButtons
        onGoogleLogin={onGoogleLogin}
        onAppleLogin={onAppleLogin}
        fadeAnim={fadeAnim}
        loading={loading}
      />
    );

    const actionButtons = (
      <ActionButtons
        onSignup={onSignup}
        onLogin={onLogin}
        buttonsSlide={buttonsSlide}
        fadeAnim={fadeAnim}
      />
    );

    return (
      <View style={styles.container}>
        {/* סדר הכפתורים לפי הגדרה */}
        {socialLoginFirst ? (
          <>
            {socialButtons}
            <View style={styles.spacing} />
            {actionButtons}
          </>
        ) : (
          <>
            {actionButtons}
            <View style={styles.spacing} />
            {socialButtons}
          </>
        )}
      </View>
    );
  }
);

ActionButtonsSection.displayName = "ActionButtonsSection";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: isSmallDevice ? 8 : 12,
  },
  spacing: {
    height: isSmallDevice ? 12 : 16,
  },
});

export default ActionButtonsSection;
