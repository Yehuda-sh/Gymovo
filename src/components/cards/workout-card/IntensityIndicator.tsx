// src/components/cards/workout-card/IntensityIndicator.tsx
// רכיב אינדיקטור אינטנסיביות עם פס התקדמות וצבעים דינמיים

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Workout } from "../../../types/workout";
import { calculateWorkoutIntensity } from "./utils";
import { INTENSITY_CONFIG, IntensityLevel } from "./config";

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
  /** האם להשתמש בגרדיאנט */
  useGradient?: boolean;
  /** סגנון מותאם אישית */
  style?: ViewStyle;
}

export const IntensityIndicator = React.memo<IntensityIndicatorProps>(
  ({
    workout,
    compact = false,
    showLabel = true,
    barHeight = 4,
    useGradient = false,
    style,
  }) => {
    // חישוב האינטנסיביות
    const intensity = React.useMemo(
      () => calculateWorkoutIntensity(workout),
      [workout]
    );

    // קבלת רמת האינטנסיביות
    const getIntensityLevel = (): IntensityLevel => {
      for (const [level, threshold] of Object.entries(
        INTENSITY_CONFIG.thresholds
      )) {
        if (intensity >= threshold.min && intensity < threshold.max) {
          return level as IntensityLevel;
        }
      }
      return IntensityLevel.LOW;
    };

    const intensityLevel = getIntensityLevel();
    const intensityColor = INTENSITY_CONFIG.colors[intensityLevel];
    const intensityLabel = INTENSITY_CONFIG.labels[intensityLevel];
    const gradientColors = INTENSITY_CONFIG.gradients[
      intensityLevel
    ] as readonly [string, string];

    // רכיב הפס הפנימי
    const ProgressBar = () => {
      if (useGradient) {
        return (
          <LinearGradient
            colors={[...gradientColors]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[
              styles.intensityFill,
              {
                width: `${intensity}%`,
                height: barHeight,
              },
            ]}
          />
        );
      }

      return (
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
      );
    };

    return (
      <View
        style={[styles.container, compact && styles.compactContainer, style]}
        accessible={true}
        accessibilityLabel={`עצימות אימון: ${intensityLabel}, ${intensity} אחוז`}
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: intensity,
        }}
      >
        {/* פס האינטנסיביות */}
        <View
          style={[
            styles.intensityBar,
            {
              height: barHeight,
              backgroundColor: useGradient
                ? "rgba(255,255,255,0.1)"
                : "#333333",
            },
          ]}
        >
          <ProgressBar />
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
              עצימות {intensityLabel}
            </Text>
            <Text
              style={[
                styles.intensityPercentage,
                compact && styles.compactPercentage,
                { color: `${intensityColor}80` },
              ]}
            >
              {intensity}%
            </Text>
          </View>
        )}
      </View>
    );
  }
);

// הוספת displayName לצורכי דיבוג
IntensityIndicator.displayName = "IntensityIndicator";

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
