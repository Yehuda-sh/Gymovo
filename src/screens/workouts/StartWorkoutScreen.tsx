// src/screens/workouts/StartWorkoutScreen.tsx - מעודכן עם workoutStore החדש

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
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
  StatsGridSkeleton,
  PlanCardSkeleton,
} from "../../components/common/LoadingSkeleton";

// Data & Services
import { getPlansByUserId } from "../../data/storage";
import { useUserStore } from "../../stores/userStore";
import { useWorkoutStore } from "../../stores/workoutStore";

// Types & Utils
import { colors, withOpacity } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan, PlanDay } from "../../types/plan";
import { Workout } from "../../types/workout";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 🎯 רכיב כרטיס תוכנית אימון מעודכן
const PlanCard = ({
  plan,
  onPress,
  isSelected = false,
}: {
  plan: Plan;
  onPress: () => void;
  isSelected?: boolean;
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // חישוב סטטיסטיקות התוכנית - תמיכה בשני פורמטים
  const planStats = useMemo(() => {
    if (plan.days && plan.days.length > 0) {
      // פורמט חדש עם days
      const totalExercises = plan.days.reduce(
        (total, day) => total + (day.exercises?.length || 0),
        0
      );
      const avgDuration =
        plan.days.reduce(
          (total, day) => total + (day.estimatedDuration || 45),
          0
        ) / plan.days.length;

      return {
        workouts: plan.days.length,
        exercises: totalExercises,
        avgDuration: Math.round(avgDuration),
        format: "days" as const,
      };
    } else if (plan.workouts && plan.workouts.length > 0) {
      // פורמט ישן עם workouts
      const totalExercises = plan.workouts.reduce(
        (total, workout) => total + (workout.exercises?.length || 0),
        0
      );
      const avgDuration =
        plan.workouts.reduce(
          (total, workout) => total + (workout.duration || 45),
          0
        ) / plan.workouts.length;

      return {
        workouts: plan.workouts.length,
        exercises: totalExercises,
        avgDuration: Math.round(avgDuration),
        format: "workouts" as const,
      };
    } else {
      // ברירת מחדל
      return {
        workouts: 0,
        exercises: 0,
        avgDuration: 45,
        format: "empty" as const,
      };
    }
  }, [plan]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[
          styles.planCard,
          isSelected && styles.selectedPlanCard,
          { borderColor: isSelected ? colors.primary : colors.border },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.planHeader}>
          <View style={styles.planMainInfo}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planDescription} numberOfLines={2}>
              {plan.description || "תוכנית אימון מותאמת אישית"}
            </Text>
          </View>

          {/* Difficulty Badge */}
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(plan.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>
              {getDifficultyText(plan.difficulty)}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.planStats}>
          <View style={styles.planStat}>
            <Ionicons name="calendar" size={16} color={colors.primary} />
            <Text style={styles.planStatText}>
              {planStats.workouts}{" "}
              {planStats.format === "days" ? "ימים" : "אימונים"}
            </Text>
          </View>

          <View style={styles.planStat}>
            <Ionicons name="barbell" size={16} color={colors.primary} />
            <Text style={styles.planStatText}>
              {planStats.exercises} תרגילים
            </Text>
          </View>

          <View style={styles.planStat}>
            <Ionicons name="time" size={16} color={colors.primary} />
            <Text style={styles.planStatText}>{planStats.avgDuration} דק׳</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.planFooter}>
          <View style={styles.planTags}>
            {plan.targetMuscleGroups?.slice(0, 2).map((muscle, index) => (
              <View key={index} style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>{muscle}</Text>
              </View>
            ))}
            {(plan.targetMuscleGroups?.length || 0) > 2 && (
              <View style={styles.muscleTag}>
                <Text style={styles.muscleTagText}>
                  +{(plan.targetMuscleGroups?.length || 0) - 2}
                </Text>
              </View>
            )}
          </View>

          {isSelected && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.primary}
            />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🚀 רכיב פעולה מהירה מעודכן
const QuickActionCard = ({
  title,
  subtitle,
  icon,
  color,
  onPress,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <TouchableOpacity
    style={[
      styles.quickActionCard,
      disabled && styles.disabledCard,
      {
        backgroundColor: withOpacity(color, 0.1),
        borderColor: withOpacity(color, 0.2),
      },
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
  >
    <View
      style={[
        styles.quickActionIcon,
        { backgroundColor: withOpacity(color, 0.2) },
      ]}
    >
      <Ionicons
        name={icon}
        size={24}
        color={disabled ? colors.textSecondary : color}
      />
    </View>
    <Text style={[styles.quickActionTitle, disabled && styles.disabledText]}>
      {title}
    </Text>
    <Text style={[styles.quickActionSubtitle, disabled && styles.disabledText]}>
      {subtitle}
    </Text>
  </TouchableOpacity>
);

// 📊 רכיב סטטיסטיקות מהירות
const QuickStats = ({ plans }: { plans: Plan[] }) => {
  const stats = useMemo(() => {
    const totalPlans = plans.length;
    const totalWorkouts = plans.reduce((total, plan) => {
      if (plan.days) return total + plan.days.length;
      if (plan.workouts) return total + plan.workouts.length;
      return total;
    }, 0);

    const activePlans = plans.filter((plan) => plan.isActive).length;

    return { totalPlans, totalWorkouts, activePlans };
  }, [plans]);

  return (
    <View style={styles.quickStatsContainer}>
      <View style={styles.quickStatItem}>
        <Text style={styles.quickStatNumber}>{stats.totalPlans}</Text>
        <Text style={styles.quickStatLabel}>תוכניות</Text>
      </View>
      <View style={styles.quickStatItem}>
        <Text style={styles.quickStatNumber}>{stats.totalWorkouts}</Text>
        <Text style={styles.quickStatLabel}>אימונים</Text>
      </View>
      <View style={styles.quickStatItem}>
        <Text style={styles.quickStatNumber}>{stats.activePlans}</Text>
        <Text style={styles.quickStatLabel}>פעילות</Text>
      </View>
    </View>
  );
};

// 🏋️ המסך הראשי - מעודכן
const StartWorkoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const { startWorkout, activeWorkout } = useWorkoutStore();

  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedDay, setSelectedDay] = useState<PlanDay | Workout | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animations
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // 📊 טעינת תוכניות
  const loadPlans = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const userPlans = await getPlansByUserId(user.id);
      setPlans(userPlans);

      // אם יש רק תוכנית אחת, בחר אותה אוטומטית
      if (userPlans.length === 1) {
        setSelectedPlan(userPlans[0]);
        // אם יש רק יום/אימון אחד, בחר אותו גם
        const plan = userPlans[0];
        if (plan.days && plan.days.length === 1) {
          setSelectedDay(plan.days[0]);
        } else if (plan.workouts && plan.workouts.length === 1) {
          setSelectedDay(plan.workouts[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load plans:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את התוכניות");
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
  }, [loadPlans]);

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
      Alert.alert("בחר תוכנית", "עליך לבחור תוכנית אימון לפני שתתחיל");
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
            date: new Date().toISOString(),
            exercises: selectedDay.exercises.map((planEx, index) => ({
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
            })),
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
            date: new Date().toISOString(),
            exercises: firstDay.exercises.map((planEx, index) => ({
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
            })),
          };
          startWorkout(workout, selectedPlan);
        } else if (selectedPlan.workouts && selectedPlan.workouts.length > 0) {
          startWorkout(selectedPlan.workouts[0], selectedPlan);
        } else {
          Alert.alert("תוכנית ריקה", "התוכנית הנבחרת לא מכילה אימונים");
          return;
        }
      }

      // נווט למסך האימון הפעיל
      navigation.navigate("ActiveWorkout");
    } catch (error) {
      console.error("Failed to start workout:", error);
      Alert.alert("שגיאה", "לא ניתן להתחיל את האימון");
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

  // 🔄 המשך אימון קיים
  const handleContinueWorkout = useCallback(() => {
    navigation.navigate("ActiveWorkout");
  }, [navigation]);

  // רכיב בחירת יום/אימון
  const DaySelector = () => {
    if (!selectedPlan) return null;

    const items = selectedPlan.days || selectedPlan.workouts || [];
    if (items.length <= 1) return null;

    return (
      <View style={styles.daySelector}>
        <Text style={styles.daySelectorTitle}>בחר יום/אימון:</Text>
        <FlatList
          horizontal
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
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
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dayListContent}
        />
      </View>
    );
  };

  // ⏳ מסך טעינה
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>התחל אימון</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.loadingContainer}>
          <StatsGridSkeleton columns={3} />
          <PlanCardSkeleton style={{ marginTop: 20 }} />
          <PlanCardSkeleton style={{ marginTop: 12 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>התחל אימון</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => {
            /* הוסף עזרה */
          }}
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* אימון פעיל */}
        {activeWorkout && (
          <View style={styles.activeWorkoutBanner}>
            <View style={styles.activeWorkoutInfo}>
              <Text style={styles.activeWorkoutTitle}>יש לך אימון פעיל</Text>
              <Text style={styles.activeWorkoutSubtitle}>
                {activeWorkout.name}
              </Text>
            </View>
            <Button
              title="המשך"
              onPress={handleContinueWorkout}
              style={styles.continueButton}
              textStyle={styles.continueButtonText}
            />
          </View>
        )}

        {/* סטטיסטיקות מהירות */}
        {plans.length > 0 && (
          <View style={styles.section}>
            <QuickStats plans={plans} />
          </View>
        )}

        {/* פעולות מהירות */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>פעולות מהירות</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              title="אימון מותאם"
              subtitle="בחר תרגילים"
              icon="fitness"
              color={colors.primary}
              onPress={handleCustomWorkout}
            />
            <QuickActionCard
              title="תוכנית חדשה"
              subtitle="צור תוכנית"
              icon="add-circle"
              color={colors.accent}
              onPress={handleCreatePlan}
            />
          </View>
        </View>

        {/* תוכניות קיימות */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>התוכניות שלי</Text>
            <Text style={styles.sectionSubtitle}>
              {plans.length} תוכניות זמינות
            </Text>
          </View>

          {plans.length === 0 ? (
            // Empty state
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
          ) : (
            <>
              <FlatList
                data={plans}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <PlanCard
                    plan={item}
                    isSelected={selectedPlan?.id === item.id}
                    onPress={() => handleSelectPlan(item)}
                  />
                )}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor={colors.primary}
                  />
                }
              />

              {/* בחירת יום/אימון */}
              <DaySelector />
            </>
          )}
        </View>
      </Animated.View>

      {/* כפתור התחלה */}
      {selectedPlan && (
        <View style={styles.bottomSection}>
          <Button
            title={
              selectedDay
                ? `התחל: ${selectedDay.name}`
                : `התחל: ${selectedPlan.name}`
            }
            onPress={handleStartWorkout}
            style={styles.startButton}
            textStyle={styles.startButtonText}
          />
        </View>
      )}
    </View>
  );
};

// פונקציות עזר
const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
    case "קל":
      return colors.success;
    case "medium":
    case "בינוני":
      return colors.warning;
    case "hard":
    case "קשה":
      return colors.error;
    default:
      return colors.primary;
  }
};

const getDifficultyText = (difficulty?: string) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "קל";
    case "medium":
      return "בינוני";
    case "hard":
      return "קשה";
    default:
      return difficulty || "בינוני";
  }
};

// 🎨 עיצוב מעודכן
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  helpButton: {
    padding: 8,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
  },

  // Active Workout Banner
  activeWorkoutBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: withOpacity(colors.primary, 0.1),
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activeWorkoutInfo: {
    flex: 1,
  },
  activeWorkoutTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  activeWorkoutSubtitle: {
    fontSize: 14,
    color: colors.text,
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Quick Stats
  quickStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
  },
  quickStatItem: {
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  quickStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  disabledCard: {
    opacity: 0.6,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  disabledText: {
    color: colors.textSecondary,
  },

  // Plan Cards
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlanCard: {
    backgroundColor: withOpacity(colors.primary, 0.05),
  },
  planHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  planMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: withOpacity(colors.primary, 0.05),
    borderRadius: 8,
  },
  planStat: {
    alignItems: "center",
    gap: 4,
  },
  planStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  planFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTags: {
    flexDirection: "row",
    gap: 8,
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
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default StartWorkoutScreen;
