// src/screens/home/components/StatsButton.tsx
// כפתור סטטיסטיקות אולטרה קומפקטי

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { DashboardData } from "../types";

interface StatsButtonProps {
  dashboardData: DashboardData | null;
}

const StatsButton: React.FC<StatsButtonProps> = ({ dashboardData }) => {
  const stats = dashboardData?.weeklyStats || {
    completedWorkouts: 0,
    totalDuration: 0,
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Open stats modal
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <LinearGradient
        colors={["rgba(102, 126, 234, 0.2)", "rgba(118, 75, 162, 0.2)"]}
        style={styles.container}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="stats-chart" size={20} color="#667eea" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>סטטיסטיקות</Text>
          <Text style={styles.stats}>
            {stats.completedWorkouts} אימונים •{" "}
            {Math.round(stats.totalDuration / 60)} שעות
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.3)",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  stats: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
  },
});

export default StatsButton;
