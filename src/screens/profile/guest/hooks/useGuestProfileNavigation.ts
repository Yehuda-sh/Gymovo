// src/screens/profile/guest/hooks/useGuestProfileNavigation.ts
// Hook לניהול ניווט עבור מסך פרופיל אורח

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";

export const useGuestProfileNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToConvertGuest = () => {
    navigation.navigate("ConvertGuest");
  };

  const navigateToSignup = () => {
    navigation.navigate("Signup");
  };

  const navigateToSettings = () => {
    navigation.navigate("Settings");
  };

  return {
    navigateToConvertGuest,
    navigateToSignup,
    navigateToSettings,
  };
};
