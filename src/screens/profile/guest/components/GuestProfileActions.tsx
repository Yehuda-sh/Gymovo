// src/screens/profile/guest/components/GuestProfileActions.tsx
// רכיב הכפתורים עבור מסך פרופיל אורח

import React from "react";
import { StyleSheet } from "react-native";
import Button from "../../../../components/common/Button";
import { GuestProfileActionsProps } from "../types";

const GuestProfileActions: React.FC<GuestProfileActionsProps> = ({
  onSignupPress,
  buttonTitle = "צור חשבון עכשיו",
}) => {
  return (
    <Button
      title={buttonTitle}
      onPress={onSignupPress}
      variant="primary"
      style={styles.signupButton}
    />
  );
};

const styles = StyleSheet.create({
  signupButton: {
    marginTop: 20,
  },
});

export default GuestProfileActions;
