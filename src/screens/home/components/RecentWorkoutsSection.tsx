// src/screens/home/components/RecentWorkoutsSection.tsx
// קטע אימונים אחרונים עם רשימה

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";

import { Spacer, Typography } from "../../../components/ui";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData } from "../types";
import EmptyState from "./EmptyState";
import WorkoutCard from "./WorkoutCard";

interface RecentWorkoutsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Section component for displaying recent workouts or empty state
 */
const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();

  // אם אין אימונים אחרונים
  if (!dashboardData?.recentWorkouts.length) {
    return <EmptyState />;
  }

  return (
    <View>
      <Typography variant="h3">אימונים אחרונים</Typography>
      <Spacer size="md" />

      {dashboardData.recentWorkouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onPress={() =>
            navigation.navigate("WorkoutSummary", {
              workoutData: workout,
            })
          }
        />
      ))}

      {/* Spacing for tab bar */}
      <View style={{ height: 100 }} />
    </View>
  );
};

export default RecentWorkoutsSection;
