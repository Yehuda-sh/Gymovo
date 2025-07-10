// src/components/cards/workout-card/TargetMuscles.tsx
// רכיב תצוגת שרירי מטרה עם צבעים דינמיים ותגיות

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getMuscleColor } from "./utils";

/**
 * 💪 רכיב תצוגת שרירי מטרה
 * מציג את קבוצות השרירים שהאימון מכוון אליהם עם צבעים מותאמים
 */
interface TargetMusclesProps {
  /** רשימת שרירי המטרה */
  muscles?: string[];
  /** מספר מקסימלי של שרירים להצגה */
  maxVisible?: number;
  /** האם להציג בפורמט מקוצר */
  compact?: boolean;
}

export const TargetMuscles: React.FC<TargetMusclesProps> = ({
  muscles,
  maxVisible = 4,
  compact = false,
}) => {
  if (!muscles || muscles.length === 0) return null;

  // שרירים להצגה
  const visibleMuscles = muscles.slice(0, maxVisible);
  const hiddenCount = muscles.length - maxVisible;

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      {/* תגיות שרירים */}
      {visibleMuscles.map((muscle, index) => (
        <View
          key={index}
          style={[
            styles.muscleTag,
            compact && styles.compactMuscleTag,
            {
              backgroundColor: getMuscleColor(muscle) + "15",
              borderColor: getMuscleColor(muscle) + "30",
            },
          ]}
        >
          <Text
            style={[
              styles.muscleText,
              compact && styles.compactMuscleText,
              { color: getMuscleColor(muscle) },
            ]}
          >
            {muscle}
          </Text>
        </View>
      ))}

      {/* אינדיקטור לשרירים נוספים */}
      {hiddenCount > 0 && (
        <View style={[styles.moreMuscles, { backgroundColor: "#2c2c2e" }]}>
          <Text style={[styles.moreMusclesText, { color: "#8e8e93" }]}>
            +{hiddenCount}
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
    marginBottom: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  compactContainer: {
    marginBottom: 4,
  },
  muscleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  compactMuscleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  muscleText: {
    fontSize: 10,
    fontWeight: "500",
  },
  compactMuscleText: {
    fontSize: 9,
    fontWeight: "400",
  },
  moreMuscles: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    marginBottom: 4,
  },
  moreMusclesText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
