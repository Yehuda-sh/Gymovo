// src/components/cards/workout-card/TargetMuscles.tsx
// רכיב תצוגת שרירי מטרה עם צבעים דינמיים ותגיות

import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { MUSCLE_COLORS, SIZE_CONFIG } from "./config";

/**
 * 💪 רכיב תצוגת שרירי מטרה
 * מציג את קבוצות השרירים שהאימון מכוון אליהם עם צבעים מותאמים
 */
interface TargetMusclesProps {
  /** רשימת שרירי המטרה */
  muscles?: string[];
  /** מספר מקסימלי של שרירים להצגה */
  maxVisible?: number;
  /** גודל התצוגה */
  size?: "small" | "medium" | "large";
  /** האם להציג את כל השרירים או לקצר */
  showAll?: boolean;
  /** סגנון מותאם אישית */
  style?: ViewStyle;
}

export const TargetMuscles = React.memo<TargetMusclesProps>(
  ({ muscles, maxVisible = 4, size = "medium", showAll = false, style }) => {
    if (!muscles || muscles.length === 0) return null;

    // קבלת סגנונות לפי גודל
    const sizeStyles = SIZE_CONFIG[size];

    // שרירים להצגה
    const visibleMuscles = showAll ? muscles : muscles.slice(0, maxVisible);
    const hiddenCount = showAll ? 0 : muscles.length - maxVisible;

    // פונקציה לקבלת צבע השריר
    const getMuscleColor = (muscle: string): string => {
      const normalizedMuscle = muscle.toLowerCase().replace(/\s+/g, "_");
      return MUSCLE_COLORS[normalizedMuscle] || MUSCLE_COLORS.default;
    };

    return (
      <View
        style={[
          styles.container,
          size === "small" && styles.compactContainer,
          style,
        ]}
        accessible={true}
        accessibilityLabel={`שרירי מטרה: ${muscles.join(", ")}`}
        accessibilityRole="text"
      >
        {/* תגיות שרירים */}
        {visibleMuscles.map((muscle, index) => {
          const muscleColor = getMuscleColor(muscle);

          return (
            <View
              key={`${muscle}-${index}`}
              style={[
                styles.muscleTag,
                {
                  backgroundColor: `${muscleColor}15`,
                  borderColor: `${muscleColor}30`,
                  paddingHorizontal: sizeStyles.paddingHorizontal,
                  paddingVertical: sizeStyles.paddingVertical,
                  borderRadius: sizeStyles.borderRadius / 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.muscleText,
                  {
                    color: muscleColor,
                    fontSize: sizeStyles.fontSize,
                  },
                ]}
                numberOfLines={1}
              >
                {muscle}
              </Text>
            </View>
          );
        })}

        {/* אינדיקטור לשרירים נוספים */}
        {hiddenCount > 0 && (
          <View
            style={[
              styles.moreMuscles,
              {
                paddingHorizontal: sizeStyles.paddingHorizontal,
                paddingVertical: sizeStyles.paddingVertical,
                borderRadius: sizeStyles.borderRadius / 2,
              },
            ]}
          >
            <Text
              style={[
                styles.moreMusclesText,
                { fontSize: sizeStyles.fontSize },
              ]}
            >
              +{hiddenCount}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

// הוספת displayName לצורכי דיבוג
TargetMuscles.displayName = "TargetMuscles";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
  },
  compactContainer: {
    marginBottom: 4,
    gap: 4,
  },
  muscleTag: {
    borderWidth: 1,
    maxWidth: 100,
  },
  muscleText: {
    fontWeight: "500",
    textAlign: "center",
  },
  moreMuscles: {
    backgroundColor: "#2c2c2e",
    borderWidth: 1,
    borderColor: "#3c3c3e",
  },
  moreMusclesText: {
    fontWeight: "500",
    color: "#8e8e93",
  },
});
