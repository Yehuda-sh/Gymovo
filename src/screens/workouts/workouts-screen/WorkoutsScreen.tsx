// src/screens/workouts/workouts-screen/WorkoutsScreen.tsx
// מסך היסטוריית אימונים מחולק ומסודר - מנהל רכיבים מודולריים

import React from "react";
import { View } from "react-native";

import {
  WorkoutHeader,
  WorkoutFilters,
  WorkoutList,
  WorkoutFAB,
} from "./components";
import { useWorkoutData } from "./hooks";
import { workoutStyles } from "./styles";

/**
 * מסך היסטוריית אימונים - גרסה מחולקת ומסודרת
 * מנהל את כל הרכיבים המודולריים ומעביר להם נתונים
 */
const WorkoutsScreen = () => {
  const workoutData = useWorkoutData();

  return (
    <View style={workoutStyles.container}>
      {/* כותרת עם סטטיסטיקות */}
      <WorkoutHeader
        showStats={workoutData.showStats}
        stats={workoutData.stats}
        onToggleStats={() => workoutData.setShowStats(!workoutData.showStats)}
      />

      {/* בקרות סינון ומיון */}
      <WorkoutFilters
        filters={workoutData.filters}
        sortBy={workoutData.sortBy}
        activeFiltersCount={workoutData.activeFiltersCount}
        onShowFilterModal={() => workoutData.setShowFilterModal(true)}
        onSortPress={workoutData.handleSortPress}
        onRemoveFilter={workoutData.removeFilter}
        getSortLabel={workoutData.getSortLabel}
      />

      {/* רשימת האימונים */}
      <WorkoutList
        workouts={workoutData.filteredWorkouts}
        isLoading={workoutData.isLoading}
        isError={workoutData.isError}
        refreshing={workoutData.refreshing}
        onRefresh={workoutData.handleRefresh}
        onWorkoutPress={workoutData.handleWorkoutPress}
        onWorkoutLongPress={workoutData.handleWorkoutLongPress}
        onStartWorkout={workoutData.handleStartWorkout}
      />

      {/* כפתור צף ומודאל סינון */}
      <WorkoutFAB
        hasWorkouts={workoutData.filteredWorkouts.length > 0}
        showFilterModal={workoutData.showFilterModal}
        filters={workoutData.filters}
        onStartWorkout={workoutData.handleStartWorkout}
        onCloseFilterModal={() => workoutData.setShowFilterModal(false)}
        onApplyFilters={workoutData.setFilters}
      />
    </View>
  );
};

export default WorkoutsScreen;
