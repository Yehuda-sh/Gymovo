// src/screens/profile/guest/hooks/useGuestProfileNavigation.ts
// Hook לניהול ניווט עבור מסך פרופיל אורח

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";
import { GuestProfileNavigationHook } from "../types";

export const useGuestProfileNavigation = (): GuestProfileNavigationHook => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const navigateToSignup = () => {
    navigation.navigate("Signup");
  };

  return {
    navigateToSignup,
  };
};
