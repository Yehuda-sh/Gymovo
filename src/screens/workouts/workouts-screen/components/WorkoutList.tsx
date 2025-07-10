// src/screens/workouts/workouts-screen/components/WorkoutList.tsx
// רשימת אימונים עם מצבי טעינה, ריק ושגיאה

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  EmptyState,
  WorkoutCard,
  modernColors,
} from "../../../../components/workout-history";
import { Workout } from "../../../../types/workout";
import { workoutStyles } from "../styles";

interface WorkoutListProps {
  workouts: Workout[];
  isLoading: boolean;
  isError: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  onWorkoutPress: (workout: Workout) => void;
  onWorkoutLongPress: (workout: Workout) => void;
  onStartWorkout: () => void;
}

/**
 * רשימת אימונים עם תמיכה במצבי טעינה, ריק ושגיאה
 * מנהלת את הצגת האימונים ואינטראקציות המשתמש
 */
export const WorkoutList: React.FC<WorkoutListProps> = ({
  workouts,
  isLoading,
  isError,
  refreshing,
  onRefresh,
  onWorkoutPress,
  onWorkoutLongPress,
  onStartWorkout,
}) => {
  // רכיב עבור רינדור כל אימון ברשימה
  const renderWorkout = useCallback(
    ({ item, index }: { item: Workout; index: number }) => (
      <WorkoutCard
        workout={item}
        onPress={() => onWorkoutPress(item)}
        onLongPress={() => onWorkoutLongPress(item)}
        index={index}
      />
    ),
    [onWorkoutPress, onWorkoutLongPress]
  );

  // מסך שגיאה במקרה של בעיה בטעינת הנתונים
  if (isError) {
    return (
      <View style={workoutStyles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color={modernColors.danger} />
        <Text style={workoutStyles.errorTitle}>אופס!</Text>
        <Text style={workoutStyles.errorMessage}>
          משהו השתבש בטעינת האימונים
        </Text>
        <TouchableOpacity
          style={workoutStyles.retryButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onRefresh();
          }}
        >
          <Text style={workoutStyles.retryButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // מסך טעינה
  if (isLoading) {
    return (
      <View style={workoutStyles.loadingContainer}>
        <ActivityIndicator size="large" color={modernColors.primary} />
        <Text style={workoutStyles.loadingText}>טוען אימונים...</Text>
      </View>
    );
  }

  // מסך ריק אם אין אימונים
  if (workouts.length === 0) {
    return <EmptyState onStartWorkout={onStartWorkout} />;
  }

  // רשימת האימונים
  return (
    <FlatList
      data={workouts}
      renderItem={renderWorkout}
      keyExtractor={(item) => item.id}
      contentContainerStyle={workoutStyles.listContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={modernColors.primary}
          colors={[modernColors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
};
