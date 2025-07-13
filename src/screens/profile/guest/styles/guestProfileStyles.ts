// src/screens/profile/guest/styles/guestProfileStyles.ts
// סטיילים גלובליים למסך פרופיל אורח

import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../../theme/colors";

const { width } = Dimensions.get("window");

export const guestProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#000000",
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // סטיילים לאנימציות
  animatedContainer: {
    flex: 1,
  },

  // סטיילים כלליים לכרטיסים
  card: {
    backgroundColor: colors.surface || "#1F2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border || "#374151",
  },

  // צללים
  shadow: {
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // כפתורים
  button: {
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
