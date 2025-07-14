// src/components/cards/workout-card/DifficultyBadge.tsx
// תווית רמת קושי עם אייקונים וצבעים דינמיים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * רמות קושי אפשריות
 */
export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

/**
 * 🏷️ רכיב תווית קושי עם אייקון וצבע מותאם
 * מציג את רמת הקושי באופן ויזואלי וברור
 */
interface DifficultyBadgeProps {
  /** רמת הקושי */
  difficulty?: DifficultyLevel | string;
  /** האם להציג אייקון */
  showIcon?: boolean;
  /** גודל התווית */
  size?: "small" | "medium" | "large";
}

export const DifficultyBadge = React.memo<DifficultyBadgeProps>(
  ({ difficulty, showIcon = true, size = "medium" }) => {
    if (!difficulty) return null;

    /**
     * מחזיר את סגנון התווית בהתאם לרמת הקושי
     */
    const getBadgeStyle = () => {
      const normalizedDifficulty = difficulty?.toLowerCase();

      const difficultyMap = {
        [DifficultyLevel.BEGINNER]: {
          color: "#4CAF50",
          text: "מתחיל",
          icon: "leaf" as const,
        },
        [DifficultyLevel.INTERMEDIATE]: {
          color: "#FF9800",
          text: "בינוני",
          icon: "flash" as const,
        },
        [DifficultyLevel.ADVANCED]: {
          color: "#F44336",
          text: "מתקדם",
          icon: "flame" as const,
        },
      };

      return (
        difficultyMap[normalizedDifficulty as DifficultyLevel] || {
          color: "#757575",
          text: difficulty || "לא מוגדר",
          icon: "help-circle-outline" as const,
        }
      );
    };

    /**
     * מחזיר סגנונות בהתאם לגודל
     */
    const getSizeStyles = () => {
      switch (size) {
        case "small":
          return {
            paddingHorizontal: 6,
            paddingVertical: 2,
            fontSize: 9,
            iconSize: 10,
            borderRadius: 10,
          };
        case "large":
          return {
            paddingHorizontal: 12,
            paddingVertical: 5,
            fontSize: 12,
            iconSize: 16,
            borderRadius: 14,
          };
        default: // medium
          return {
            paddingHorizontal: 8,
            paddingVertical: 3,
            fontSize: 10,
            iconSize: 12,
            borderRadius: 12,
          };
      }
    };

    const badgeStyle = getBadgeStyle();
    const sizeStyles = getSizeStyles();

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: badgeStyle.color,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            paddingVertical: sizeStyles.paddingVertical,
            borderRadius: sizeStyles.borderRadius,
          },
        ]}
        accessible={true}
        accessibilityLabel={`רמת קושי: ${badgeStyle.text}`}
        accessibilityRole="text"
      >
        {showIcon && (
          <Ionicons
            name={badgeStyle.icon}
            size={sizeStyles.iconSize}
            color="white"
          />
        )}
        <Text style={[styles.text, { fontSize: sizeStyles.fontSize }]}>
          {badgeStyle.text}
        </Text>
      </View>
    );
  }
);

// הוספת displayName לצורכי דיבוג
DifficultyBadge.displayName = "DifficultyBadge";

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 4,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
    color: "white",
  },
});
