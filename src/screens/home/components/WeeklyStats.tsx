// src/screens/home/components/WeeklyStats.tsx
// רכיב הסטטיסטיקות השבועיות עם גריד RTL נכון

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";
import { theme } from "../../../theme";
import { DashboardData } from "../types";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface WeeklyStatsProps {
  dashboardData: DashboardData | null;
}

type StatItem = {
  title: string;
  value: string;
  icon: string;
  gradient: readonly [string, string];
  unit?: string;
};

/**
 * Weekly statistics component with RTL grid layout
 */
const WeeklyStats: React.FC<WeeklyStatsProps> = ({ dashboardData }) => {
  const { isSmallDevice, screenPadding } = useResponsiveDimensions();

  // RTL Stats Order - מסדר RTL נכון
  const stats: StatItem[] = [
    {
      title: "אימונים", // הכי חשוב - מימין למעלה
      value: dashboardData?.weeklyStats.completedWorkouts?.toString() || "0",
      icon: "trophy",
      gradient: ["#43e97b", "#38f9d7"] as const,
    },
    {
      title: "זמן כולל", // שמאל למעלה
      value: `${Math.floor(
        (dashboardData?.weeklyStats.totalDuration || 0) / 60
      )}:${String(
        (dashboardData?.weeklyStats.totalDuration || 0) % 60
      ).padStart(2, "0")}`,
      icon: "timer",
      gradient: ["#f093fb", "#f5576c"] as const,
    },
    {
      title: "משקל כולל", // מימין למטה
      value: (dashboardData?.weeklyStats.totalWeightLifted || 0).toFixed(1),
      icon: "barbell",
      gradient: ["#4facfe", "#00f2fe"] as const,
      unit: "K",
    },
    {
      title: "דקות", // שמאל למטה
      value: dashboardData?.weeklyStats.totalDuration?.toString() || "0",
      icon: "flame",
      gradient: ["#667eea", "#764ba2"] as const,
    },
  ];

  const StatCard: React.FC<{ stat: StatItem }> = ({ stat }) => {
    const cardStyles = StyleSheet.create({
      card: {
        flex: 1,
        height: isSmallDevice ? 80 : 90,
        borderRadius: 16,
        padding: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
        alignItems: "center",
        justifyContent: "center",
        margin: isSmallDevice ? 4 : 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
      },
      cardContent: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      },
      iconContainer: {
        width: isSmallDevice ? 28 : 32,
        height: isSmallDevice ? 28 : 32,
        borderRadius: isSmallDevice ? 14 : 16,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.25)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: isSmallDevice ? 4 : 6,
      },
      valueContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      },
      value: {
        fontSize: isSmallDevice ? 18 : 20,
        fontWeight: "800",
        color: "#FFFFFF",
        textAlign: "center", // מרכז הכרטיס
        lineHeight: isSmallDevice ? 22 : 24,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
      },
      unit: {
        fontSize: isSmallDevice ? 11 : 12,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.8)",
        marginTop: -2,
      },
      title: {
        fontSize: isSmallDevice ? 11 : 12,
        fontWeight: "600",
        color: "rgba(255, 255, 255, 0.9)",
        textAlign: "center", // מרכז הכרטיס
        marginTop: 2,
      },
    });

    return (
      <LinearGradient
        colors={stat.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles.card}
      >
        <View style={cardStyles.cardContent}>
          <View style={cardStyles.iconContainer}>
            <Ionicons
              name={stat.icon as any}
              size={isSmallDevice ? 14 : 16}
              color="rgba(255, 255, 255, 0.95)"
            />
          </View>

          <View style={cardStyles.valueContainer}>
            <Text style={cardStyles.value}>
              {stat.value}
              {stat.unit && <Text style={cardStyles.unit}>{stat.unit}</Text>}
            </Text>
          </View>

          <Text style={cardStyles.title}>{stat.title}</Text>
        </View>
      </LinearGradient>
    );
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      paddingHorizontal: screenPadding,
    },
    gridContainer: {
      flexDirection: "row-reverse", // RTL - מתחיל מימין
      flexWrap: "wrap",
      marginHorizontal: -4,
    },
    row: {
      flexDirection: "row-reverse", // RTL - בתוך השורה גם מימין לשמאל
      flex: 1,
      marginBottom: isSmallDevice ? 4 : 6,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.gridContainer}>
        {/* שורה ראשונה RTL */}
        <View style={dynamicStyles.row}>
          <StatCard stat={stats[0]} />
          <StatCard stat={stats[1]} />
        </View>

        {/* שורה שנייה RTL */}
        <View style={dynamicStyles.row}>
          <StatCard stat={stats[2]} />
          <StatCard stat={stats[3]} />
        </View>
      </View>
    </View>
  );
};

export default WeeklyStats;
