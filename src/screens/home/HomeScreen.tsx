// src/screens/home/HomeScreen.tsx - Dashboard מקצועי ומלא

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import {
  ExerciseListSkeleton,
  StatsGridSkeleton,
  PlanCardSkeleton,
} from "../../components/common/LoadingSkeleton";

// Services & Stores
import { getPlansByUserId, getWorkoutHistory } from "../../data/storage";
import { UserPreferencesService } from "../../services/userPreferences";
import { useUserStore } from "../../stores/userStore";

// Types & Utils
import { colors, withOpacity } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Plan } from "../../types/plan";
import { Workout } from "../../types/workout";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// 📊 ממשק נתוני הדשבורד
interface DashboardData {
  recentWorkouts: Workout[];
  activePlans: Plan[];
  weeklyStats: {
    completedWorkouts: number;
    totalWeightLifted: number;
    totalDuration: number;
    streak: number;
  };
  todaysWorkout?: Plan;
}

// 🎯 רכיב כרטיס מהיר
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
      disabled && styles.disabled,
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
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
    <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

// 📈 רכיב סטטיסטיקה
const StatCard = ({
  label,
  value,
  unit,
  icon,
  trend,
}: {
  label: string;
  value: number | string;
  unit?: string;
  icon: keyof typeof Ionicons.glyphMap;
  trend?: "up" | "down" | "neutral";
}) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      {trend && (
        <Ionicons
          name={
            trend === "up"
              ? "trending-up"
              : trend === "down"
              ? "trending-down"
              : "remove"
          }
          size={16}
          color={
            trend === "up"
              ? colors.success
              : trend === "down"
              ? colors.danger
              : colors.textMuted
          }
        />
      )}
    </View>
    <Text style={styles.statValue}>
      {value}
      {unit && <Text style={styles.statUnit}>{unit}</Text>}
    </Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// 🏋️ רכיב אימון אחרון
const RecentWorkoutCard = ({ workout }: { workout: Workout }) => (
  <View style={styles.recentWorkoutCard}>
    <View style={styles.recentWorkoutHeader}>
      <Text style={styles.recentWorkoutName}>{workout.name}</Text>
      <Text style={styles.recentWorkoutDate}>
        {new Date(workout.completedAt || workout.date || "").toLocaleDateString(
          "he-IL"
        )}
      </Text>
    </View>

    <View style={styles.recentWorkoutStats}>
      <View style={styles.recentWorkoutStat}>
        <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.recentWorkoutStatText}>
          {workout.duration || 45} דק׳
        </Text>
      </View>

      <View style={styles.recentWorkoutStat}>
        <Ionicons
          name="fitness-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles.recentWorkoutStatText}>
          {workout.exercises?.length || 0} תרגילים
        </Text>
      </View>

      {workout.rating && (
        <View style={styles.recentWorkoutStat}>
          <Ionicons name="star" size={16} color={colors.primary} />
          <Text style={styles.recentWorkoutStatText}>{workout.rating}/5</Text>
        </View>
      )}
    </View>
  </View>
);

// 🎯 רכיב תוכנית מומלצת
const RecommendedPlanCard = ({ plan }: { plan: Plan }) => (
  <TouchableOpacity
    style={[styles.recommendedPlanCard, { backgroundColor: colors.primary }]}
    onPress={() => {
      Alert.alert("תוכנית", `נבחרה: ${plan.name}`);
    }}
  >
    <View style={styles.recommendedPlanContent}>
      <Text style={styles.recommendedPlanTitle}>{plan.name}</Text>
      <Text style={styles.recommendedPlanDescription} numberOfLines={2}>
        {plan.description}
      </Text>

      <View style={styles.recommendedPlanStats}>
        <View style={styles.recommendedPlanStat}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color="rgba(255,255,255,0.8)"
          />
          <Text style={styles.recommendedPlanStatText}>
            {plan.workouts?.length || plan.days?.length || 0} ימים
          </Text>
        </View>

        <View style={styles.recommendedPlanStat}>
          <Ionicons
            name="trophy-outline"
            size={16}
            color="rgba(255,255,255,0.8)"
          />
          <Text style={styles.recommendedPlanStatText}>
            {plan.metadata?.difficulty || "בינוני"}
          </Text>
        </View>
      </View>

      <View style={styles.recommendedPlanAction}>
        <Text style={styles.recommendedPlanActionText}>התחל עכשיו</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </View>
    </View>
  </TouchableOpacity>
);

// 🏠 הרכיב הראשי
const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📱 טעינת נתוני הדשבורד
  const loadDashboardData = useCallback(async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const [plans, workouts] = await Promise.all([
        getPlansByUserId(user.id),
        getWorkoutHistory(user.id, 10), // 10 אימונים אחרונים
      ]);

      // חישוב סטטיסטיקות שבועיות
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyWorkouts = workouts.filter(
        (w) => new Date(w.completedAt || w.date || "") >= weekAgo
      );

      const weeklyStats = {
        completedWorkouts: weeklyWorkouts.length,
        totalWeightLifted: weeklyWorkouts.reduce((sum, w) => {
          return (
            sum +
            (w.exercises?.reduce((exSum, ex) => {
              return (
                exSum +
                (ex.sets?.reduce((setSum, set) => {
                  return setSum + (set.weight || 0) * (set.reps || 0);
                }, 0) || 0)
              );
            }, 0) || 0)
          );
        }, 0),
        totalDuration: weeklyWorkouts.reduce(
          (sum, w) => sum + (w.duration || 0),
          0
        ),
        streak: calculateWorkoutStreak(workouts),
      };

      // מציאת תוכנית מומלצת להיום
      const activePlans = plans.filter((p) => p.isActive);
      const todaysWorkout = activePlans.length > 0 ? activePlans[0] : undefined;

      setDashboardData({
        recentWorkouts: workouts.slice(0, 3),
        activePlans: activePlans.slice(0, 2),
        weeklyStats,
        todaysWorkout,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את נתוני הדשבורד");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // 🔄 פונקציית רענון
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();

    // רטט קל לאישור
    const prefs = UserPreferencesService.getInstance().get();
    if (prefs.workout.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [loadDashboardData]);

  // 🧮 חישוב רצף אימונים
  const calculateWorkoutStreak = (workouts: Workout[]): number => {
    if (workouts.length === 0) return 0;

    const sortedWorkouts = workouts
      .map((w) => new Date(w.completedAt || w.date || ""))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const workoutDate of sortedWorkouts) {
      const workoutDay = new Date(workoutDate);
      workoutDay.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate.getTime() - workoutDay.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysDiff <= 1) {
        streak++;
        currentDate = workoutDay;
      } else {
        break;
      }
    }

    return streak;
  };

  // 🎬 אתחול
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 🎯 פעולות מהירות
  const quickActions = [
    {
      title: "התחל אימון",
      subtitle: "בחר תוכנית וקדימה",
      icon: "play-circle" as const,
      color: colors.primary,
      onPress: () => navigation.navigate("StartWorkout" as any),
      disabled: !dashboardData?.activePlans.length,
    },
    {
      title: "תוכניות שלי",
      subtitle: `${dashboardData?.activePlans.length || 0} תוכניות פעילות`,
      icon: "list" as const,
      color: colors.accentBlue,
      onPress: () => navigation.navigate("Plans" as any),
    },
    {
      title: "היסטוריה",
      subtitle: `${dashboardData?.recentWorkouts.length || 0} אימונים אחרונים`,
      icon: "bar-chart" as const,
      color: colors.accentPurple,
      onPress: () => navigation.navigate("Workouts" as any),
    },
    {
      title: "הגדרות",
      subtitle: "התאם אישית",
      icon: "settings" as const,
      color: colors.accent,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  // ⏳ מסך טעינה
  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>שלום!</Text>
            <Text style={styles.welcomeSubtext}>טוען נתונים...</Text>
          </View>
          <View style={styles.notificationButton}>
            <StatsGridSkeleton columns={1} />
          </View>
        </View>

        {/* סטטיסטיקות */}
        <View style={styles.statsSection}>
          <StatsGridSkeleton columns={4} />
        </View>

        {/* תוכניות */}
        <View style={styles.section}>
          <PlanCardSkeleton />
          <PlanCardSkeleton style={{ marginTop: 12 }} />
        </View>

        {/* אימונים אחרונים */}
        <View style={styles.section}>
          <ExerciseListSkeleton count={3} />
        </View>
      </ScrollView>
    );
  }
  // 📱 המסך הראשי
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header עם ברכה */}
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            שלום, {user?.name || "אלוף"}! 👋
          </Text>
          <Text style={styles.welcomeSubtext}>{getTimeBasedGreeting()}</Text>
        </View>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert("התראות", "אין התראות חדשות")}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* סטטיסטיקות שבועיות */}
      {dashboardData?.weeklyStats && (
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>השבוע שלך</Text>
          <View style={styles.statsGrid}>
            <StatCard
              label="אימונים"
              value={dashboardData.weeklyStats.completedWorkouts}
              icon="fitness"
              trend={
                dashboardData.weeklyStats.completedWorkouts > 0
                  ? "up"
                  : "neutral"
              }
            />

            <StatCard
              label="משקל כולל"
              value={Math.round(dashboardData.weeklyStats.totalWeightLifted)}
              unit="ק״ג"
              icon="barbell"
              trend="up"
            />

            <StatCard
              label="זמן כולל"
              value={Math.round(dashboardData.weeklyStats.totalDuration)}
              unit="דק׳"
              icon="time"
              trend="up"
            />

            <StatCard
              label="רצף ימים"
              value={dashboardData.weeklyStats.streak}
              icon="flame"
              trend={dashboardData.weeklyStats.streak > 1 ? "up" : "neutral"}
            />
          </View>
        </View>
      )}

      {/* תוכנית מומלצת להיום */}
      {dashboardData?.todaysWorkout && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מומלץ להיום</Text>
          <RecommendedPlanCard plan={dashboardData.todaysWorkout} />
        </View>
      )}

      {/* פעולות מהירות */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>פעולות מהירות</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </View>
      </View>

      {/* אימונים אחרונים */}
      {dashboardData?.recentWorkouts.length ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>אימונים אחרונים</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Workouts" as any)}
            >
              <Text style={styles.seeAllText}>ראה הכל</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.recentWorkouts.map((workout, index) => (
            <RecentWorkoutCard key={workout.id || index} workout={workout} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="fitness-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyStateTitle}>עוד לא התחלת</Text>
          <Text style={styles.emptyStateText}>
            התחל את האימון הראשון שלך והגרף יתמלא בנתונים
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate("StartWorkout" as any)}
          >
            <Text style={styles.emptyStateButtonText}>התחל עכשיו</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* רווח תחתון */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

// 🕐 פונקציה לברכה לפי שעה
const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "בוקר טוב! מוכן לאימון?";
  if (hour < 17) return "איך הצהריים? בא לאמן?";
  if (hour < 21) return "ערב טוב! זמן לאימון ערב";
  return "לילה טוב! אימון לילה?";
};

// 🎨 עיצוב
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },

  // Stats
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2, // 2 עמודות עם gap
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "normal",
    color: colors.textSecondary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  // Quick Actions
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },
  quickActionCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    justifyContent: "center",
    borderWidth: 1,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Recommended Plan
  recommendedPlanCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  recommendedPlanContent: {
    alignItems: "flex-start",
  },
  recommendedPlanTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  recommendedPlanDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 16,
    lineHeight: 20,
  },
  recommendedPlanStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  recommendedPlanStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recommendedPlanStatText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  recommendedPlanAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recommendedPlanActionText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },

  // Recent Workouts
  recentWorkoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentWorkoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recentWorkoutName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  recentWorkoutDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recentWorkoutStats: {
    flexDirection: "row",
    gap: 16,
  },
  recentWorkoutStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  recentWorkoutStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Utils
  disabled: {
    opacity: 0.5,
  },
  bottomSpacing: {
    height: 100, // מקום לטאב בר
  },
});

export default HomeScreen;
