// src/screens/home/components/WeeklyStats.tsx
// רכיב סטטיסטיקות שבועיות עם תיקוני RTL מלאים

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../theme";
import { DashboardData } from "../types";

interface WeeklyStatsProps {
  dashboardData: DashboardData | null;
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color = theme.colors.primary,
}) => (
  <View style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ dashboardData }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.statsGrid}>
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
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    minHeight: 120,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.xs / 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default WeeklyStats;
