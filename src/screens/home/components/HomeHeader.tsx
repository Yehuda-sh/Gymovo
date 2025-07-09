// src/screens/home/components/HomeHeader.tsx
// הדר דף הבית עם שלום ופרופיל

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, View } from "react-native";

import { IconButton, Typography } from "../../../components/ui";
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

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Typography variant="h1">שלום, {user?.name || "אלוף"} 👋</Typography>
        <Typography variant="body" color={theme.colors.textSecondary}>
          {currentDate}
        </Typography>
      </View>

      <IconButton
        icon={
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.text}
          />
        }
        onPress={handleNotifications}
        size="md"
        variant="ghost"
      />
    </View>
  );
};

export default HomeHeader;
