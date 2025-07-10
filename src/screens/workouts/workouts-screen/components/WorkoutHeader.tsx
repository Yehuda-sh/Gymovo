// src/screens/workouts/workouts-screen/components/WorkoutHeader.tsx
// כותרת מסך אימונים עם כפתורי פעולה וסטטיסטיקות

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  StatsOverview,
  WorkoutStats,
  modernColors,
} from "../../../../components/workout-history";
import { workoutStyles } from "../styles";

interface WorkoutHeaderProps {
  showStats: boolean;
  stats: WorkoutStats;
  onToggleStats: () => void;
}

/**
 * כותרת המסך עם פעולות וסטטיסטיקות
 * מציגה כפתור להצגה/הסתרה של פאנל הסטטיסטיקות
 */
export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  showStats,
  stats,
  onToggleStats,
}) => {
  const handleToggleStats = () => {
    onToggleStats();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      {/* כותרת עם כפתורי פעולה */}
      <View style={workoutStyles.header}>
        <Text style={workoutStyles.headerTitle}>היסטוריית אימונים</Text>
        <View style={workoutStyles.headerActions}>
          <TouchableOpacity
            style={workoutStyles.headerButton}
            onPress={handleToggleStats}
          >
            <Ionicons
              name={showStats ? "stats-chart" : "stats-chart-outline"}
              size={24}
              color={modernColors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* פאנל סטטיסטיקות */}
      {showStats && <StatsOverview stats={stats} />}
    </>
  );
};
