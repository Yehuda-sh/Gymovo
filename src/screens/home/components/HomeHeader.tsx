// src/screens/home/components/HomeHeader.tsx
// כותרת אולטרה קומפקטית עם מערכת עיצוב מאוחדת

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../../../types/user";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, typography, borderRadius } = unifiedDesignSystem;

interface HomeHeaderProps {
  user: User | null;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  const getUserName = () => {
    if (!user || user.isGuest) return "אורח";
    return user.name || user.email.split("@")[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.avatar}
        >
          <Ionicons
            name={user?.isGuest ? "person-outline" : "person"}
            size={24}
            color="#fff"
          />
        </LinearGradient>
      </View>
      <Text style={styles.greeting}>
        {getGreeting()}, {getUserName()} 💪
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: spacing.xs,
  },
  avatarContainer: {
    marginLeft: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderActive,
    backgroundColor: colors.surfaceLight,
  },
  greeting: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
});

export default HomeHeader;
