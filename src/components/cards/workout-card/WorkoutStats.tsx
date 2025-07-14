// src/components/cards/workout-card/WorkoutStats.tsx
// רכיב סטטיסטיקות אימון עם אייקונים ועיצוב מתקדם

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Workout } from "../../../types/workout";
import {
  calculateTotalSets,
  calculateWorkoutVolume,
  formatVolume,
} from "./utils";
import { SIZE_CONFIG } from "./config";

/**
 * 📊 רכיב סטטיסטיקות אימון מפורט
 * מציג מידע חשוב על האימון: תרגילים, סטים, זמן ונפח
 */
interface WorkoutStatsProps {
  /** נתוני האימון */
  workout: Workout;
  /** גודל התצוגה */
  size?: "small" | "medium" | "large";
  /** צבע הטקסט */
  textColor?: string;
  /** צבע האייקונים */
  iconColor?: string;
  /** האם להציג בשורה אחת */
  inline?: boolean;
  /** סגנון מותאם אישית */
  style?: ViewStyle;
}

export const WorkoutStats = React.memo<WorkoutStatsProps>(
  ({
    workout,
    size = "medium",
    textColor = "#cccccc",
    iconColor = "#8e8e93",
    inline = true,
    style,
  }) => {
    // חישוב נתונים
    const exerciseCount = workout.exercises?.length || 0;
    const totalSets = React.useMemo(
      () => calculateTotalSets(workout.exercises),
      [workout.exercises]
    );
    const totalVolume = React.useMemo(
      () => calculateWorkoutVolume(workout.exercises),
      [workout.exercises]
    );

    // קבלת סגנונות לפי גודל
    const sizeStyles = SIZE_CONFIG[size];

    // רכיב סטטיסטיקה בודד
    const StatItem = ({
      icon,
      value,
      label,
    }: {
      icon: keyof typeof Ionicons.glyphMap;
      value: string | number;
      label?: string;
    }) => (
      <View style={[styles.statItem, !inline && styles.statItemVertical]}>
        <Ionicons name={icon} size={sizeStyles.iconSize} color={iconColor} />
        <Text
          style={[
            styles.statText,
            {
              color: textColor,
              fontSize: sizeStyles.fontSize,
            },
            !inline && styles.statTextVertical,
          ]}
        >
          {value}
          {label && <Text style={styles.statLabel}> {label}</Text>}
        </Text>
      </View>
    );

    return (
      <View
        style={[styles.container, !inline && styles.containerVertical, style]}
        accessible={true}
        accessibilityLabel={`סטטיסטיקות אימון: ${exerciseCount} תרגילים, ${totalSets} סטים, ${
          workout.duration || 0
        } דקות`}
      >
        {/* תרגילים */}
        <StatItem
          icon="fitness"
          value={exerciseCount}
          label={!inline ? "תרגילים" : undefined}
        />

        {/* סטים */}
        <StatItem
          icon="repeat"
          value={totalSets}
          label={!inline ? "סטים" : undefined}
        />

        {/* זמן */}
        {workout.duration !== undefined && workout.duration > 0 && (
          <StatItem
            icon="time-outline"
            value={`${workout.duration}'`}
            label={!inline ? "דקות" : undefined}
          />
        )}

        {/* נפח */}
        {totalVolume > 0 && (
          <StatItem
            icon="barbell-outline"
            value={formatVolume(totalVolume)}
            label={!inline ? "נפח" : undefined}
          />
        )}
      </View>
    );
  }
);

// הוספת displayName לצורכי דיבוג
WorkoutStats.displayName = "WorkoutStats";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 16,
  },
  containerVertical: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statItemVertical: {
    gap: 8,
  },
  statText: {
    fontWeight: "500",
  },
  statTextVertical: {
    marginLeft: 4,
  },
  statLabel: {
    fontWeight: "400",
    opacity: 0.8,
  },
});
