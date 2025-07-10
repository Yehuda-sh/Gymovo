// src/screens/workouts/workouts-screen/components/WorkoutFAB.tsx
// כפתור צף והמודאל סינון אימונים

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React from "react";
import { TouchableOpacity } from "react-native";

import {
  WorkoutFilterModal,
  WorkoutHistoryFilters,
  modernColors,
} from "../../../../components/workout-history";
import { workoutStyles } from "../styles";

interface WorkoutFABProps {
  hasWorkouts: boolean;
  showFilterModal: boolean;
  filters: WorkoutHistoryFilters;
  onStartWorkout: () => void;
  onCloseFilterModal: () => void;
  onApplyFilters: (filters: WorkoutHistoryFilters) => void;
}

/**
 * כפתור צף להוספת אימון חדש ומודאל סינון
 * מוצג רק כשיש אימונים ברשימה
 */
export const WorkoutFAB: React.FC<WorkoutFABProps> = ({
  hasWorkouts,
  showFilterModal,
  filters,
  onStartWorkout,
  onCloseFilterModal,
  onApplyFilters,
}) => {
  const handleStartWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onStartWorkout();
  };

  return (
    <>
      {/* כפתור צף להוספת אימון חדש */}
      {hasWorkouts && (
        <TouchableOpacity
          style={workoutStyles.fab}
          onPress={handleStartWorkout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={modernColors.primaryGradient as any}
            style={workoutStyles.fabGradient}
          >
            <Ionicons name="add" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* מודאל סינון מתקדם */}
      <WorkoutFilterModal
        visible={showFilterModal}
        onClose={onCloseFilterModal}
        filters={filters}
        onApplyFilters={onApplyFilters}
      />
    </>
  );
};
