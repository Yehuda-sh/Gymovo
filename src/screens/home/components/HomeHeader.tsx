// src/screens/home/components/HomeHeader.tsx
// הדר דף הבית עם שלום ופרופיל - RTL מלא

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { theme } from "../../../theme";
import { User } from "../../../types/user";

interface HomeHeaderProps {
  user: User | null;
}

/**
 * Header component for the home screen with greeting and profile access
 */
const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  // 🔔 יצירת הודעה זמנית
  const handleNotifications = () => {
    Alert.alert("הודעות", "בקרוב...");
  };

  // 📅 יצירת תאריך נוכחי
  const currentDate = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 17) return "צהריים טובים";
    if (hour < 21) return "ערב טוב";
    return "לילה טוב";
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user?.name || "אלוף"} 👋
        </Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={handleNotifications}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.text}
          />
          {/* Notification badge - uncomment when needed
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
          */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "right",
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  notificationButton: {
    padding: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: theme.colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
});

export default HomeHeader;
