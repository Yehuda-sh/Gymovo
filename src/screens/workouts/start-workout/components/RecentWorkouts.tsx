// src/screens/workouts/start-workout/components/RecentWorkouts.tsx

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../theme/colors";
import { useRecentWorkouts } from "../hooks/useRecentWorkouts";
import { formatRelativeDate } from "../utils/dateHelpers";

interface RecentWorkoutCardProps {
  workout: {
    id: string;
    planName: string;
    dayName: string;
    date: Date;
    duration: number;
    exerciseCount: number;
  };
  onPress: () => void;
}

const RecentWorkoutCard: React.FC<RecentWorkoutCardProps> = ({
  workout,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Ionicons name="time-outline" size={16} color={colors.primary} />
      <Text style={styles.dateText}>{formatRelativeDate(workout.date)}</Text>
    </View>
    <Text style={styles.planName}>{workout.planName}</Text>
    <Text style={styles.dayName}>{workout.dayName}</Text>
    <View style={styles.cardFooter}>
      <View style={styles.stat}>
        <Ionicons
          name="barbell-outline"
          size={14}
          color="rgba(255,255,255,0.5)"
        />
        <Text style={styles.statText}>{workout.exerciseCount}</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons
          name="timer-outline"
          size={14}
          color="rgba(255,255,255,0.5)"
        />
        <Text style={styles.statText}>{workout.duration} דק&apos;</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export const RecentWorkouts: React.FC<{
  onSelectWorkout: (workout: any) => void;
}> = ({ onSelectWorkout }) => {
  const { recentWorkouts, isLoading } = useRecentWorkouts();

  if (isLoading || recentWorkouts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>אימונים אחרונים</Text>
        <Ionicons name="flame" size={20} color={colors.primary} />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentWorkouts.map((workout: any) => (
          <RecentWorkoutCard
            key={workout.id}
            workout={workout}
            onPress={() => onSelectWorkout(workout)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 160,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  dayName: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginLeft: 4,
  },
});
