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
import { WorkoutStats } from "../../hooks/useWorkoutHistory";
import { colors } from "../../theme/colors";
import { Workout } from "../../types/workout";

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
}) => {
  const cardColor = color || colors.primary || "#007AFF";

  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surface || "#FFFFFF" },
      ]}
    >
      <View
        style={[
          styles.statIconContainer,
          { backgroundColor: cardColor + "15" },
        ]}
      >
        <Ionicons name={icon as any} size={24} color={cardColor} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: colors.text || "#000" }]}>
          {value}
        </Text>
        <Text
          style={[styles.statLabel, { color: colors.textSecondary || "#666" }]}
        >
          {label}
        </Text>
        {subtitle && (
          <Text
            style={[
              styles.statSubtitle,
              { color: colors.textSecondary || "#999" },
            ]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

// 📊 Favorite Exercises Component
const FavoriteExercises = ({ exercises }: { exercises: string[] }) => {
  return (
    <View
      style={[
        styles.favoritesCard,
        { backgroundColor: colors.surface || "#FFFFFF" },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.text || "#000" }]}>
        <Ionicons name="heart" size={16} color="#FF3B30" /> התרגילים הפופולריים
      </Text>

      {exercises.length === 0 ? (
        <Text
          style={[styles.emptyText, { color: colors.textSecondary || "#999" }]}
        >
          עדיין אין מספיק נתונים
        </Text>
      ) : (
        <View style={styles.exercisesList}>
          {exercises.slice(0, 5).map((exercise, index) => (
            <View key={exercise} style={styles.exerciseItem}>
              <View style={styles.exerciseRank}>
                <Text style={[styles.exerciseRankText, { color: "#FFFFFF" }]}>
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[styles.exerciseName, { color: colors.text || "#000" }]}
              >
                {exercise}
              </Text>
              <View
                style={[
                  styles.exerciseBar,
                  { backgroundColor: colors.border || "#E5E5E7" },
                ]}
              >
                <View
                  style={[
                    styles.exerciseBarFill,
                    {
                      backgroundColor: colors.primary || "#007AFF",
                      width: `${100 - index * 15}%`,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// 📈 Simple Week Progress Component (without chart library)
const WeekProgressChart = ({ workouts }: { workouts: Workout[] }) => {
  const weekData = useMemo(() => {
    const days = ["ב", "ג", "ד", "ה", "ו", "ש", "א"];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekWorkouts = days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      const dayWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.completedAt || workout.date || 0);
        return workoutDate.toDateString() === date.toDateString();
      });

      return {
        day,
        count: dayWorkouts.length,
        volume: dayWorkouts.reduce((sum, w) => {
          return (
            sum +
            w.exercises.reduce((exSum, ex) => {
              return (
                exSum +
                ex.sets.reduce((setSum, set) => {
                  return setSum + (set.weight || 0) * (set.reps || 0);
                }, 0)
              );
            }, 0)
          );
        }, 0),
      };
    });

    return weekWorkouts;
  }, [workouts]);

  const maxCount = Math.max(...weekData.map((d) => d.count), 1);

  return (
    <View
      style={[
        styles.chartCard,
        { backgroundColor: colors.surface || "#FFFFFF" },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.text || "#000" }]}>
        <Ionicons
          name="bar-chart"
          size={16}
          color={colors.primary || "#007AFF"}
        />{" "}
        השבוע שלי
      </Text>

      <View style={styles.simpleChart}>
        {weekData.map((data, index) => (
          <View key={index} style={styles.chartColumn}>
            <View
              style={[
                styles.chartBar,
                {
                  height: `${(data.count / maxCount) * 100}%`,
                  backgroundColor:
                    data.count > 0 ? colors.primary || "#007AFF" : "#E5E5E7",
                },
              ]}
            />
            <Text
              style={[
                styles.chartLabel,
                { color: colors.textSecondary || "#666" },
              ]}
            >
              {data.day}
            </Text>
            <Text style={[styles.chartValue, { color: colors.text || "#000" }]}>
              {data.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// 🎯 Main Dashboard Component
const WorkoutStatsDashboard: React.FC<WorkoutStatsDashboardProps> = ({
  stats,
  workouts = [],
  period = "week",
  onPeriodChange,
}) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)} דק'`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}:${mins.toString().padStart(2, "0")} שע'`;
  };

  const formatVolume = (kg: number) => {
    if (kg > 1000) return `${(kg / 1000).toFixed(1)}k ק"ג`;
    return `${Math.round(kg)} ק"ג`;
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background || "#F5F5F5" },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Period Selector */}
      {onPeriodChange && (
        <View style={styles.periodSelector}>
          {(["week", "month", "year"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodButton,
                {
                  backgroundColor:
                    period === p
                      ? colors.primary || "#007AFF"
                      : colors.surface || "#F2F2F7",
                  borderColor:
                    period === p
                      ? colors.primary || "#007AFF"
                      : colors.border || "#E5E5E7",
                },
              ]}
              onPress={() => onPeriodChange(p)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  {
                    color: period === p ? "#FFFFFF" : colors.text || "#000",
                  },
                ]}
              >
                {p === "week" ? "שבוע" : p === "month" ? "חודש" : "שנה"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Progress Trends */}
      <View style={styles.trendsContainer}>
        <ProgressTrendCard
          trend={stats.progressTrend}
          value={stats.currentStreak.toString()}
          label="רצף אימונים"
        />
        <ProgressTrendCard
          trend={
            stats.weeklyWorkouts > 3
              ? "up"
              : stats.weeklyWorkouts < 2
              ? "down"
              : "stable"
          }
          value={stats.weeklyWorkouts.toString()}
          label="השבוע"
        />
        <ProgressTrendCard
          trend="stable"
          value={stats.averageRating.toFixed(1)}
          label="ממוצע דירוג"
        />
      </View>

      {/* Main Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          icon="barbell"
          value={stats.totalWorkouts}
          label="סך אימונים"
          color={colors.primary || "#007AFF"}
          subtitle="מתחילת השימוש"
        />
        <StatCard
          icon="trending-up"
          value={formatVolume(stats.totalVolume)}
          label="נפח כולל"
          color="#34C759"
          subtitle={`${formatVolume(stats.weeklyVolume)} השבוע`}
        />
        <StatCard
          icon="time"
          value={formatDuration(stats.averageDuration)}
          label="זמן ממוצע"
          color="#FF9500"
          subtitle={`${formatDuration(stats.totalDuration)} סה"כ`}
        />
        <StatCard
          icon="calendar"
          value={stats.monthlyWorkouts}
          label="החודש"
          color="#5856D6"
          subtitle="אימונים"
        />
      </View>

      {/* Weekly Progress Chart */}
      {workouts.length > 0 && <WeekProgressChart workouts={workouts} />}

      {/* Favorite Exercises */}
      <FavoriteExercises exercises={stats.favoriteExercises} />

      {/* Achievement Badges */}
      <View
        style={[
          styles.achievementsCard,
          { backgroundColor: colors.surface || "#FFFFFF" },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text || "#000" }]}>
          <Ionicons name="trophy" size={16} color="#FF9500" /> הישגים השבוע
        </Text>

        <View style={styles.achievementsList}>
          {stats.currentStreak >= 7 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: "#34C759" + "15" },
              ]}
            >
              <Ionicons name="flame" size={20} color="#34C759" />
              <Text style={[styles.achievementText, { color: "#34C759" }]}>
                רצף שבועי!
              </Text>
            </View>
          )}

          {stats.weeklyVolume > 1000 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: (colors.primary || "#007AFF") + "15" },
              ]}
            >
              <Ionicons
                name="fitness"
                size={20}
                color={colors.primary || "#007AFF"}
              />
              <Text
                style={[
                  styles.achievementText,
                  { color: colors.primary || "#007AFF" },
                ]}
              >
                נפח גבוה!
              </Text>
            </View>
          )}

          {stats.weeklyWorkouts >= 5 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: "#FF9500" + "15" },
              ]}
            >
              <Ionicons name="medal" size={20} color="#FF9500" />
              <Text style={[styles.achievementText, { color: "#FF9500" }]}>
                מחויב לספורט!
              </Text>
            </View>
          )}

          {stats.averageRating >= 4.5 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: "#FF3B30" + "15" },
              ]}
            >
              <Ionicons name="star" size={20} color="#FF3B30" />
              <Text style={[styles.achievementText, { color: "#FF3B30" }]}>
                איכות גבוהה!
              </Text>
            </View>
          )}
        </View>

        {stats.currentStreak < 7 &&
          stats.weeklyVolume <= 1000 &&
          stats.weeklyWorkouts < 5 &&
          stats.averageRating < 4.5 && (
            <Text
              style={[
                styles.emptyAchievements,
                { color: colors.textSecondary || "#999" },
              ]}
            >
              המשך להתאמן כדי לזכות בהישגים! 💪
            </Text>
          )}
      </View>
    </ScrollView>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  trendsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  trendCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  trendValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  trendLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statContent: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
  },
  chartCard: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "right",
  },
  simpleChart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingHorizontal: 10,
  },
  chartColumn: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  chartBar: {
    width: 20,
    minHeight: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    fontWeight: "600",
  },
  favoritesCard: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  exerciseRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseRankText: {
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "right",
  },
  exerciseBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  exerciseBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 20,
  },
  achievementsCard: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  achievementBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyAchievements: {
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 20,
  },
});

export default WorkoutStatsDashboard;
