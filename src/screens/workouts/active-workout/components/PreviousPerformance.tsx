// src/screens/workouts/active-workout/components/PreviousPerformance.tsx

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PreviousPerformanceProps, workoutColors } from "../types";

// 📊 הצגת ביצועים קודמים
const PreviousPerformance: React.FC<PreviousPerformanceProps> = ({
  exerciseId,
  setIndex,
}) => {
  // בגרסה האמיתית, זה יבוא מה-store או API
  const mockPreviousData = {
    weight: 40,
    reps: 12,
    date: "לפני 3 ימים",
  };

  return (
    <View style={styles.previousPerformance}>
      <Ionicons name="trophy-outline" size={16} color={workoutColors.info} />
      <Text style={styles.previousText}>
        פעם קודמת: {mockPreviousData.weight}kg × {mockPreviousData.reps} (
        {mockPreviousData.date})
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  previousPerformance: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: workoutColors.info + "10",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  previousText: {
    fontSize: 12,
    color: workoutColors.info,
    textAlign: "right",
  },
});

export default PreviousPerformance;
