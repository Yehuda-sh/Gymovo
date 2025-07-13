// src/screens/home/components/MotivationCard.tsx
// כרטיס מוטיבציה בגובה מאוזן

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { DashboardData } from "../types";

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
        colors={["rgba(102, 126, 234, 0.15)", "rgba(118, 75, 162, 0.15)"]}
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
              <Ionicons name="flame" size={16} color="#F59E0B" />
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
                  ? ["#43e97b", "#38f9d7"]
                  : ["#667eea", "#764ba2"]
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
    borderRadius: 16,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
    justifyContent: "space-between",
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
    gap: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  progressLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  percentageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(102, 126, 234, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(102, 126, 234, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  progressGradient: {
    flex: 1,
  },
  motivationText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MotivationCard;
