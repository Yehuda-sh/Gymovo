// src/components/cards/workout-card/DifficultyBadge.tsx
// תווית רמת קושי עם אייקונים וצבעים דינמיים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getDifficultyColor } from "../../../theme/design/fitness";

/**
 * 🏷️ רכיב תווית קושי עם אייקון וצבע מותאם
 * מציג את רמת הקושי באופן ויזואלי וברור
 */
interface DifficultyBadgeProps {
  /** רמת הקושי */
  difficulty?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
}) => {
  if (!difficulty) return null;

  /**
   * מחזיר את סגנון התווית בהתאם לרמת הקושי
   */
  const getBadgeStyle = () => {
    switch (difficulty) {
      case "beginner":
        return {
          color: getDifficultyColor("beginner")?.color || "#4CAF50",
          text: "מתחיל",
          icon: "leaf" as const,
        };
      case "intermediate":
        return {
          color: getDifficultyColor("intermediate")?.color || "#FF9800",
          text: "בינוני",
          icon: "flash" as const,
        };
      case "advanced":
        return {
          color: getDifficultyColor("advanced")?.color || "#F44336",
          text: "מתקדם",
          icon: "flame" as const,
        };
      default:
        return {
          color: "#cccccc",
          text: difficulty,
          icon: "help" as const,
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: badgeStyle.color }]}>
      <Ionicons name={badgeStyle.icon} size={12} color="white" />
      <Text style={styles.text}>{badgeStyle.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
    gap: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
});
