// src/screens/home/components/WeeklyStats.tsx
// רכיב סטטיסטיקות שבועיות עם תיקוני RTL מלאים + Responsive

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../theme";
import { DashboardData } from "../types";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

interface WeeklyStatsProps {
  dashboardData: DashboardData | null;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ dashboardData }) => {
  const {
    isSmallDevice,
    iconSize,
    iconContainerSize,
    titleFontSize,
    bodyFontSize,
    cardPadding,
    cardGap,
  } = useResponsiveDimensions();

  const stats = dashboardData?.weeklyStats || {
    completedWorkouts: 0,
    totalWeightLifted: 0,
    totalDuration: 0,
    streak: 0,
  };

  const formatWeight = (weight: number): string => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)}K`;
    }
    return weight.toString();
  };

  const formatDuration = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0
        ? `${hours}:${mins.toString().padStart(2, "0")}`
        : `${hours}`;
    }
    return minutes.toString();
  };

  // Dynamic styles based on screen size
  const dynamicStyles = StyleSheet.create({
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: isSmallDevice
        ? theme.borderRadius.lg
        : theme.borderRadius.xl,
      padding: cardPadding,
      alignItems: "center",
      minHeight: isSmallDevice ? 115 : 130,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    iconContainer: {
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: iconContainerSize / 2,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
    },
    statValue: {
      fontSize: isSmallDevice ? 22 : 26,
      fontWeight: "800",
      textAlign: "center",
      marginBottom: isSmallDevice ? theme.spacing.xs : theme.spacing.sm,
      letterSpacing: -0.5,
    },
    statLabel: {
      fontSize: isSmallDevice ? 11 : 13,
      color: theme.colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
  });

  const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    color = theme.colors.primary,
  }) => (
    <View style={dynamicStyles.statCard}>
      <View
        style={[dynamicStyles.iconContainer, { backgroundColor: `${color}20` }]}
      >
        <Ionicons name={icon} size={iconSize} color={color} />
      </View>
      <Text style={[dynamicStyles.statValue, { color }]}>{value}</Text>
      <Text style={dynamicStyles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.statsGrid, { gap: cardGap }]}>
        <StatCard
          icon="fitness"
          value={stats.completedWorkouts}
          label="אימונים"
          color={theme.colors.primary}
        />
        <StatCard
          icon="barbell"
          value={formatWeight(stats.totalWeightLifted)}
          label="משקל כולל"
          color={theme.colors.accent}
        />
        <StatCard
          icon="time"
          value={formatDuration(stats.totalDuration)}
          label="זמן כולל"
          color={theme.colors.info}
        />
        <StatCard
          icon="flame"
          value={stats.streak}
          label="רצף"
          color={theme.colors.warning}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
});

export default WeeklyStats;
