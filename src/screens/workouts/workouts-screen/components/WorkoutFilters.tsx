// src/screens/workouts/workouts-screen/components/WorkoutFilters.tsx
// רכיב סינון ומיון אימונים עם גלולות פעילות

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import {
  FilterPills,
  WorkoutHistoryFilters,
  modernColors,
} from "../../../../components/workout-history";
import { WorkoutSortBy } from "../../../../types/workout";
import { workoutStyles } from "../styles";

interface WorkoutFiltersProps {
  filters: WorkoutHistoryFilters;
  sortBy: WorkoutSortBy;
  activeFiltersCount: number;
  onShowFilterModal: () => void;
  onSortPress: () => void;
  onRemoveFilter: (key: keyof WorkoutHistoryFilters) => void;
  getSortLabel: (sort: WorkoutSortBy) => string;
}

/**
 * רכיב סינון ומיון אימונים
 * מציג בקרות סינון ומיון עם גלולות סינונים פעילים
 */
export const WorkoutFilters: React.FC<WorkoutFiltersProps> = ({
  filters,
  sortBy,
  activeFiltersCount,
  onShowFilterModal,
  onSortPress,
  onRemoveFilter,
  getSortLabel,
}) => {
  const handleFilterPress = () => {
    onShowFilterModal();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSortPress = () => {
    onSortPress();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <>
      {/* שורת בקרת סינון ומיון */}
      <View style={workoutStyles.filterBar}>
        <TouchableOpacity
          style={[
            workoutStyles.filterButton,
            activeFiltersCount > 0 && workoutStyles.filterButtonActive,
          ]}
          onPress={handleFilterPress}
        >
          <Ionicons
            name="filter"
            size={20}
            color={activeFiltersCount > 0 ? "white" : modernColors.primary}
          />
          <Text
            style={[
              workoutStyles.filterButtonText,
              activeFiltersCount > 0 && workoutStyles.filterButtonTextActive,
            ]}
          >
            סינון {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={workoutStyles.sortButton}
          onPress={handleSortPress}
        >
          <Ionicons
            name="swap-vertical"
            size={20}
            color={modernColors.primary}
          />
          <Text style={workoutStyles.sortButtonText}>
            {getSortLabel(sortBy)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* גלולות הסינונים הפעילים */}
      {activeFiltersCount > 0 && (
        <FilterPills filters={filters} onRemoveFilter={onRemoveFilter} />
      )}
    </>
  );
};
