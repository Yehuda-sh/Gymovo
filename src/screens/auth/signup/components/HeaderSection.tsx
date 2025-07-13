// src/screens/auth/signup/components/HeaderSection.tsx

import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HeaderSectionProps, signupColors } from "../types";

const colors = signupColors;

const HeaderSection: React.FC<HeaderSectionProps> = ({
  fadeAnim,
  slideAnim,
  headerScale,
}) => {
  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: headerScale }, { translateY: slideAnim }],
        },
      ]}
      accessibilityLabel="איזור כותרת הרשמה"
    >
      <View style={styles.logoIcon}>
        <Ionicons
          name="person-add"
          size={32}
          color="#fff"
          accessibilityLabel="סמל משתמש חדש"
        />
      </View>
      <Text
        style={styles.title}
        accessibilityRole="header"
        accessibilityLabel="הרשמה"
      >
        הרשמה
      </Text>
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
  headerContainer: {
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
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default HeaderSection;
