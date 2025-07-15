// src/screens/home/components/RecentWorkoutsSection.tsx
// קטע אימונים אחרונים עם מערכת עיצוב מאוחדת

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData } from "../types";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;

interface RecentWorkoutsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();

  if (!dashboardData?.recentWorkouts?.length) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={[colors.surfaceLight, colors.surface]}
          style={styles.emptyGradient}
        >
          <Ionicons name="barbell-outline" size={32} color={colors.primary} />
          <Text style={styles.emptyText}>עדיין אין אימונים</Text>
          <Text style={styles.emptySubtext}>התחל אימון ראשון!</Text>
        </LinearGradient>
      </View>
    );
  }

  const recentWorkouts = dashboardData.recentWorkouts.slice(0, 2);

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Main", { screen: "Workouts" });
  };

  const handleWorkoutPress = (workout: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // תיקון: שליחת הפרמטר הנכון
    navigation.navigate("WorkoutSummary", {
      workout: workout,
      workoutData: workout, // תאימות לאחור
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>אימונים אחרונים</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>הצג הכל</Text>
        </TouchableOpacity>
      </View>

      {recentWorkouts.map((workout, index) => (
        <TouchableOpacity
          key={workout.id}
          style={styles.workoutCard}
          onPress={() => handleWorkoutPress(workout)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.surfaceLight, colors.surface]}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.workoutName}>
                  {workout.planName} - {workout.dayName}
                </Text>
                <Text style={styles.workoutDate}>
                  {new Date(workout.date || "").toLocaleDateString("he-IL")}
                </Text>
              </View>
              <View style={styles.cardRight}>
                <View style={styles.statItem}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.statText}>
                    {workout.duration || 0} דק&apos;
                  </Text>
                </View>
                {workout.rating && (
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={styles.statText}>{workout.rating}</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  workoutCard: {
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  cardGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    flex: 1,
  },
  workoutName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  cardRight: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    opacity: 0.92,
  },
  emptyContainer: {
    paddingHorizontal: spacing.lg,
  },
  emptyGradient: {
    padding: spacing.xxl,
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default RecentWorkoutsSection;
