// src/screens/workouts/StartWorkoutScreen.tsx
// מסך התחלת אימון - עיצוב משופר עם אנימציות וחוויית משתמש מתקדמת

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";

// Components
import { CardSkeleton } from "../../components/common/LoadingSkeleton";

// Data & Services
import { getPlansByUserId } from "../../data/storage";
import { useUserStore } from "../../stores/userStore";
import { useWorkoutStore } from "../../stores/workoutStore";

// Types & Utils
import { colors, withOpacity } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan, PlanDay } from "../../types/plan";
import { Workout } from "../../types/workout";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Helper function to handle different exercise types
const createWorkoutFromPlanExercise = (planEx: any, index: number) => {
  if ("sets" in planEx && typeof planEx.sets === "number") {
    return {
      id: `${planEx.id}_${index}`,
      name: planEx.name,
      exercise: {
        id: planEx.id,
        name: planEx.name,
        category: planEx.muscleGroup || "כללי",
      },
      sets: Array.from({ length: planEx.sets }, (_, i) => ({
        id: `${planEx.id}_set_${i}`,
        reps: planEx.reps || 10,
        weight: planEx.weight || 0,
        status: "pending" as const,
      })),
    };
  } else if ("sets" in planEx && Array.isArray(planEx.sets)) {
    return planEx;
  } else {
    return {
      id: `${planEx.id}_${index}`,
      name: planEx.name,
      exercise: {
        id: planEx.id,
        name: planEx.name,
        category: "כללי",
      },
      sets: Array.from({ length: 3 }, (_, i) => ({
        id: `${planEx.id}_set_${i}`,
        reps: 10,
        weight: 0,
        status: "pending" as const,
      })),
    };
  }
};

// 🎯 רכיב כרטיס תוכנית אימון משופר
const PlanCard = ({
  plan,
  onPress,
  isSelected = false,
}: {
  plan: Plan;
  onPress: () => void;
  isSelected?: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: -1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "#4CAF50";
      case "intermediate":
        return "#FF9800";
      case "advanced":
        return "#F44336";
      default:
        return colors.primary;
    }
  };

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          {
            rotate: rotateAnim.interpolate({
              inputRange: [-1, 0, 1],
              outputRange: ["-1deg", "0deg", "1deg"],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={
            isSelected
              ? [colors.primary, colors.primaryDark]
              : ["#1e1e1e", "#2a2a2a"]
          }
          style={styles.planCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Glow effect when selected */}
          {isSelected && (
            <View style={styles.glowEffect}>
              <LinearGradient
                colors={[withOpacity(colors.primary, 0.3), "transparent"]}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          )}

          {/* Header */}
          <View style={styles.planHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.description && (
                <Text style={styles.planDescription} numberOfLines={2}>
                  {plan.description}
                </Text>
              )}
            </View>

            {/* Difficulty Badge */}
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor: withOpacity(
                    getDifficultyColor(plan.difficulty),
                    0.2
                  ),
                },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(plan.difficulty) },
                ]}
              >
                {plan.difficulty === "beginner"
                  ? "מתחיל"
                  : plan.difficulty === "intermediate"
                  ? "מתקדם"
                  : "מומחה"}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.statValue}>
                {plan.durationWeeks || plan.days?.length || 4}
              </Text>
              <Text style={styles.statLabel}>שבועות</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="barbell" size={16} color="#666" />
              <Text style={styles.statValue}>{plan.days?.length || 0}</Text>
              <Text style={styles.statLabel}>ימי אימון</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.statValue}>{45}</Text>
              <Text style={styles.statLabel}>דקות</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.statValue}>{plan.rating || 4.5}</Text>
              <Text style={styles.statLabel}>דירוג</Text>
            </View>
          </View>

          {/* Muscle Groups */}
          {plan.tags && plan.tags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.muscleGroupsScroll}
            >
              <View style={styles.muscleGroups}>
                {plan.tags.map((tag: string, index: number) => (
                  <View key={index} style={styles.muscleTag}>
                    <Text style={styles.muscleTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <View style={styles.selectionIndicator}>
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🏃 רכיב כרטיס יום אימון
const DayCard = ({
  day,
  isSelected,
  onPress,
}: {
  day: PlanDay;
  isSelected: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <LinearGradient
          colors={
            isSelected
              ? [colors.primary, colors.primaryDark]
              : ["#2a2a2a", "#1e1e1e"]
          }
          style={styles.dayItem}
        >
          <Text
            style={[
              styles.dayItemText,
              isSelected && styles.selectedDayItemText,
            ]}
          >
            {day.name}
          </Text>
          <Text
            style={[styles.dayExerciseCount, isSelected && { color: "white" }]}
          >
            {day.exercises.length} תרגילים
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Main Component
const StartWorkoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const startWorkout = useWorkoutStore((state) => state.startWorkout);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedDay, setSelectedDay] = useState<PlanDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerScale = useRef(new Animated.Value(0.8)).current;

  // Load plans
  const loadPlans = useCallback(async () => {
    if (!user?.id) return;

    try {
      const userPlans = await getPlansByUserId(user.id);
      setPlans(userPlans);
    } catch (error) {
      console.error("Failed to load plans:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadPlans();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        delay: 200,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [user?.id]);

  // Handle start workout
  const handleStartWorkout = () => {
    if (!selectedPlan || !selectedDay) {
      Alert.alert("שגיאה", "יש לבחור תוכנית ויום אימון");
      return;
    }

    const workout: Workout = {
      id: `workout_${Date.now()}`,
      name: `${selectedPlan.name} - ${selectedDay.name}`,
      date: new Date(),
      planId: selectedPlan.id,
      planDayId: selectedDay.id,
      userId: user?.id || "guest",
      exercises: selectedDay.exercises.map((planEx, index) =>
        createWorkoutFromPlanExercise(planEx, index)
      ),
    };

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    startWorkout(workout, selectedPlan);
    navigation.navigate("ActiveWorkout");
  };

  // Handle custom workout
  const handleCustomWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("ExerciseSelection");
  };

  // Handle create plan
  const handleCreatePlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("CreateOrEditPlan", {});
  };

  // Refresh handler
  const onRefresh = () => {
    setIsRefreshing(true);
    loadPlans();
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={["#0a0a0a", "#1a1a1a"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: headerScale }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BlurView intensity={50} tint="dark" style={styles.backButtonBlur}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.title}>התחל אימון</Text>
          <Text style={styles.subtitle}>בחר תוכנית או צור אימון מותאם</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Loading state */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            {[1, 2, 3].map((i) => (
              <CardSkeleton key={i} height={200} style={{ marginBottom: 16 }} />
            ))}
          </View>
        ) : plans.length === 0 ? (
          // Empty state
          <View style={styles.emptyState}>
            <LinearGradient
              colors={[withOpacity(colors.primary, 0.2), "transparent"]}
              style={styles.emptyIconContainer}
            >
              <Ionicons
                name="barbell-outline"
                size={80}
                color={colors.primary}
              />
            </LinearGradient>
            <Text style={styles.emptyTitle}>אין תוכניות אימון</Text>
            <Text style={styles.emptyText}>
              צור תוכנית חדשה או בחר אימון מותאם אישית
            </Text>
          </View>
        ) : (
          // Plans list
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
          >
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
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedPlan(plan);
                    setSelectedDay(null);
                  }}
                  isSelected={selectedPlan?.id === plan.id}
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
                  {selectedPlan.days?.map((day) => (
                    <DayCard
                      key={day.id}
                      day={day}
                      isSelected={selectedDay?.id === day.id}
                      onPress={() => setSelectedDay(day)}
                    />
                  ))}
                </ScrollView>
              </Animated.View>
            )}
          </ScrollView>
        )}

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          {selectedPlan && selectedDay ? (
            <TouchableOpacity
              onPress={handleStartWorkout}
              style={styles.startButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.startButtonGradient}
              >
                <Ionicons name="play-circle" size={24} color="white" />
                <Text style={styles.startButtonText}>
                  התחל אימון - {selectedDay.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleCustomWorkout}
                style={styles.customWorkoutButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#8B5CF6", "#7C3AED"]}
                  style={styles.customWorkoutGradient}
                >
                  <Ionicons name="fitness" size={24} color="white" />
                  <Text style={styles.customWorkoutText}>
                    אימון מותאם אישית
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreatePlan}
                style={styles.createPlanButton}
                activeOpacity={0.8}
              >
                <View style={styles.createPlanContent}>
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={colors.primary}
                  />
                  <Text style={styles.createPlanText}>צור תוכנית חדשה</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 11,
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  headerContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "white",
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },

  // Loading
  loadingContainer: {
    paddingTop: 20,
  },

  // Plan Card
  planCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: "relative",
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  planDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
  },

  // Muscle Groups
  muscleGroupsScroll: {
    marginTop: 8,
    marginHorizontal: -4,
  },
  muscleGroups: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  muscleTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  muscleTagText: {
    fontSize: 12,
    color: "#ccc",
    fontWeight: "500",
  },

  // Selection
  selectionIndicator: {
    position: "absolute",
    top: 16,
    right: 16,
  },

  // Day Selector
  daySelector: {
    marginTop: 24,
    marginBottom: 100,
  },
  daySelectorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  dayListContent: {
    gap: 12,
  },
  dayItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    minWidth: 120,
    alignItems: "center",
  },
  dayItemText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "600",
    marginBottom: 2,
  },
  selectedDayItemText: {
    color: "white",
  },
  dayExerciseCount: {
    fontSize: 12,
    color: "#666",
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
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
