// src/screens/home/components/StatCard.tsx
// כרטיס סטטיסטיקה עם מידע על הביצועים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

import { CardLayout, Typography } from "../../../components/ui";
import { theme } from "../../../theme";
import { StatItem } from "../types";

interface StatCardProps {
  stat: StatItem;
}

/**
 * Card component to display individual statistics with trend indicators
 */
const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  // 🎨 צבע על פי הטרנד
  const getTrendColor = (trend: typeof stat.trend) => {
    switch (trend) {
      case "up":
        return theme.colors.success;
      case "down":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  // 📊 איקון טרנד
  const getTrendIcon = (trend: typeof stat.trend) => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      default:
        return "remove";
    }
  };

  return (
    <CardLayout
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: theme.spacing.lg,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: theme.spacing.sm,
        }}
      >
        <Ionicons
          name={stat.icon as any}
          size={20}
          color={theme.colors.primary}
        />
        {stat.trend && (
          <Ionicons
            name={getTrendIcon(stat.trend)}
            size={16}
            color={getTrendColor(stat.trend)}
            style={{ marginLeft: theme.spacing.xs }}
          />
        )}
      </View>

      <Typography variant="h2" align="center">
        {stat.value}
        {stat.unit && (
          <Typography variant="caption" color={theme.colors.textSecondary}>
            {" "}
            {stat.unit}
          </Typography>
        )}
      </Typography>

      <Typography
        variant="caption"
        color={theme.colors.textSecondary}
        align="center"
      >
        {stat.label}
      </Typography>
    </CardLayout>
  );
};

export default StatCard;
