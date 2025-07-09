// src/screens/exercises/details/components/ExerciseMuscles.tsx
// רכיב קבוצות שרירים מעורבות

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseMusclesProps } from "../types";

const ExerciseMuscles: React.FC<ExerciseMusclesProps> = ({
  targetMuscleGroups,
}) => {
  if (!targetMuscleGroups || targetMuscleGroups.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>שרירים מעורבים</Text>
      <View style={styles.musclesContainer}>
        {targetMuscleGroups.map((muscle, index) => (
          <View key={index} style={styles.muscleTag}>
            <Text style={styles.muscleText}>{muscle}</Text>
          </View>
        ))}
      </View>
    </View>
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
  musclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  muscleTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  muscleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ExerciseMuscles;
