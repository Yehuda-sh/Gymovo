// src/screens/home/components/HomeHeader.tsx
// הדר דף הבית עם שלום ופרופיל - עיצוב ישראלי RTL נכון

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import { theme } from "../../../theme";
import { User } from "../../../types/user";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface HomeHeaderProps {
  user: User | null;
}

/**
 * Header component for the home screen with RTL support
 */
const HomeHeader: React.FC<HomeHeaderProps> = ({ user }) => {
  const { isSmallDevice, headerFontSize, bodyFontSize, iconSize } =
    useResponsiveDimensions();

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
    const userName = user?.name || "יקר";

    if (hour < 12) return `בוקר טוב, ${userName}`;
    if (hour < 17) return `צהריים טובים, ${userName}`;
    if (hour < 21) return `ערב טוב, ${userName}`;
    return `לילה טוב, ${userName}`;
  };

  // Dynamic styles for RTL design
  const dynamicStyles = StyleSheet.create({
    greeting: {
      fontSize: isSmallDevice ? 26 : 30,
      fontWeight: "900",
      color: theme.colors.text,
      textAlign: "right", // RTL - מיושר לימין
      marginBottom: isSmallDevice ? 4 : 6,
      letterSpacing: -0.8,
      lineHeight: isSmallDevice ? 34 : 38,
      // הוספת צלליות לעומק
      textShadowColor: "rgba(0, 0, 0, 0.1)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    date: {
      fontSize: isSmallDevice ? 15 : 17,
      color: theme.colors.textSecondary,
      textAlign: "right", // RTL - מיושר לימין
      fontWeight: "600",
      opacity: 0.85,
      letterSpacing: -0.2,
      lineHeight: isSmallDevice ? 20 : 24,
    },
    iconContainer: {
      width: isSmallDevice ? 36 : 40,
      height: isSmallDevice ? 36 : 40,
      borderRadius: isSmallDevice ? 18 : 20,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

  return (
    <View style={styles.container}>
      {/* טקסט מימין - RTL */}
      <View style={styles.textContainer}>
        <Text style={dynamicStyles.greeting}>{getGreeting()}</Text>
        <Text style={dynamicStyles.date}>{currentDate}</Text>
      </View>

      {/* כפתור הודעות - משמאל */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={handleNotifications}
        activeOpacity={0.7}
      >
        <View style={dynamicStyles.iconContainer}>
          <Ionicons
            name="notifications-outline"
            size={iconSize}
            color={theme.colors.text}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse", // RTL - מימין לשמאל
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-end", // RTL - מיושר לימין
    justifyContent: "flex-start",
  },
  notificationButton: {
    padding: 8,
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
