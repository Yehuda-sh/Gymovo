// src/screens/home/HomeScreen.tsx - עם Design System החדש

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
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🎨 Design System Components
import {
  ScreenLayout,
  CardLayout,
  Typography,
  Button,
  Badge,
  Spacer,
  Divider,
  LoadingSkeleton,
  ProgressBar,
  IconButton,
} from "../../components/ui";

// Theme
import { theme } from "../../theme";

// Services & Stores
import { getPlansByUserId, getWorkoutHistory } from "../../data/storage";
import { UserPreferencesService } from "../../services/userPreferences";
import { useUserStore } from "../../stores/userStore";

// Types & Utils
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

// 🎯 רכיב כרטיס מהיר - עם Design System
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
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.8}
    style={{ opacity: disabled ? 0.5 : 1 }}
  >
    <CardLayout
      style={{
        width: 140,
        alignItems: "center",
        backgroundColor: `${color}10`, // 10% opacity
        borderColor: `${color}20`, // 20% opacity
        borderWidth: 1,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: theme.borderRadius.full,
          backgroundColor: `${color}20`,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: theme.spacing.md,
        }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Typography variant="body" align="center">
        {title}
      </Typography>
      <Typography
        variant="caption"
        color={theme.colors.textSecondary}
        align="center"
      >
        {subtitle}
      </Typography>
    </CardLayout>
  </TouchableOpacity>
);

// 📈 רכיב סטטיסטיקה - עם Design System
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
  <CardLayout
    style={{
      flex: 1,
      alignItems: "center",
      paddingVertical: theme.spacing.lg,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
      }}
    >
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
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
              ? theme.colors.success
              : trend === "down"
              ? theme.colors.error
              : theme.colors.textSecondary
          }
          style={{ marginLeft: theme.spacing.xs }}
        />
      )}
    </View>
    <Typography variant="h2" align="center">
      {value}
      {unit && (
        <Typography variant="caption" color={theme.colors.textSecondary}>
          {" "}
          {unit}
        </Typography>
      )}
    </Typography>
    <Typography
      variant="caption"
      color={theme.colors.textSecondary}
      align="center"
    >
      {label}
    </Typography>
  </CardLayout>
);

// 🏋️ רכיב תוכנית מומלצת - עם Design System
const RecommendedPlanCard = ({
  plan,
  onPress,
}: {
  plan: Plan;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <CardLayout
      style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
        ...theme.shadows.lg,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Typography variant="h3" color="#fff" align="center">
          {plan.name}
        </Typography>
        <Spacer size="sm" />
        <Typography variant="body" color="rgba(255,255,255,0.8)" align="center">
          {plan.description}
        </Typography>
        <Spacer size="lg" />

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Typography variant="caption" color="#fff">
              {plan.durationWeeks || 4} שבועות
            </Typography>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <Ionicons name="barbell-outline" size={16} color="#fff" />
            <Typography variant="caption" color="#fff">
              {plan.days?.length || 3} ימים בשבוע
            </Typography>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
            }}
          >
            <Ionicons name="trophy-outline" size={16} color="#fff" />
            <Typography variant="caption" color="#fff">
              {plan.difficulty || "בינוני"}
            </Typography>
          </View>
        </View>

        <Button
          title="התחל עכשיו"
          onPress={onPress}
          variant="secondary"
          size="lg"
          fullWidth
        />
      </View>
    </CardLayout>
  </TouchableOpacity>
);

// 🏠 הרכיב הראשי עם Design System
// חישוב רצף אימונים
const calculateStreak = (workouts: Workout[]): number => {
  if (!workouts.length) return 0;

  const sortedWorkouts = [...workouts]
    .filter((w) => w.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()
    );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.completedAt!);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// 🏠 הרכיב הראשי עם Design System
const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const user = useUserStore((state) => state.user);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 📊 טעינת נתוני דשבורד
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [workouts, plans] = await Promise.all([
        getWorkoutHistory(user.id),
        getPlansByUserId(user.id),
      ]);

      // חישוב סטטיסטיקות שבועיות
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weeklyWorkouts = workouts.filter((w) => {
        if (!w.completedAt) return false;
        return new Date(w.completedAt) >= weekAgo;
      });

      const weeklyStats = {
        completedWorkouts: weeklyWorkouts.length,
        totalWeightLifted: weeklyWorkouts.reduce(
          (total, workout) =>
            total +
            (workout.exercises?.reduce(
              (wTotal, exercise) =>
                wTotal +
                exercise.sets.reduce(
                  (sTotal, set) => sTotal + (set.weight || 0) * (set.reps || 0),
                  0
                ),
              0
            ) || 0),
          0
        ),
        totalDuration: weeklyWorkouts.reduce(
          (total, workout) => total + (workout.duration || 0),
          0
        ),
        streak: calculateStreak(workouts),
      };

      // בחירת תוכנית מומלצת
      const activePlans = plans.filter((p) => p.isActive);
      const todaysWorkout = activePlans[0]; // בעתיד: לוגיקה חכמה יותר

      setDashboardData({
        recentWorkouts: workouts.slice(0, 5),
        activePlans,
        weeklyStats,
        todaysWorkout,
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      Alert.alert("שגיאה", "לא הצלחנו לטעון את הנתונים");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // חישוב רצף אימונים
  const calculateStreak = (workouts: Workout[]): number => {
    if (!workouts.length) return 0;

    const sortedWorkouts = [...workouts]
      .filter((w) => w.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt!).getTime() -
          new Date(a.completedAt!).getTime()
      );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.completedAt!);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // טעינה ראשונית
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // רענון
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  // 🎯 פעולות מהירות
  const quickActions = [
    {
      title: "התחל אימון",
      subtitle: "בחר תוכנית וקדימה",
      icon: "play-circle" as const,
      color: theme.colors.primary,
      onPress: () => navigation.navigate("StartWorkout"),
      disabled: !dashboardData?.activePlans.length,
    },
    {
      title: "תוכניות שלי",
      subtitle: `${dashboardData?.activePlans.length || 0} תוכניות פעילות`,
      icon: "list" as const,
      color: theme.colors.secondary,
      onPress: () => navigation.navigate("Plans" as any),
    },
    {
      title: "היסטוריה",
      subtitle: `${dashboardData?.recentWorkouts.length || 0} אימונים אחרונים`,
      icon: "bar-chart" as const,
      color: theme.colors.success,
      onPress: () => navigation.navigate("Workouts" as any),
    },
    {
      title: "הגדרות",
      subtitle: "התאם אישית",
      icon: "settings" as const,
      color: theme.colors.warning,
      onPress: () => navigation.navigate("Settings"),
    },
  ];

  // ⏳ מסך טעינה
  if (loading) {
    return (
      <ScreenLayout scrollable>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <LoadingSkeleton width={100} height={28} />
            <Spacer size="xs" />
            <LoadingSkeleton width={150} height={20} />
          </View>
          <LoadingSkeleton width={44} height={44} borderRadius={22} />
        </View>

        <Spacer size="xl" />

        {/* סטטיסטיקות */}
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.sm,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={{ flex: 1 }}>
              <LoadingSkeleton height={100} />
            </View>
          ))}
        </View>

        <Spacer size="xl" />

        {/* תוכניות */}
        <LoadingSkeleton height={200} />
        <Spacer size="md" />
        <LoadingSkeleton height={200} />
      </ScreenLayout>
    );
  }

  // 📱 המסך הראשי
  return (
    <ScreenLayout
      scrollable
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Typography variant="h1">שלום, {user?.name || "אלוף"} 👋</Typography>
          <Typography variant="body" color={theme.colors.textSecondary}>
            {new Date().toLocaleDateString("he-IL", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Typography>
        </View>

        <IconButton
          icon={
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.text}
            />
          }
          onPress={() => Alert.alert("הודעות", "בקרוב...")}
          size="md"
          variant="ghost"
        />
      </View>

      <Spacer size="xl" />

      {/* סטטיסטיקות שבועיות */}
      <View>
        <Typography variant="h3">השבוע שלך</Typography>
        <Spacer size="md" />

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.sm,
          }}
        >
          <StatCard
            label="אימונים"
            value={dashboardData?.weeklyStats.completedWorkouts || 0}
            icon="fitness-outline"
            trend={
              dashboardData?.weeklyStats.completedWorkouts
                ? dashboardData.weeklyStats.completedWorkouts > 3
                  ? "up"
                  : "down"
                : "neutral"
            }
          />
          <StatCard
            label="משקל כולל"
            value={
              dashboardData?.weeklyStats.totalWeightLifted
                ? Math.round(dashboardData.weeklyStats.totalWeightLifted / 1000)
                : 0
            }
            unit="טון"
            icon="barbell-outline"
          />
          <StatCard
            label="זמן כולל"
            value={
              dashboardData?.weeklyStats.totalDuration
                ? Math.round(dashboardData.weeklyStats.totalDuration / 60)
                : 0
            }
            unit="דק'"
            icon="time-outline"
          />
          <StatCard
            label="רצף"
            value={dashboardData?.weeklyStats.streak || 0}
            unit="ימים"
            icon="flame-outline"
            trend={
              dashboardData?.weeklyStats.streak
                ? dashboardData.weeklyStats.streak > 0
                  ? "up"
                  : "neutral"
                : "neutral"
            }
          />
        </View>
      </View>

      <Spacer size="xl" />

      {/* פעולות מהירות */}
      <View>
        <Typography variant="h3">פעולות מהירות</Typography>
        <Spacer size="md" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: theme.spacing.md,
            gap: theme.spacing.md,
          }}
        >
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </ScrollView>
      </View>

      <Spacer size="xl" />

      {/* תוכנית מומלצת */}
      {dashboardData?.todaysWorkout && (
        <>
          <Typography variant="h3">התוכנית שלך להיום</Typography>
          <Spacer size="md" />
          <RecommendedPlanCard
            plan={dashboardData.todaysWorkout}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("StartWorkout" as any, {
                planId: dashboardData.todaysWorkout!.id,
              });
            }}
          />
          <Spacer size="xl" />
        </>
      )}

      {/* אימונים אחרונים */}
      {dashboardData?.recentWorkouts.length ? (
        <>
          <Typography variant="h3">אימונים אחרונים</Typography>
          <Spacer size="md" />

          {dashboardData.recentWorkouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              onPress={() =>
                navigation.navigate("WorkoutSummary", {
                  workoutData: workout,
                })
              }
              activeOpacity={0.7}
            >
              <CardLayout style={{ marginBottom: theme.spacing.sm }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body">{workout.name}</Typography>
                  <Typography
                    variant="caption"
                    color={theme.colors.textSecondary}
                  >
                    {new Date(workout.date!).toLocaleDateString("he-IL")}
                  </Typography>
                </View>

                <Spacer size="sm" />

                <View
                  style={{
                    flexDirection: "row",
                    gap: theme.spacing.md,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.xs,
                    }}
                  >
                    <Ionicons
                      name="barbell-outline"
                      size={14}
                      color={theme.colors.textSecondary}
                    />
                    <Typography
                      variant="caption"
                      color={theme.colors.textSecondary}
                    >
                      {workout.exercises?.length || 0} תרגילים
                    </Typography>
                  </View>

                  {workout.duration && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={theme.colors.textSecondary}
                      />
                      <Typography
                        variant="caption"
                        color={theme.colors.textSecondary}
                      >
                        {workout.duration} דקות
                      </Typography>
                    </View>
                  )}

                  {workout.rating && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="star"
                        size={14}
                        color={theme.colors.warning}
                      />
                      <Typography
                        variant="caption"
                        color={theme.colors.textSecondary}
                      >
                        {workout.rating}/5
                      </Typography>
                    </View>
                  )}
                </View>
              </CardLayout>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        // מצב ריק
        <CardLayout
          style={{
            alignItems: "center",
            paddingVertical: theme.spacing.xxl,
          }}
        >
          <Ionicons
            name="barbell-outline"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Spacer size="lg" />
          <Typography variant="h3">טרם התחלת להתאמן</Typography>
          <Spacer size="sm" />
          <Typography
            variant="body"
            color={theme.colors.textSecondary}
            align="center"
          >
            בוא נתחיל את המסע שלך לכושר טוב יותר!
          </Typography>
          <Spacer size="lg" />
          <Button
            title="בחר תוכנית אימונים"
            onPress={() => navigation.navigate("Plans" as any)}
            variant="primary"
            size="lg"
          />
        </CardLayout>
      )}

      {/* Spacing for tab bar */}
      <View style={{ height: 100 }} />
    </ScreenLayout>
  );
};

export default HomeScreen;
