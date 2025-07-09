// src/screens/profile/user/styles/profileStyles.ts
// סטיילים עבור מסך פרופיל משתמש

import { StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingTop: 60,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 50,
  },
});
