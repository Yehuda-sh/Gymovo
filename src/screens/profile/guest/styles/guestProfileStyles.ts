// src/screens/profile/guest/styles/guestProfileStyles.ts
// סטיילים עבור מסך פרופיל אורח

import { StyleSheet } from "react-native";
import { colors } from "../../../theme/colors";

export const guestProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: colors.background || "#f5f5f5",
  },
});
