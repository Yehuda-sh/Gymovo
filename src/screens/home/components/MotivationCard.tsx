// src/screens/home/components/MotivationCard.tsx
// כרטיס מוטיבציה בגובה מאוזן עם מערכת עיצוב מאוחדת

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { DashboardData } from "../types";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;

interface MotivationCardProps {
  dashboardData: DashboardData | null;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ dashboardData }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const weeklyGoal = 5;
  const completed = dashboardData?.weeklyStats.completedWorkouts || 0;
  const progressPercent = Math.min((completed / weeklyGoal) * 100, 100);
  const streak = dashboardData?.weeklyStats.streak || 0;
  const totalHours = Math.round(
    (dashboardData?.weeklyStats.totalDuration || 0) / 60
  );

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercent,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progressPercent, progressAnim]);

  const getMotivationalMessage = () => {
    if (completed === 0) return "בוא נתחיל השבוע!";
    if (completed >= weeklyGoal) return "מעולה! השגת את המטרה 🏆";
    return `עוד ${weeklyGoal - completed} אימונים למטרה`;
  };

  return (
    <BlurView intensity={15} style={styles.container}>
      <LinearGradient
        colors={[colors.surfaceLight, colors.surface]}
        style={styles.gradientContainer}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            <Text style={styles.progressText}>
              {completed} / {weeklyGoal}
            </Text>
            <Text style={styles.progressLabel}>אימונים</Text>
          </View>

          <View style={styles.centerSection}>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentage}>
                {Math.round(progressPercent)}%
              </Text>
            </View>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.statItem}>
              <Ionicons name="flame" size={16} color={colors.warning} />
              <Text style={styles.statValue}>{streak}</Text>
            </View>
            <Text style={styles.statLabel}>ימים ברצף</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={
                progressPercent > 50
                  ? [colors.success, "#38f9d7"]
                  : [colors.primary, colors.secondary]
              }
              style={styles.progressGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>

        {/* Bottom Message */}
        <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
      </LinearGradient>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "space-between",
    ...shadows.sm,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    alignItems: "center",
  },
  centerSection: {
    alignItems: "center",
  },
  rightSection: {
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  progressText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  progressLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  percentageContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.borderActive,
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.heavy,
    color: colors.text,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.xs,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: borderRadius.xs,
  },
  progressGradient: {
    flex: 1,
  },
  motivationText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
    textAlign: "center",
  },
});

export default MotivationCard;
