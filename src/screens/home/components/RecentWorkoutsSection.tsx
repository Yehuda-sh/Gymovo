// src/screens/home/components/RecentWorkoutsSection.tsx
// קטע אימונים אחרונים עם גרדיאנט

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../../types/navigation";
import { DashboardData } from "../types";

interface RecentWorkoutsSectionProps {
  dashboardData: DashboardData | null;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RecentWorkoutsSection: React.FC<RecentWorkoutsSectionProps> = ({
  dashboardData,
}) => {
  const navigation = useNavigation<NavigationProp>();

  if (!dashboardData?.recentWorkouts?.length) {
    return (
      <View style={styles.emptyContainer}>
        <LinearGradient
          colors={["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.1)"]}
          style={styles.emptyGradient}
        >
          <Ionicons name="barbell-outline" size={32} color="#667eea" />
          <Text style={styles.emptyText}>עדיין אין אימונים</Text>
          <Text style={styles.emptySubtext}>התחל אימון ראשון!</Text>
        </LinearGradient>
      </View>
    );
  }

  const recentWorkouts = dashboardData.recentWorkouts.slice(0, 2);

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Main", { screen: "Workouts" });
  };

  const handleWorkoutPress = (workout: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // תיקון: שליחת הפרמטר הנכון
    navigation.navigate("WorkoutSummary", {
      workout: workout,
      workoutData: workout, // תאימות לאחור
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>אימונים אחרונים</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>הצג הכל</Text>
        </TouchableOpacity>
      </View>

      {recentWorkouts.map((workout, index) => (
        <TouchableOpacity
          key={workout.id}
          style={styles.workoutCard}
          onPress={() => handleWorkoutPress(workout)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["rgba(102, 126, 234, 0.15)", "rgba(118, 75, 162, 0.1)"]}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDate}>
                  {new Date(workout.date || "").toLocaleDateString("he-IL")}
                </Text>
              </View>
              <View style={styles.cardRight}>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={14} color="#667eea" />
                  <Text style={styles.statText}>
                    {workout.duration || 0} דק&apos;
                  </Text>
                </View>
                {workout.rating && (
                  <View style={styles.statItem}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={styles.statText}>{workout.rating}</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  viewAllText: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "500",
  },
  workoutCard: {
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardGradient: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    flex: 1,
  },
  workoutName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  cardRight: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  emptyContainer: {
    paddingHorizontal: 16,
  },
  emptyGradient: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
});

export default RecentWorkoutsSection;
