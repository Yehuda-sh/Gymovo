// src/screens/exercises/details/components/ExerciseActions.tsx
// רכיב כפתורי פעולה עבור תרגיל

import React from "react";
import { View, StyleSheet } from "react-native";
import Button from "../../../../components/common/Button";
import { colors } from "../../../../theme/colors";
import { ExerciseActionsProps } from "../types";

const ExerciseActions: React.FC<ExerciseActionsProps> = ({
  exercise,
  onAddToWorkout,
}) => {
  return (
    <View style={styles.addToWorkoutContainer}>
      <Button
        title="הוסף לאימון"
        onPress={onAddToWorkout}
        style={styles.addToWorkoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addToWorkoutContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  addToWorkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default ExerciseActions;
