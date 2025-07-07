// src/components/stats/WorkoutStatsDashboard.tsx - 📊 Advanced Statistics Dashboard

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
import { LineChart } from "react-native-chart-kit";
import { WorkoutStats } from "../../hooks/useWorkoutHistory";
import { getCurrentColors } from "../../theme/colors";

const { width } = Dimensions.get("window");
const chartWidth = width - 40;

interface WorkoutStatsDashboardProps {
  stats: WorkoutStats;
  workouts?: any[]; // Full workout data for advanced charts
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
  const colors = getCurrentColors();

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
        return colors.success;
      case "down":
        return colors.error;
      case "stable":
        return colors.text.secondary;
    }
  };

  return (
    <View
      style={[styles.trendCard, { backgroundColor: colors.background.card }]}
    >
      <View style={styles.trendHeader}>
        <Ionicons name={getTrendIcon()} size={20} color={getTrendColor()} />
        <Text style={[styles.trendValue, { color: colors.text.primary }]}>
          {value}
        </Text>
      </View>
      <Text style={[styles.trendLabel, { color: colors.text.secondary }]}>
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
  const colors = getCurrentColors();
  const cardColor = color || colors.primary;

  return (
    <View
      style={[styles.statCard, { backgroundColor: colors.background.card }]}
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
        <Text style={[styles.statValue, { color: colors.text.primary }]}>
          {value}
        </Text>
        <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: colors.text.tertiary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

// 🎯 Circular Progress Component
const CircularProgress = ({
  percentage,
  size = 80,
  strokeWidth = 8,
  color,
  label,
  value,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  label: string;
  value: string;
}) => {
  const colors = getCurrentColors();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.circularProgress, { width: size, height: size }]}>
      <View style={styles.circularProgressContent}>
        <Text
          style={[styles.circularProgressValue, { color: colors.text.primary }]}
        >
          {value}
        </Text>
        <Text
          style={[
            styles.circularProgressLabel,
            { color: colors.text.secondary },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
};

// 📊 Favorite Exercises Component
const FavoriteExercises = ({ exercises }: { exercises: string[] }) => {
  const colors = getCurrentColors();

  return (
    <View
      style={[
        styles.favoritesCard,
        { backgroundColor: colors.background.card },
      ]}
    >
      <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
        <Ionicons name="heart" size={16} color={colors.error} /> התרגילים
        הפופולריים
      </Text>

      {exercises.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          עדיין אין מספיק נתונים
        </Text>
      ) : (
        <View style={styles.exercisesList}>
          {exercises.slice(0, 5).map((exercise, index) => (
            <View key={exercise} style={styles.exerciseItem}>
              <View style={styles.exerciseRank}>
                <Text
                  style={[
                    styles.exerciseRankText,
                    { color: colors.text.inverse },
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text
                style={[styles.exerciseName, { color: colors.text.primary }]}
              >
                {exercise}
              </Text>
              <View
                style={[
                  styles.exerciseBar,
                  { backgroundColor: colors.border.light },
                ]}
              >
                <View
                  style={[
                    styles.exerciseBarFill,
                    {
                      backgroundColor: colors.primary,
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

// 📈 Week Progress Chart Component
const WeekProgressChart = ({ workouts }: { workouts: any[] }) => {
  const colors = getCurrentColors();

  const weekData = useMemo(() => {
    const days = ["ב", "ג", "ד", "ה", "ו", "ש", "א"];
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekWorkouts = days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);

      const dayWorkouts = workouts.filter((workout) => {
        const workoutDate = new Date(workout.completedAt || workout.date);
        return workoutDate.toDateString() === date.toDateString();
      });

      return {
        day,
        count: dayWorkouts.length,
        volume: dayWorkouts.reduce((sum, w) => {
          return (
            sum +
            w.exercises.reduce((exSum: number, ex: any) => {
              return (
                exSum +
                ex.sets.reduce((setSum: number, set: any) => {
                  return setSum + (set.weight || 0) * (set.reps || 0);
                }, 0)
              );
            }, 0)
          );
        }, 0),
      };
    });

    return {
      labels: days,
      datasets: [
        {
          data: weekWorkouts.map((d) => d.count),
          color: (opacity = 1) => colors.primary,
          strokeWidth: 3,
        },
      ],
    };
  }, [workouts, colors.primary]);

  return (
    <View
      style={[styles.chartCard, { backgroundColor: colors.background.card }]}
    >
      <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
        <Ionicons name="bar-chart" size={16} color={colors.primary} /> השבוע שלי
      </Text>

      <LineChart
        data={weekData}
        width={chartWidth - 40}
        height={180}
        chartConfig={{
          backgroundColor: colors.background.card,
          backgroundGradientFrom: colors.background.card,
          backgroundGradientTo: colors.background.card,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.primary,
          labelColor: (opacity = 1) => colors.text.secondary,
          style: {
            borderRadius: 16,
          },
          propsForLabels: {
            fontSize: 12,
          },
        }}
        style={styles.chart}
        bezier
        withDots
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
      />
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
  const colors = getCurrentColors();

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
        { backgroundColor: colors.background.secondary },
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
                    period === p ? colors.primary : colors.background.tertiary,
                  borderColor:
                    period === p ? colors.primary : colors.border.light,
                },
              ]}
              onPress={() => onPeriodChange(p)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  {
                    color:
                      period === p ? colors.text.inverse : colors.text.primary,
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
          color={colors.primary}
          subtitle="מתחילת השימוש"
        />
        <StatCard
          icon="trending-up"
          value={formatVolume(stats.totalVolume)}
          label="נפח כולל"
          color={colors.success}
          subtitle={`${formatVolume(stats.weeklyVolume)} השבוע`}
        />
        <StatCard
          icon="time"
          value={formatDuration(stats.averageDuration)}
          label="זמן ממוצע"
          color={colors.warning}
          subtitle={`${formatDuration(stats.totalDuration)} סה"כ`}
        />
        <StatCard
          icon="calendar"
          value={stats.monthlyWorkouts}
          label="החודש"
          color={colors.secondary}
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
          { backgroundColor: colors.background.card },
        ]}
      >
        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
          <Ionicons name="trophy" size={16} color={colors.warning} /> הישגים
          השבוע
        </Text>

        <View style={styles.achievementsList}>
          {stats.currentStreak >= 7 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: colors.success + "15" },
              ]}
            >
              <Ionicons name="flame" size={20} color={colors.success} />
              <Text style={[styles.achievementText, { color: colors.success }]}>
                רצף שבועי!
              </Text>
            </View>
          )}

          {stats.weeklyVolume > 1000 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Ionicons name="fitness" size={20} color={colors.primary} />
              <Text style={[styles.achievementText, { color: colors.primary }]}>
                נפח גבוה!
              </Text>
            </View>
          )}

          {stats.weeklyWorkouts >= 5 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: colors.warning + "15" },
              ]}
            >
              <Ionicons name="medal" size={20} color={colors.warning} />
              <Text style={[styles.achievementText, { color: colors.warning }]}>
                מחויב לספורט!
              </Text>
            </View>
          )}

          {stats.averageRating >= 4.5 && (
            <View
              style={[
                styles.achievementBadge,
                { backgroundColor: colors.error + "15" },
              ]}
            >
              <Ionicons name="star" size={20} color={colors.error} />
              <Text style={[styles.achievementText, { color: colors.error }]}>
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
                { color: colors.text.tertiary },
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
  chart: {
    borderRadius: 16,
    alignSelf: "center",
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
  circularProgress: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circularProgressContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  circularProgressLabel: {
    fontSize: 10,
    textAlign: "center",
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
