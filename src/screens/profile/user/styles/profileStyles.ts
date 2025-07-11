// src/screens/profile/user/styles/profileStyles.ts
// סטיילים עבור מסך פרופיל משתמש - קומפקטי ומהיר

import { StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 15,
  },
  errorText: {
    fontSize: 16,
    color: "#ff7675",
    textAlign: "center",
    marginTop: 50,
    fontWeight: "600",
  },
});
