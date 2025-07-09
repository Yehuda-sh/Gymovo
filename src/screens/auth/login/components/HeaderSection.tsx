// src/screens/auth/login/components/HeaderSection.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../../theme/colors";
import { HeaderSectionProps, loginColors } from "../types";

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
          <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
        </View>
      </View>

      <Text style={styles.title}>התחברות</Text>
      <Text style={styles.subtitle}>כניסה מאובטחת לחשבון שלך</Text>
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
    position: "relative",
    marginBottom: 24,
  },
  logoGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    top: -20,
    left: -20,
    opacity: 0.2,
  },
  logoFrame: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "sans-serif-condensed",
  },
  subtitle: {
    fontSize: 16,
    color: loginColors.subtitle,
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
