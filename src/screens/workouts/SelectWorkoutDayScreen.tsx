// src/screens/workouts/SelectWorkoutDayScreen.tsx - ✅ Fixed all TypeScript errors

import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlans } from "../../hooks/usePlans";
import { useWorkoutStore } from "../../stores/workoutStore";
import { useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { PlanDay } from "../../types/plan";
import { Workout } from "../../types/workout";

type ScreenRouteProp = RouteProp<RootStackParamList, "SelectWorkoutDay">;

const SelectWorkoutDayScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ScreenRouteProp>();
  const { planId } = route.params;

  // ✅ Fixed: Get plan data using planId
  const { plans, isLoading } = usePlans();
  const plan = plans?.find((p) => p.id === planId);

  const startWorkout = useWorkoutStore((state) => state.startWorkout);
  const user = useUserStore((state) => state.user);

  const handleSelectDay = (day: PlanDay) => {
    if (!plan) return;

    // ✅ Fixed: Create workout object with proper typing
    const workout: Workout = {
      id: `workout_${Date.now()}`,
      name: `${plan.name} - ${day.name}`,
      date: new Date(),
      userId: user?.id || "guest",
      exercises: day.exercises.map((planEx, index) => ({
        id: `${planEx.id}_${index}`,
        name: planEx.name,
        exercise: {
          id: planEx.id,
          name: planEx.name,
          category: planEx.muscleGroup || "כללי",
        },
        sets: Array.from({ length: planEx.sets }, (_, i) => ({
          id: `${planEx.id}_set_${i}`,
          reps: planEx.reps,
          weight: planEx.weight || 0,
          status: "pending" as const,
        })),
        notes: planEx.notes,
      })),
      duration: day.estimatedDuration || 45,
      // ✅ Fixed: Type casting for difficulty
      difficulty:
        (plan.difficulty as "beginner" | "intermediate" | "advanced") ||
        "intermediate",
      targetMuscles: day.targetMuscleGroups,
    };

    startWorkout(workout, plan);
    navigation.navigate("ActiveWorkout");
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>טוען תוכנית...</Text>
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={styles.errorText}>תוכנית לא נמצאה</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>חזור לבחירת תוכנית</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const planDays = plan.days || [];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.header}>{plan.name}</Text>
      </View>

      <Text style={styles.subHeader}>בחר את האימון להיום:</Text>

      <FlatList
        data={planDays}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectDay(item)}
          >
            <View style={styles.cardContent}>
              <Text style={styles.dayTitle}>
                יום {index + 1}: {item.name}
              </Text>
              <Text style={styles.dayDetails}>
                {item.exercises?.length || 0} תרגילים
              </Text>

              {/* Preview of exercises */}
              {item.exercises && item.exercises.length > 0 && (
                <View style={styles.exercisePreview}>
                  <Text style={styles.previewTitle}>תרגילים:</Text>
                  {item.exercises.slice(0, 3).map((exercise, idx) => (
                    <Text key={idx} style={styles.previewExercise}>
                      • {exercise.name}
                    </Text>
                  ))}
                  {item.exercises.length > 3 && (
                    <Text style={styles.moreExercises}>
                      +{item.exercises.length - 3} תרגילים נוספים
                    </Text>
                  )}
                </View>
              )}
            </View>

            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="barbell-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>אין ימי אימון בתוכנית זו</Text>
            <Text style={styles.emptySubtext}>
              חזור ועריכת התוכנית כדי להוסיף אימונים
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Compensate for back button
  },
  subHeader: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    margin: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "right",
  },
  dayDetails: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "right",
    marginBottom: 12,
  },
  exercisePreview: {
    marginTop: 8,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  previewExercise: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    lineHeight: 16,
  },
  moreExercises: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default SelectWorkoutDayScreen;
