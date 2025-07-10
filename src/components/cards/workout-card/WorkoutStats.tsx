// src/components/cards/workout-card/WorkoutStats.tsx
// רכיב סטטיסטיקות אימון עם אייקונים ועיצוב מתקדם

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Workout } from "../../../types/workout";
import {
  calculateTotalSets,
  calculateWorkoutVolume,
  formatVolume,
} from "./utils";

/**
 * 📊 רכיב סטטיסטיקות אימון מפורט
 * מציג מידע חשוב על האימון: תרגילים, סטים, זמן ונפח
 */
interface WorkoutStatsProps {
  /** נתוני האימון */
  workout: Workout;
  /** האם להציג בפורמט מקוצר */
  compact?: boolean;
  /** צבע הטקסט */
  textColor?: string;
  /** צבע האייקונים */
  iconColor?: string;
}

export const WorkoutStats: React.FC<WorkoutStatsProps> = ({
  workout,
  compact = false,
  textColor = "#cccccc",
  iconColor = "#cccccc",
}) => {
  // חישוב סטטיסטיקות
  const totalVolume = React.useMemo(
    () => calculateWorkoutVolume(workout.exercises),
    [workout.exercises]
  );

  const totalSets = React.useMemo(
    () => calculateTotalSets(workout.exercises),
    [workout.exercises]
  );

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* מספר תרגילים */}
      <View style={styles.statItem}>
        <Ionicons name="barbell-outline" size={14} color={iconColor} />
        <Text style={[styles.statText, { color: textColor }]}>
          {workout.exercises.length} תרגילים
        </Text>
      </View>

      {/* מספר סטים */}
      <View style={styles.statItem}>
        <Ionicons name="layers-outline" size={14} color={iconColor} />
        <Text style={[styles.statText, { color: textColor }]}>
          {totalSets} סטים
        </Text>
      </View>

      {/* משך הזמן */}
      {workout.duration && (
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={14} color={iconColor} />
          <Text style={[styles.statText, { color: textColor }]}>
            {workout.duration} דק׳
          </Text>
        </View>
      )}

      {/* נפח אימון */}
      {totalVolume > 0 && (
        <View style={styles.statItem}>
          <Ionicons name="trending-up-outline" size={14} color={iconColor} />
          <Text style={[styles.statText, { color: textColor }]}>
            {formatVolume(totalVolume)} ק״ג
          </Text>
        </View>
      )}

      {/* קלוריות (אם קיים) */}
      {workout.calories && (
        <View style={styles.statItem}>
          <Ionicons name="flame-outline" size={14} color={iconColor} />
          <Text style={[styles.statText, { color: textColor }]}>
            {workout.calories} קק״ל
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  compactContainer: {
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
});
