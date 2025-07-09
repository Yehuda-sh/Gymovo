// src/screens/auth/welcome/components/GuestButton.tsx - כפתור כניסה כאורח

import React from "react";
import { StyleSheet } from "react-native";
import Button from "../../../../components/common/Button";
import { GuestButtonProps, welcomeColors } from "../types";

// כפתור כניסה כאורח עם עיצוב דיסקרטי
export const GuestButton: React.FC<GuestButtonProps> = ({ onGuestLogin }) => {
  return (
    <Button
      title="כניסה כאורח"
      onPress={onGuestLogin}
      variant="outline"
      style={styles.guestButton}
    />
  );
};

const styles = StyleSheet.create({
  guestButton: {
    height: 48,
    borderRadius: 12,
    borderColor: welcomeColors.guestButtonBorder,
    borderWidth: 1,
    backgroundColor: welcomeColors.guestButtonBackground,
    marginTop: 16,
  },
});

export default GuestButton;
