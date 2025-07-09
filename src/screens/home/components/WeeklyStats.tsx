// src/screens/home/components/WeeklyStats.tsx
// סטטיסטיקות שבועיות עם כל הנתונים

import React from "react";
import { View } from "react-native";

import { Spacer, Typography } from "../../../components/ui";
import { theme } from "../../../theme";
import { DashboardData, StatItem } from "../types";
import StatCard from "./StatCard";

interface WeeklyStatsProps {
  dashboardData: DashboardData | null;
}

/**
 * Component to display weekly statistics in a grid layout
 */
const WeeklyStats: React.FC<WeeklyStatsProps> = ({ dashboardData }) => {
  // 📊 יצירת מערך סטטיסטיקות
  const stats: StatItem[] = [
    {
      label: "אימונים",
      value: dashboardData?.weeklyStats.completedWorkouts || 0,
      icon: "fitness-outline" as any,
      trend: dashboardData?.weeklyStats.completedWorkouts
        ? dashboardData.weeklyStats.completedWorkouts > 3
          ? "up"
          : "down"
        : "neutral",
    },
    {
      label: "משקל כולל",
      value: dashboardData?.weeklyStats.totalWeightLifted
        ? Math.round(dashboardData.weeklyStats.totalWeightLifted / 1000)
        : 0,
      unit: "טון",
      icon: "barbell-outline" as any,
    },
    {
      label: "זמן כולל",
      value: dashboardData?.weeklyStats.totalDuration
        ? Math.round(dashboardData.weeklyStats.totalDuration / 60)
        : 0,
      unit: "דק'",
      icon: "time-outline" as any,
    },
    {
      label: "רצף",
      value: dashboardData?.weeklyStats.streak || 0,
      unit: "ימים",
      icon: "flame-outline" as any,
      trend: dashboardData?.weeklyStats.streak
        ? dashboardData.weeklyStats.streak > 0
          ? "up"
          : "neutral"
        : "neutral",
    },
  ];

  return (
    <View>
      <Typography variant="h3">השבוע שלך</Typography>
      <Spacer size="md" />

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.sm,
        }}
      >
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </View>
    </View>
  );
};

export default WeeklyStats;
