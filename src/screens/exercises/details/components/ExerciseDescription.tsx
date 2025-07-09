// src/screens/exercises/details/components/ExerciseDescription.tsx
// רכיב תיאור התרגיל

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseDescriptionProps } from "../types";

const ExerciseDescription: React.FC<ExerciseDescriptionProps> = ({
  description,
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>תיאור</Text>
      <Text style={styles.description}>{description || "אין תיאור זמין"}</Text>
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: "right",
  },
});

export default ExerciseDescription;
