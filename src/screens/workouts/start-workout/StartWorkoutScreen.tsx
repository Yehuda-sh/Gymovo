// src/screens/workouts/start-workout/StartWorkoutScreen.tsx
// מסך התחלת אימון - גרסה מעודכנת עם custom hooks

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

// Components
import { CardSkeleton } from "../../../components/common/LoadingSkeleton";
import { PlanCard, DayCard, EmptyState } from "./components";

// Hooks
import { usePlans, useWorkoutStart, useWorkoutAnimations } from "./hooks";

// Data & Services
import { colors } from "../../../theme/colors";
import { RootStackParamList } from "../../../types/navigation";
import { Plan, PlanDay } from "../../../types/plan";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Main Component
const StartWorkoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Custom hooks
  const {
    plans,
    isLoading,
    isRefreshing,
    error,
    selectedPlan,
    refresh,
    selectPlan,
  } = usePlans();

  const { isStarting, startWorkout, startQuickWorkout, canStartWorkout } =
    useWorkoutStart();

  const { fadeAnim, getAnimatedStyle } = useWorkoutAnimations();

  // Local state
  const [selectedDay, setSelectedDay] = useState<PlanDay | null>(null);

  // Handle plan selection
  const handlePlanSelect = (plan: Plan) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    selectPlan(plan);
    setSelectedDay(null);
  };

  // Handle day selection
  const handleDaySelect = (day: PlanDay) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDay(day);
  };

  // Start workout
  const handleStartWorkout = async () => {
    if (!selectedPlan || !selectedDay) {
      Alert.alert("שגיאה", "יש לבחור תוכנית ויום אימון");
      return;
    }

    await startWorkout(selectedPlan, selectedDay);
  };

  // Custom workout
  const handleCustomWorkout = () => {
    navigation.navigate("ExercisesPicker", {
      onSelect: async (exercises: any[]) => {
        // Convert Exercise[] to WorkoutExercise[]
        const workoutExercises = exercises.map((exercise, index) => ({
          id: `${exercise.id}_${index}`,
          name: exercise.name,
          exercise: {
            id: exercise.id,
            name: exercise.name,
            category: exercise.category || "כללי",
          },
          sets: Array.from({ length: 3 }, (_, i) => ({
            id: `${exercise.id}_set_${i}`,
            reps: 10,
            weight: 0,
            status: "pending" as const,
          })),
        }));
        await startQuickWorkout(workoutExercises);
      },
    });
  };

  // Create new plan
  const handleCreatePlan = () => {
    navigation.navigate("CreateOrEditPlan", {});
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0a0a", "#1a1a1a"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View
        style={[styles.header, getAnimatedStyle({ rotate: false })]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>התחל אימון</Text>
          <Text style={styles.headerSubtitle}>בחר תוכנית ויום אימון</Text>
        </View>

        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Content */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={refresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>נסה שוב</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : plans.length === 0 ? (
        <EmptyState
          onCreatePlan={handleCreatePlan}
          onStartQuickWorkout={handleCustomWorkout}
        />
      ) : (
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Plans list */}
          {plans.map((plan, index) => (
            <Animated.View
              key={plan.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }}
            >
              <PlanCard
                plan={plan}
                onPress={() => handlePlanSelect(plan)}
                isSelected={selectedPlan?.id === plan.id}
                index={index}
              />
            </Animated.View>
          ))}

          {/* Day selector */}
          {selectedPlan && (
            <Animated.View
              style={[
                styles.daySelector,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.daySelectorTitle}>בחר יום אימון</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dayListContent}
              >
                {selectedPlan.days?.map((day, idx) => (
                  <DayCard
                    key={day.id}
                    day={day}
                    isSelected={selectedDay?.id === day.id}
                    onPress={() => handleDaySelect(day)}
                    index={idx}
                  />
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </ScrollView>
      )}

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {canStartWorkout(selectedPlan, selectedDay) ? (
          <TouchableOpacity
            onPress={handleStartWorkout}
            style={styles.startButton}
            disabled={isStarting}
          >
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.startButtonGradient}
            >
              {isStarting ? (
                <Text style={styles.startButtonText}>מתחיל...</Text>
              ) : (
                <>
                  <Ionicons name="play" size={24} color="white" />
                  <Text style={styles.startButtonText}>התחל אימון</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              onPress={handleCustomWorkout}
              style={styles.customWorkoutButton}
            >
              <LinearGradient
                colors={["#2a2a2a", "#1e1e1e"]}
                style={styles.customWorkoutGradient}
              >
                <Ionicons name="fitness" size={20} color="white" />
                <Text style={styles.customWorkoutText}>אימון מותאם אישית</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreatePlan}
              style={styles.createPlanButton}
            >
              <View style={styles.createPlanContent}>
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.createPlanText}>צור תוכנית חדשה</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Header
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 180,
  },

  // Day Selector
  daySelector: {
    marginTop: 24,
  },
  daySelectorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  dayListContent: {
    paddingRight: 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    padding: 20,
  },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: "white",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Bottom Section
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  startButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.5,
  },
  customWorkoutButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  customWorkoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  customWorkoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  createPlanButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  createPlanContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  createPlanText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
});

export default StartWorkoutScreen;
