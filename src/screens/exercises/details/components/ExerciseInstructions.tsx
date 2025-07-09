// src/screens/exercises/details/components/ExerciseInstructions.tsx
// רכיב הוראות ביצוע התרגיל

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseInstructionsProps } from "../types";

const ExerciseInstructions: React.FC<ExerciseInstructionsProps> = ({
  instructions,
}) => {
  if (!instructions) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>הוראות ביצוע</Text>
      {Array.isArray(instructions) ? (
        instructions.map((instruction, index) => (
          <Text key={index} style={styles.instruction}>
            {`${index + 1}. ${instruction}`}
          </Text>
        ))
      ) : (
        <Text style={styles.instruction}>{instructions}</Text>
      )}
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
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: colors.textSecondary,
    textAlign: "right",
  },
});

export default ExerciseInstructions;
