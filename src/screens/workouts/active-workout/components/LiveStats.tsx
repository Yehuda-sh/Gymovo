// src/screens/workouts/active-workout/components/LiveStats.tsx

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WorkoutExercise, WorkoutSet } from "../../../../types/workout";
import { LiveStatsProps, WorkoutStats, workoutColors } from "../types";

// 📊 רכיב סטטיסטיקות בזמן אמת משופר
const LiveStats: React.FC<LiveStatsProps> = ({ workout }) => {
  const stats: WorkoutStats = useMemo(() => {
    const completedSets =
      workout?.exercises?.flatMap((ex: WorkoutExercise) =>
        ex.sets.filter((set) => set.status === "completed")
      ) || [];

    const totalSets =
      workout?.exercises?.reduce(
        (sum: number, ex: WorkoutExercise) => sum + ex.sets.length,
        0
      ) || 0;

    const completedExercises =
      workout?.exercises?.filter((ex: WorkoutExercise) =>
        ex.sets.every((set) => set.status === "completed")
      ).length || 0;

    return {
      totalVolume: completedSets.reduce(
        (sum: number, set: WorkoutSet) =>
          sum + (set.weight || 0) * (set.reps || 0),
        0
      ),
      completedSets: completedSets.length,
      totalSets,
      completedExercises,
      totalExercises: workout?.exercises?.length || 0,
      progress: totalSets > 0 ? (completedSets.length / totalSets) * 100 : 0,
    };
  }, [workout]);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons
          name="barbell-outline"
          size={20}
          color={workoutColors.primary}
        />
        <Text style={styles.statLabel}>נפח כולל</Text>
        <Text style={styles.statValue}>{Math.round(stats.totalVolume)}kg</Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons
          name="fitness-outline"
          size={20}
          color={workoutColors.accent}
        />
        <Text style={styles.statLabel}>סטים</Text>
        <Text style={styles.statValue}>
          {stats.completedSets}/{stats.totalSets}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={workoutColors.success}
        />
        <Text style={styles.statLabel}>תרגילים</Text>
        <Text style={styles.statValue}>
          {stats.completedExercises}/{stats.totalExercises}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: workoutColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: workoutColors.subtext,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
  },
});

export default LiveStats;
