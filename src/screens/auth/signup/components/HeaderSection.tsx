// src/screens/auth/signup/components/HeaderSection.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../theme/colors";
import { HeaderSectionProps, signupColors } from "../types";

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  return (
    <Animated.View
      style={[
        styles.headerSection,
        {
          transform: [{ translateY: slideAnim }, { scale: headerScale }],
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoGlow} />
        <View style={styles.logoFrame}>
          <Ionicons name="person-add" size={40} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>הרשמה</Text>
      <Text style={styles.subtitle}>הצטרף לקהילת הכושר המתקדמת</Text>
      <View style={styles.accentLine} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: signupColors.logoGlow,
    shadowColor: "#00ff88",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 136, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
  },
  subtitle: {
    fontSize: 16,
    color: signupColors.subtitle,
    textAlign: "center",
    marginBottom: 16,
  },
  accentLine: {
    width: 60,
    height: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default HeaderSection;
