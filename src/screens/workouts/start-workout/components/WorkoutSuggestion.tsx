// src/screens/workouts/start-workout/components/WorkoutSuggestion.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../theme/colors";
import { useWorkoutSuggestions } from "../hooks/useWorkoutSuggestions";

export const WorkoutSuggestion: React.FC<{
  onAccept: (suggestion: any) => void;
}> = ({ onAccept }) => {
  const { suggestion, isLoading } = useWorkoutSuggestions();

  if (isLoading || !suggestion) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onAccept(suggestion)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Ionicons name="bulb-outline" size={24} color="white" />
          <Text style={styles.title}>המלצה חכמה</Text>
        </View>
        <Text style={styles.planName}>{suggestion.planName}</Text>
        <Text style={styles.dayName}>{suggestion.dayName}</Text>
        <Text style={styles.reason}>{suggestion.reason}</Text>
        <View style={styles.acceptButton}>
          <Text style={styles.acceptText}>התחל אימון</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  dayName: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  reason: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
    marginBottom: 16,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 12,
  },
  acceptText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginRight: 8,
  },
});
