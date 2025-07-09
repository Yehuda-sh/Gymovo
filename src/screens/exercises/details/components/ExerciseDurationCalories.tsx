// src/screens/exercises/details/components/ExerciseDurationCalories.tsx
// רכיב משך זמן וקלוריות

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseDurationCaloriesProps } from "../types";

const ExerciseDurationCalories: React.FC<ExerciseDurationCaloriesProps> = ({
  duration,
  calories,
}) => {
  if (!duration && !calories) {
    return null;
  }

  return (
    <>
      {/* משך זמן משוער */}
      {duration && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>משך זמן משוער</Text>
          <Text style={styles.duration}>
            {Math.floor(duration / 60)} דקות ו-{duration % 60} שניות
          </Text>
        </View>
      )}

      {/* קלוריות */}
      {calories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>קלוריות משוערות</Text>
          <Text style={styles.calories}>{calories} קלוריות</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  duration: {
    fontSize: 16,
    color: colors.text,
    textAlign: "right",
  },
  calories: {
    fontSize: 16,
    color: colors.text,
    textAlign: "right",
  },
});

export default ExerciseDurationCalories;
