// src/screens/profile/GuestProfileScreen.tsx
// מסך המוצג בטאב "פרופיל" עבור משתמשים אורחים

import React from "react";
import { View } from "react-native";
import {
  GuestProfileIcon,
  GuestProfileContent,
  GuestProfileActions,
  useGuestProfileNavigation,
} from "./guest";
import { guestProfileStyles } from "./guest/styles";

const GuestProfileScreen: React.FC = () => {
  const { navigateToSignup } = useGuestProfileNavigation();

  return (
    <View style={guestProfileStyles.container}>
      <GuestProfileIcon />
      <GuestProfileContent />
      <GuestProfileActions onSignupPress={navigateToSignup} />
    </View>
  );
};

export default GuestProfileScreen;
