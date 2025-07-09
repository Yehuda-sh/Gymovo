// src/screens/exercises/details/components/ExerciseHeader.tsx
// רכיב Header עבור מסך פרטי תרגיל

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseHeaderProps } from "../types";

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  exercise,
  onDifficultyColorSelect,
  onDifficultyTextSelect,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>

      {/* קטגוריה (מחליף את muscleGroup) */}
      <Text style={styles.category}>{exercise.category}</Text>

      {/* רמת קושי */}
      {exercise.difficulty && (
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: onDifficultyColorSelect(exercise.difficulty) },
          ]}
        >
          <Text style={styles.difficultyText}>
            {onDifficultyTextSelect(exercise.difficulty)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "right",
    marginBottom: 12,
  },
  difficultyBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ExerciseHeader; 