// src/screens/auth/signup/components/HeaderSection.tsx
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderSectionProps } from "../types";

// צבעים מ-WelcomeScreen
const colors = {
  primary: "#FF6B35",
  secondary: "#F7931E",
  text: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.85)",
};

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  return (
    <Animated.View
      style={[
        styles.logoSection,
        {
          opacity: fadeAnim,
          transform: [{ scale: headerScale }],
        },
      ]}
    >
      <View style={styles.logoIcon}>
        <Ionicons name="person-add" size={32} color="#fff" />
      </View>
      <Text style={styles.title}>הרשמה</Text>
      <View style={styles.accentLine} />
      <Text style={styles.subtitle}>
        הצטרף לקהילת המתאמנים הגדולה בישראל
        {"\n"}
        ותתחיל את המסע שלך לכושר מושלם
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  accentLine: {
    width: 40,
    height: 2.5,
    backgroundColor: colors.secondary,
    borderRadius: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default HeaderSection;
