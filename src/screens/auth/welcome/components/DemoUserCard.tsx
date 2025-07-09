// src/screens/auth/welcome/components/DemoUserCard.tsx - כרטיס משתמש דמו

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DemoUserCardProps, welcomeColors } from "../types";

// כרטיס משתמש דמו עם מידע מפורט על המשתמש
export const DemoUserCard: React.FC<DemoUserCardProps> = ({
  user,
  onPress,
}) => {
  // פונקציה לתרגום רמת הכושר לעברית
  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "ביניים";
      case "advanced":
        return "מתקדם";
      default:
        return level;
    }
  };

  // פונקציה לתרגום המטרה לעברית
  const getGoalText = (goal: string) => {
    switch (goal) {
      case "build_muscle":
        return "בניית שריר";
      case "lose_weight":
        return "ירידה במשקל";
      case "get_stronger":
        return "חיזוק";
      case "general_fitness":
        return "כושר כללי";
      default:
        return goal;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.devButton, { backgroundColor: user.color || "#1F2937" }]}
      onPress={() => onPress(user)}
    >
      <Text style={styles.demoButtonText}>{user.name}</Text>
      <Text style={styles.demoButtonSubtext}>
        {user.email} • {user.age} שנים
      </Text>
      <Text style={styles.demoButtonDetails}>
        {getLevelText(user.level)} • {getGoalText(user.goal)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  devButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  demoButtonText: {
    color: welcomeColors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  demoButtonSubtext: {
    color: welcomeColors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  demoButtonDetails: {
    color: welcomeColors.textMuted,
    fontSize: 11,
    fontWeight: "400",
  },
});

export default DemoUserCard;
