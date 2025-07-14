// src/components/workout-history/WorkoutStats.tsx
// רכיב סטטיסטיקות מתקדם להצגת נתוני האימונים בצורה ויזואלית ומושכת

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { WorkoutStats, modernColors } from "./types";

// רכיב הסטטיסטיקות הראשי - מציג 4 נתונים מרכזיים עם אנימציות ועיצוב מושך
export const StatsOverview = ({ stats }: { stats: WorkoutStats }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // אנימציה של כניסה חלקה וקלילה
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []); // fadeAnim is a ref, doesn't need to be in dependencies

  return (
    <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={modernColors.primaryGradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsGradient}
      >
        <View style={styles.statsGrid}>
          {/* נתון 1: סך האימונים */}
          <View style={styles.statItem}>
            <Ionicons name="fitness" size={24} color="white" />
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>אימונים</Text>
          </View>

          <View style={styles.statDivider} />

          {/* נתון 2: אימונים השבוע */}
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color="white" />
            <Text style={styles.statValue}>{stats.weeklyWorkouts}</Text>
            <Text style={styles.statLabel}>השבוע</Text>
          </View>

          <View style={styles.statDivider} />

          {/* נתון 3: זמן כולל */}
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="white" />
            <Text style={styles.statValue}>
              {Math.round(stats.totalDuration / 60)}h
            </Text>
            <Text style={styles.statLabel}>סה&quot;כ זמן</Text>
          </View>

          <View style={styles.statDivider} />

          {/* נתון 4: דירוג ממוצע */}
          <View style={styles.statItem}>
            <Ionicons name="star" size={24} color="white" />
            <Text style={styles.statValue}>
              {stats.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>דירוג ממוצע</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// סטיילים לפאנל הסטטיסטיקות - עיצוב גרדיאנט מרשים עם חלוקה ברורה
const styles = StyleSheet.create({
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  statsGradient: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 10,
  },
});
