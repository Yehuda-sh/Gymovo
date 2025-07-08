// src/components/stats/WorkoutStatsDashboard.tsx - 📊 Fixed Statistics Dashboard

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/colors";
import { Workout, WorkoutStats } from "../../types/workout";

const { width } = Dimensions.get("window");

interface WorkoutStatsDashboardProps {
  stats: WorkoutStats;
  workouts?: Workout[];
  period?: "week" | "month" | "year";
  onPeriodChange?: (period: "week" | "month" | "year") => void;
}

// 📈 Progress Trend Component
const ProgressTrendCard = ({
  trend,
  value,
  label,
}: {
  trend: "up" | "down" | "stable";
  value: string;
  label: string;
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      case "stable":
        return "remove";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "#34C759"; // Green
      case "down":
        return "#FF3B30"; // Red
      case "stable":
        return "#8E8E93"; // Gray
    }
  };

  return (
    <View
      style={[
        styles.trendCard,
        { backgroundColor: colors.surface || "#FFFFFF" },
      ]}
    >
      <View style={styles.trendHeader}>
        <Ionicons name={getTrendIcon()} size={20} color={getTrendColor()} />
        <Text style={[styles.trendValue, { color: colors.text || "#000" }]}>
          {value}
        </Text>
      </View>
      <Text
        style={[styles.trendLabel, { color: colors.textSecondary || "#666" }]}
      >
        {label}
      </Text>
    </View>
  );
};

// 🏆 Stat Card Component
const StatCard = ({
  icon,
  value,
  label,
  color,
  subtitle,
}: {
  icon: string;
  value: string | number;
  label: string;
  color?: string;
  subtitle?: string;
}) => (
  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
    <View style={styles.statIconContainer}>
      <Ionicons name={icon as any} size={24} color={color || colors.primary} />
    </View>
    <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
      {label}
    </Text>
    {subtitle && (
      <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>
        {subtitle}
      </Text>
    )}
  </View>
);

// 📊 Main Dashboard Component
const WorkoutStatsDashboard: React.FC<WorkoutStatsDashboardProps> = ({
  stats,
  workouts = [],
  period = "week",
  onPeriodChange,
}) => {
  // Calculate trends
  const trends = useMemo(() => {
    if (!workouts || workouts.length < 2) {
      return {
        volume: { trend: "stable" as const, value: "0%" },
        frequency: { trend: "stable" as const, value: "0%" },
        duration: { trend: "stable" as const, value: "0%" },
      };
    }

    // Simple trend calculation (compare last week to previous)
    const thisWeek = workouts.filter((w) => {
      const date = new Date(w.completedAt || w.date || "");
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    });

    const lastWeek = workouts.filter((w) => {
      const date = new Date(w.completedAt || w.date || "");
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return date <= weekAgo && date > twoWeeksAgo;
    });

    const volumeTrend =
      thisWeek.length > lastWeek.length
        ? ("up" as const)
        : thisWeek.length < lastWeek.length
        ? ("down" as const)
        : ("stable" as const);

    const volumeChange = lastWeek.length
      ? Math.round(
          ((thisWeek.length - lastWeek.length) / lastWeek.length) * 100
        )
      : 0;

    return {
      volume: {
        trend: volumeTrend,
        value: `${volumeChange > 0 ? "+" : ""}${volumeChange}%`,
      },
      frequency: { trend: "stable" as const, value: "0%" },
      duration: { trend: "stable" as const, value: "0%" },
    };
  }, [workouts]);

  // Format stats values
  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)}T`; // Tons
    }
    return `${weight}kg`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, "0")}`;
    }
    return `${minutes} דק׳`;
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Period Selector */}
      {onPeriodChange && (
        <View style={styles.periodSelector}>
          {(["week", "month", "year"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodButton,
                period === p && styles.periodButtonActive,
              ]}
              onPress={() => onPeriodChange(p)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  period === p && styles.periodButtonTextActive,
                ]}
              >
                {p === "week" ? "שבוע" : p === "month" ? "חודש" : "שנה"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="barbell-outline"
          value={stats.totalWorkouts}
          label="אימונים"
          color={colors.primary}
        />
        <StatCard
          icon="time-outline"
          value={formatDuration(stats.totalDuration)}
          label="זמן כולל"
          color={colors.success}
        />
        <StatCard
          icon="trending-up-outline"
          value={formatWeight(stats.totalWeight)}
          label="משקל כולל"
          color={colors.warning}
        />
        <StatCard
          icon="star-outline"
          value={stats.averageRating.toFixed(1)}
          label="דירוג ממוצע"
          color={colors.accent || colors.primary}
        />
      </View>

      {/* Trends Section */}
      <View style={styles.trendsSection}>
        <Text style={styles.sectionTitle}>מגמות</Text>
        <View style={styles.trendsGrid}>
          <ProgressTrendCard
            trend={trends.volume.trend}
            value={trends.volume.value}
            label="נפח אימונים"
          />
          <ProgressTrendCard
            trend={trends.frequency.trend}
            value={trends.frequency.value}
            label="תדירות"
          />
          <ProgressTrendCard
            trend={trends.duration.trend}
            value={trends.duration.value}
            label="משך אימון"
          />
        </View>
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStats}>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>רצף נוכחי</Text>
          <View style={styles.statRowValue}>
            <Ionicons name="flame" size={20} color={colors.warning} />
            <Text style={styles.statRowValueText}>{stats.streakDays} ימים</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>אימונים השבוע</Text>
          <Text style={styles.statRowValueText}>{stats.weeklyWorkouts}</Text>
        </View>

        <View style={[styles.statRow, styles.statRowLast]}>
          <Text style={styles.statRowLabel}>אימונים החודש</Text>
          <Text style={styles.statRowValueText}>{stats.monthlyWorkouts}</Text>
        </View>
      </View>

      {/* Favorite Exercises */}
      {stats.favoriteExercises && stats.favoriteExercises.length > 0 && (
        <View style={styles.favoritesSection}>
          <Text style={styles.sectionTitle}>תרגילים פופולריים</Text>
          {stats.favoriteExercises.slice(0, 3).map((exercise, index) => (
            <View key={index} style={styles.favoriteItem}>
              <Text style={styles.favoriteExerciseName}>{exercise.name}</Text>
              <Text style={styles.favoriteExerciseCount}>
                {exercise.count} פעמים
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Muscle Group Distribution */}
      {stats.muscleGroupDistribution &&
        stats.muscleGroupDistribution.length > 0 && (
          <View style={styles.distributionSection}>
            <Text style={styles.sectionTitle}>התפלגות קבוצות שרירים</Text>
            {stats.muscleGroupDistribution.map((group, index) => (
              <View key={index} style={styles.distributionItem}>
                <Text style={styles.distributionLabel}>{group.muscle}</Text>
                <View style={styles.distributionBar}>
                  <View
                    style={[
                      styles.distributionBarFill,
                      { width: `${group.percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.distributionPercentage}>
                  {group.percentage}%
                </Text>
              </View>
            ))}
          </View>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: "#FFFFFF",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  trendsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  trendsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  trendCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  trendLabel: {
    fontSize: 12,
  },
  additionalStats: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statRowLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statRowValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statRowValueText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  favoritesSection: {
    marginBottom: 24,
  },
  favoriteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  favoriteExerciseName: {
    fontSize: 14,
    color: colors.text,
  },
  favoriteExerciseCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  distributionSection: {
    marginBottom: 24,
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  distributionBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  distributionBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  distributionPercentage: {
    fontSize: 10,
    color: colors.textSecondary,
    position: "absolute",
    right: 0,
    top: 20,
  },
});

export default WorkoutStatsDashboard;
