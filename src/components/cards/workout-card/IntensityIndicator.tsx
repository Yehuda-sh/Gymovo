// src/components/cards/workout-card/IntensityIndicator.tsx
// רכיב אינדיקטור אינטנסיביות עם פס התקדמות וצבעים דינמיים

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Workout } from "../../../types/workout";
import {
  calculateWorkoutIntensity,
  getIntensityColor,
  getIntensityLabel,
} from "./utils";

/**
 * 🔥 רכיב אינדיקטור אינטנסיביות אימון
 * מחשב ומציג את רמת האינטנסיביות על בסיס נפח, זמן וסטים
 */
interface IntensityIndicatorProps {
  /** נתוני האימון */
  workout: Workout;
  /** האם להציג בפורמט מקוצר */
  compact?: boolean;
  /** האם להציג את התווית */
  showLabel?: boolean;
  /** גובה פס האינטנסיביות */
  barHeight?: number;
}

export const IntensityIndicator: React.FC<IntensityIndicatorProps> = ({
  workout,
  compact = false,
  showLabel = true,
  barHeight = 4,
}) => {
  // חישוב האינטנסיביות
  const intensity = React.useMemo(
    () => calculateWorkoutIntensity(workout),
    [workout]
  );

  const intensityColor = getIntensityColor(intensity);
  const intensityLabelText = getIntensityLabel(intensity);

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* פס האינטנסיביות */}
      <View
        style={[
          styles.intensityBar,
          { height: barHeight, backgroundColor: "#333333" },
        ]}
      >
        <View
          style={[
            styles.intensityFill,
            {
              backgroundColor: intensityColor,
              width: `${intensity}%`,
              height: barHeight,
            },
          ]}
        />
      </View>

      {/* תווית האינטנסיביות */}
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.intensityLabel,
              compact && styles.compactLabel,
              { color: intensityColor },
            ]}
          >
            עצימות {intensityLabelText}
          </Text>
          <Text
            style={[
              styles.intensityPercentage,
              compact && styles.compactPercentage,
              { color: intensityColor + "80" },
            ]}
          >
            {intensity}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  compactContainer: {
    marginBottom: 8,
  },
  intensityBar: {
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  intensityFill: {
    borderRadius: 2,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  intensityLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "right",
  },
  compactLabel: {
    fontSize: 9,
  },
  intensityPercentage: {
    fontSize: 9,
    fontWeight: "400",
  },
  compactPercentage: {
    fontSize: 8,
  },
});
