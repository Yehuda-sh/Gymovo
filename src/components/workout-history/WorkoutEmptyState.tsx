// src/components/workout-history/WorkoutEmptyState.tsx
// רכיב מצב ריק מעודד ומעוצב להתחלת אימון ראשון

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { modernColors } from "./types";

interface EmptyStateProps {
  onStartWorkout: () => void;
}

// רכיב מצב ריק - מעודד את המשתמש להתחיל אימון ראשון עם הודעה חמה ועיצוב מושך
export const EmptyState = ({ onStartWorkout }: EmptyStateProps) => (
  <MotiView
    from={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring" }}
    style={styles.emptyContainer}
  >
    <View style={styles.emptyIconContainer}>
      <Ionicons name="barbell" size={80} color={modernColors.textSecondary} />
    </View>
    <Text style={styles.emptyTitle}>עדיין אין אימונים</Text>
    <Text style={styles.emptyMessage}>
      התחל את המסע שלך ותתעד את האימון הראשון!
    </Text>
    <TouchableOpacity
      style={styles.startWorkoutButton}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onStartWorkout();
      }}
    >
      <LinearGradient
        colors={modernColors.primaryGradient as any}
        style={styles.gradientButton}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.startWorkoutButtonText}>התחל אימון חדש</Text>
      </LinearGradient>
    </TouchableOpacity>
  </MotiView>
);

// סטיילים למצב ריק - עיצוב מרכזי ומעודד עם גרדיינט ואנימציות
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: modernColors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    color: modernColors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  startWorkoutButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  startWorkoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
