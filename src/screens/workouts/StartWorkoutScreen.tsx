// src/screens/workouts/StartWorkoutScreen.tsx - ✅ All TypeScript errors fixed

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import Button from "../../components/common/Button";
import {
  CardSkeleton,
  TextSkeleton,
} from "../../components/common/LoadingSkeleton";
import { Dialog } from "../../components/common/Dialog";

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

// ✅ Helper function to handle different exercise types
const createWorkoutFromPlanExercise = (planEx: any, index: number) => {
  if ("sets" in planEx && typeof planEx.sets === "number") {
    // זה PlanExercise
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
    // זה כבר WorkoutExercise
    return planEx;
  } else {
    // fallback
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

// 🎯 רכיב כרטיס תוכנית אימון
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

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress, scaleAnim]);

  const totalExercises = useMemo(() => {
    if (plan.days) {
      return plan.days.reduce(
        (total, day) => total + (day.exercises?.length || 0),
        0
      );
    }
    if (plan.workouts) {
      return plan.workouts.reduce(
        (total, workout) => total + (workout.exercises?.length || 0),
        0
      );
    }
    return 0;
  }, [plan]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.planCard, isSelected && styles.selectedPlanCard]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          {plan.difficulty && (
            <View
              style={[
                styles.difficultyBadge,
                getDifficultyStyle(plan.difficulty),
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  getDifficultyTextStyle(plan.difficulty),
                ]}
              >
                {translateDifficulty(plan.difficulty)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.planDescription} numberOfLines={2}>
          {plan.description || "תוכנית אימון מותאמת אישית"}
        </Text>

        <View style={styles.planStats}>
          <View style={styles.statItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.statText}>
              {plan.days?.length || plan.workouts?.length || 0} ימים
            </Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="fitness-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.statText}>{totalExercises} תרגילים</Text>
          </View>
        </View>

        {plan.targetMuscleGroups && plan.targetMuscleGroups.length > 0 && (
          <View style={styles.muscleGroups}>
            {plan.targetMuscleGroups.slice(0, 3).map((muscle, index) => (
              <View key={index} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{muscle}</Text>
              </View>
            ))}
            {plan.targetMuscleGroups.length > 3 && (
              <View style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>
                  +{plan.targetMuscleGroups.length - 3}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper functions
const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return { backgroundColor: withOpacity(colors.success, 0.2) };
    case "intermediate":
      return { backgroundColor: withOpacity(colors.warning, 0.2) };
    case "advanced":
      return { backgroundColor: withOpacity(colors.danger, 0.2) };
    default:
      return { backgroundColor: withOpacity(colors.primary, 0.2) };
  }
};

const getDifficultyTextStyle = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return { color: colors.success };
    case "intermediate":
      return { color: colors.warning };
    case "advanced":
      return { color: colors.danger };
    default:
      return { color: colors.primary };
  }
};

const translateDifficulty = (difficulty: string) => {
  switch (difficulty) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "בינוני";
    case "advanced":
      return "מתקדם";
    default:
      return difficulty;
  }
};

// 📱 הקומפוננטה הראשית
const StartWorkoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUserStore();
  const { startWorkout, startCustomWorkout } = useWorkoutStore();

  // State
  const [userPlans, setUserPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedDay, setSelectedDay] = useState<PlanDay | Workout | null>(
    null
  );

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // 📚 טעינת תוכניות המשתמש
  const loadPlans = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const plans = await getPlansByUserId(user.id);
      setUserPlans(plans || []);

      // אם יש רק תוכנית אחת, בחר אותה אוטומטית
      if (plans && plans.length === 1) {
        setSelectedPlan(plans[0]);
        // אם יש רק יום/אימון אחד, בחר אותו גם
        const plan = plans[0];
        if (plan.days && plan.days.length === 1) {
          setSelectedDay(plan.days[0]);
        } else if (plan.workouts && plan.workouts.length === 1) {
          setSelectedDay(plan.workouts[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      Dialog.error("שגיאה", "לא ניתן לטעון את התוכניות");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 🔄 רענון
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPlans();
    setRefreshing(false);
  }, [loadPlans]);

  // 🎬 אתחול
  useEffect(() => {
    loadPlans();

    // אנימציית כניסה
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
    ]).start();
  }, [loadPlans, fadeAnim, slideAnim]);

  // 🎯 בחירת תוכנית
  const handleSelectPlan = useCallback((plan: Plan) => {
    setSelectedPlan(plan);
    setSelectedDay(null); // איפוס בחירת יום/אימון
  }, []);

  // 📅 בחירת יום/אימון
  const handleSelectDay = useCallback((dayOrWorkout: PlanDay | Workout) => {
    setSelectedDay(dayOrWorkout);
  }, []);

  // 🚀 התחלת אימון מעודכן
  const handleStartWorkout = useCallback(async () => {
    if (!selectedPlan) {
      Dialog.warning("בחר תוכנית", "עליך לבחור תוכנית אימון לפני שתתחיל");
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (selectedDay) {
        // אימון ספציפי נבחר
        if (
          "exercises" in selectedDay &&
          Array.isArray(selectedDay.exercises)
        ) {
          // זה PlanDay
          const workout: Workout = {
            id: `workout_${Date.now()}`,
            name: `${selectedPlan.name} - ${selectedDay.name}`,
            date: new Date(),
            userId: user?.id || "guest",
            exercises: selectedDay.exercises.map((planEx, index) =>
              createWorkoutFromPlanExercise(planEx, index)
            ),
          };
          startWorkout(workout, selectedPlan);
        } else {
          // זה Workout
          startWorkout(selectedDay as Workout, selectedPlan);
        }
      } else {
        // אם לא נבחר יום ספציפי, קח את הראשון
        if (selectedPlan.days && selectedPlan.days.length > 0) {
          const firstDay = selectedPlan.days[0];
          const workout: Workout = {
            id: `workout_${Date.now()}`,
            name: `${selectedPlan.name} - ${firstDay.name}`,
            date: new Date(),
            userId: user?.id || "guest",
            exercises: firstDay.exercises.map((planEx, index) =>
              createWorkoutFromPlanExercise(planEx, index)
            ),
          };
          startWorkout(workout, selectedPlan);
        } else if (selectedPlan.workouts && selectedPlan.workouts.length > 0) {
          startWorkout(selectedPlan.workouts[0], selectedPlan);
        } else {
          Dialog.error("תוכנית ריקה", "התוכנית הנבחרת לא מכילה אימונים");
          return;
        }
      }

      // נווט למסך האימון הפעיל
      navigation.navigate("ActiveWorkout");
    } catch (error) {
      console.error("Failed to start workout:", error);
      Dialog.error("שגיאה", "לא ניתן להתחיל את האימון");
    }
  }, [selectedPlan, selectedDay, startWorkout, navigation]);

  // 📝 יצירת תוכנית חדשה
  const handleCreatePlan = useCallback(() => {
    navigation.navigate("CreatePlan");
  }, [navigation]);

  // 🔍 בחירת תרגילים מותאמים
  const handleCustomWorkout = useCallback(() => {
    navigation.navigate("ExerciseSelection");
  }, [navigation]);

  // 🏋️ רכיב בחירת יום
  const DaySelector = ({ plan }: { plan: Plan }) => {
    const days = plan.days || [];

    if (days.length <= 1) return null;

    return (
      <View style={styles.daySelector}>
        <Text style={styles.daySelectorTitle}>בחר יום אימון:</Text>
        <FlatList
          data={days} // ✅ Fixed: רק days, לא workouts
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.dayListContent}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.dayItem,
                selectedDay?.id === item.id && styles.selectedDayItem,
              ]}
              onPress={() => handleSelectDay(item)}
            >
              <Text
                style={[
                  styles.dayItemText,
                  selectedDay?.id === item.id && styles.selectedDayItemText,
                ]}
              >
                יום {index + 1}: {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  // מצב טעינה
  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <TextSkeleton lines={2} style={{ marginBottom: 16 }} />
          <CardSkeleton style={{ marginBottom: 16, height: 120 }} />
          <CardSkeleton style={{ marginBottom: 16, height: 120 }} />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>התחל אימון</Text>
          <Text style={styles.subtitle}>בחר תוכנית או צור אימון מותאם</Text>
        </View>

        {/* Plans List */}
        <FlatList
          data={userPlans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PlanCard
              plan={item}
              onPress={() => handleSelectPlan(item)}
              isSelected={selectedPlan?.id === item.id}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="barbell-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyTitle}>אין תוכניות אימון</Text>
              <Text style={styles.emptyText}>
                צור תוכנית חדשה או התחל עם אימון מותאם
              </Text>
            </View>
          }
        />

        {/* Day Selector */}
        {selectedPlan && <DaySelector plan={selectedPlan} />}

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {selectedPlan ? (
            <Button
              title={`התחל אימון${selectedDay ? ` - ${selectedDay.name}` : ""}`}
              onPress={handleStartWorkout}
              style={styles.startButton}
            />
          ) : (
            <>
              <Button
                title="אימון מותאם"
                onPress={handleCustomWorkout}
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
              />

              <Button
                title="צור תוכנית חדשה"
                onPress={handleCreatePlan}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 16,
                  marginTop: 12,
                }}
              />
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Plan Card
  planCard: {
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
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: withOpacity(colors.primary, 0.05),
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  planStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "600",
  },
  muscleGroups: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  muscleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderRadius: 6,
  },
  muscleTagText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: "500",
  },

  // Day Selector
  daySelector: {
    marginTop: 16,
  },
  daySelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  dayListContent: {
    gap: 8,
  },
  dayItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDayItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayItemText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  selectedDayItemText: {
    color: "white",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  // Bottom Section
  bottomSection: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
  },
});

export default StartWorkoutScreen;
