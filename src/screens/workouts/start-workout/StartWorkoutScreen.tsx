// src/ceenrss / workouts / start - workout / StartWorkoutScreen.tsx;

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
import {
  PlanCard,
  DayCard,
  EmptyState,
  PlansLoadingSkeleton,
  RecentWorkouts,
  WorkoutSuggestion,
  WorkoutErrorBoundary,
} from "./components";

// Hooks
import {
  usePlans,
  useWorkoutStart,
  useWorkoutAnimations,
  useOfflineMode,
} from "./hooks";

// Data & Services
import { colors } from "../../../theme/colors";
import { RootStackParamList } from "../../../types/navigation";
import { Plan, PlanDay } from "../../../types/plan";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Main Component wrapped with Error Boundary
const StartWorkoutScreenContent = () => {
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

  const { fadeAnim, getAnimatedStyle, animatePress } = useWorkoutAnimations();
  const { isOffline } = useOfflineMode();

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

  // Handle recent workout selection
  const handleRecentWorkoutSelect = (workout: any) => {
    // Find the plan and day
    const plan = plans.find((p: any) => p.id === workout.planId);
    if (plan) {
      const day = plan.days?.find((d: any) => d.id === workout.dayId);
      if (day) {
        handlePlanSelect(plan);
        handleDaySelect(day);
      }
    }
  };

  // Handle suggestion accept
  const handleSuggestionAccept = (suggestion: any) => {
    const plan = plans.find((p: any) => p.id === suggestion.planId);
    if (plan) {
      const day = plan.days?.find((d: any) => d.id === suggestion.dayId);
      if (day) {
        handlePlanSelect(plan);
        handleDaySelect(day);
        // Auto-start after a delay
        setTimeout(() => {
          handleStartWorkout();
        }, 500);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0a0a", "#1a1a1a"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Offline Banner */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons name="cloud-offline" size={16} color="white" />
          <Text style={styles.offlineText}>אין חיבור לאינטרנט</Text>
        </View>
      )}

      {/* Header */}
      <Animated.View
        style={[styles.header, getAnimatedStyle({ rotate: false })]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            animatePress();
            navigation.goBack();
          }}
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
        <PlansLoadingSkeleton />
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
          {/* Smart Suggestion */}
          <WorkoutSuggestion onAccept={handleSuggestionAccept} />

          {/* Recent Workouts */}
          <RecentWorkouts onSelectWorkout={handleRecentWorkoutSelect} />

          {/* Plans list */}
          {plans.map((plan: any, index: any) => (
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
                {selectedPlan.days?.map((day: any, idx: any) => (
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
            style={styles.startButton}
            onPress={handleStartWorkout}
            disabled={isStarting}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButtonGradient}
            >
              {isStarting ? (
                <Text style={styles.startButtonText}>מתחיל...</Text>
              ) : (
                <>
                  <Text style={styles.startButtonText}>התחל אימון</Text>
                  <Ionicons name="play-circle" size={24} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.customWorkoutButton}
              onPress={handleCustomWorkout}
            >
              <LinearGradient
                colors={["rgba(59, 130, 246, 0.3)", "rgba(147, 51, 234, 0.3)"]}
                style={styles.customWorkoutGradient}
              >
                <Ionicons name="add-circle-outline" size={22} color="white" />
                <Text style={styles.customWorkoutText}>אימון מותאם אישית</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createPlanButton}
              onPress={handleCreatePlan}
            >
              <View style={styles.createPlanContent}>
                <Ionicons
                  name="create-outline"
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

// Export with Error Boundary
const StartWorkoutScreen = () => (
  <WorkoutErrorBoundary>
    <StartWorkoutScreenContent />
  </WorkoutErrorBoundary>
);

// Styles remain the same as original
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  offlineBanner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 1000,
  },
  offlineText: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 180,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
  },
  daySelector: {
    marginTop: 24,
  },
  daySelectorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  dayListContent: {
    paddingHorizontal: 20,
  },
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
