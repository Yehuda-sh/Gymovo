// src/screens/dashboard/DashboardScreen.tsx - 🛠️ TypeScript Errors Fixed

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Button from "../../components/common/Button";
import { demoPlans } from "../../constants/demoPlans";
import { useWorkoutHistory } from "../../hooks/useWorkoutHistory";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Workout } from "../../types/workout";

const { width, height } = Dimensions.get("window");

// Calendar Hebrew Configuration
LocaleConfig.locales["he"] = {
  monthNames: [
    "ינואר",
    "פברואר",
    "מרץ",
    "אפריל",
    "מאי",
    "יוני",
    "יולי",
    "אוגוסט",
    "ספטמבר",
    "אוקטובר",
    "נובמבר",
    "דצמבר",
  ],
  monthNamesShort: [
    "ינו׳",
    "פבר׳",
    "מרץ",
    "אפר׳",
    "מאי",
    "יוני",
    "יולי",
    "אוג׳",
    "ספט׳",
    "אוק׳",
    "נוב׳",
    "דצמ׳",
  ],
  dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
  dayNamesShort: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
  today: "היום",
};
LocaleConfig.defaultLocale = "he";

// --- Sub Components ---

// Guest Banner Component
const GuestBanner = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [pulseAnim, slideAnim]); // ✅ Fixed: Added missing dependencies

  return (
    <Animated.View
      style={[
        styles.guestBanner,
        {
          transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <ImageBackground
        source={require("../../../assets/images/backgrounds/gym-bg.jpg")}
        style={styles.guestBg}
        resizeMode="cover"
      >
        <View style={styles.guestOverlay} />
        <View style={styles.guestContent}>
          <Text style={styles.guestTitle}>🏋️ ברוכים הבאים ל-Gymovo!</Text>
          <Text style={styles.guestSubtitle}>
            התחילו את המסע שלכם לכושר מושלם
          </Text>
          <View style={styles.guestActions}>
            <Button
              title="צרו חשבון חדש"
              onPress={() => navigation.navigate("Signup")}
              style={styles.primaryButton}
            />
            <Button
              title="התחברו"
              onPress={() => navigation.navigate("Login")}
              variant="outline"
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

// Quick Stats Component
const QuickStats = ({ workouts }: { workouts: Workout[] }) => {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, slideAnim]); // ✅ Fixed: Added missing dependencies

  // ✅ Fixed: Added proper TypeScript types
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyWorkouts = workouts.filter((workout: Workout) => {
      const workoutDate = workout.completedAt || workout.date;
      return workoutDate && new Date(workoutDate) >= weekAgo;
    });

    const totalWeight = weeklyWorkouts.reduce((sum: number, w: Workout) => {
      return (
        sum +
        (w.exercises?.reduce((exSum: number, ex: any) => {
          return (
            exSum +
            (ex.sets?.reduce((setSum: number, set: any) => {
              return setSum + (set.weight || 0) * (set.reps || 0);
            }, 0) || 0)
          );
        }, 0) || 0)
      );
    }, 0);

    const totalDuration = weeklyWorkouts.reduce(
      (sum: number, w: Workout) => sum + (w.duration || 0),
      0
    );

    return {
      workouts: weeklyWorkouts.length,
      weight: Math.round(totalWeight),
      duration: Math.round(totalDuration),
    };
  }, [workouts]);

  return (
    <Animated.View
      style={[
        styles.quickStats,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.quickStatsTitle}>השבוע שלכם</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weeklyStats.workouts}</Text>
          <Text style={styles.statLabel}>אימונים</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weeklyStats.weight}kg</Text>
          <Text style={styles.statLabel}>משקל הורם</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{weeklyStats.duration}m</Text>
          <Text style={styles.statLabel}>דקות</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Recent Activity Component
const RecentActivity = ({ workouts }: { workouts: Workout[] }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [glowAnim, slideAnim]); // ✅ Fixed: Added missing dependencies

  const recentWorkouts = workouts.slice(0, 3);

  if (recentWorkouts.length === 0) {
    return (
      <Animated.View
        style={[
          styles.recentActivity,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.recentTitle}>אימונים אחרונים</Text>
        <Text style={styles.emptyState}>עדיין לא החלטתם לאמן? 🏃‍♂️</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.recentActivity,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Animated.View style={[styles.recentGlow, { opacity: glowAnim }]} />
      <Text style={styles.recentTitle}>אימונים אחרונים</Text>
      {recentWorkouts.map((workout, index) => (
        <View key={workout.id} style={styles.recentItem}>
          <View style={styles.recentInfo}>
            <Text style={styles.recentWorkoutName}>{workout.name}</Text>
            <Text style={styles.recentWorkoutDate}>
              {/* ✅ Fixed: Added proper null check for date */}
              {workout.completedAt
                ? new Date(workout.completedAt).toLocaleDateString("he-IL")
                : "תאריך לא זמין"}
            </Text>
          </View>
          <View style={styles.recentMeta}>
            <Text style={styles.recentDuration}>{workout.duration || 0}m</Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );
};

// Next Workout Component
const NextWorkout = () => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, [glowAnim, slideAnim]); // ✅ Fixed: Added missing dependencies

  // Mock next workout - replace with real logic
  const nextWorkout = demoPlans[0]?.workouts?.[0];

  if (!nextWorkout) return null;

  return (
    <Animated.View
      style={[
        styles.nextWorkoutCard,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Animated.View style={[styles.nextWorkoutGlow, { opacity: glowAnim }]} />
      <View style={styles.nextWorkoutContent}>
        <View style={styles.nextWorkoutInfo}>
          <Text style={styles.nextWorkoutTitle}>האימון הבא שלך:</Text>
          <Text style={styles.nextWorkoutDesc} numberOfLines={1}>
            {nextWorkout.name}
          </Text>
          <View style={styles.nextWorkoutMeta}>
            <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.nextWorkoutTime}>
              {nextWorkout.estimatedDuration || 45}-60 דקות משוערות
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.nextWorkoutButton}
          onPress={() => navigation.navigate("SelectPlan")}
        >
          <Ionicons name="play" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// Main Dashboard Component
const DashboardScreen = () => {
  // --- Hooks and State ---
  const user = useUserStore((state: UserState) => state.user);
  const status = useUserStore((state: UserState) => state.status);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // ✅ Fixed: Changed from data to workouts
  const { workouts: workoutHistory, isLoading } = useWorkoutHistory();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<Workout[]>(
    []
  );

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(titleSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, titleSlide]); // ✅ Fixed: Added missing dependencies

  // Calendar marking
  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};

    workoutHistory.forEach((workout: Workout) => {
      const date = workout.completedAt || workout.date;
      if (date) {
        const dateStr = new Date(date).toISOString().split("T")[0];
        marks[dateStr] = {
          marked: true,
          dotColor: colors.primary,
          selectedColor: colors.primary,
        };
      }
    });

    return marks;
  }, [workoutHistory]);

  const handleDatePress = (day: { dateString: string }) => {
    const dayWorkouts = workoutHistory.filter((workout: Workout) => {
      const date = workout.completedAt || workout.date;
      return (
        date && new Date(date).toISOString().split("T")[0] === day.dateString
      );
    });

    if (dayWorkouts.length > 0) {
      setSelectedDateWorkouts(dayWorkouts);
      setModalVisible(true);
    }
  };

  // Guest user experience
  if (status === "guest") {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.background}
        />
        <GuestBanner />
        <ScrollView style={styles.guestInfo}>
          <Text style={styles.guestInfoTitle}>למה Gymovo?</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="fitness" size={24} color={colors.primary} />
              <Text style={styles.featureText}>
                תוכניות אימון מותאמות אישית
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={24} color={colors.primary} />
              <Text style={styles.featureText}>מעקב מתקדם אחר התקדמות</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="trophy" size={24} color={colors.primary} />
              <Text style={styles.featureText}>הישגים ואתגרים יומיומיים</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>טוען נתונים...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[styles.header, { transform: [{ translateY: titleSlide }] }]}
        >
          <Text style={styles.greeting}>שלום, {user?.name || "מתאמן"}! 👋</Text>
          <Text style={styles.headerSubtitle}>מוכנים לאימון היום?</Text>
        </Animated.View>

        {/* Quick Stats */}
        <QuickStats workouts={workoutHistory} />

        {/* Next Workout */}
        <NextWorkout />

        {/* Recent Activity */}
        <RecentActivity workouts={workoutHistory} />

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <Text style={styles.sectionTitle}>לוח אימונים</Text>
          <Calendar
            markedDates={markedDates}
            onDayPress={handleDatePress}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.text,
              dayTextColor: colors.text,
              todayTextColor: colors.primary,
              selectedDayTextColor: colors.background,
              monthTextColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              arrowColor: colors.primary,
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "500",
            }}
            style={styles.calendar}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("SelectPlan")}
          >
            <Ionicons name="add-circle" size={24} color={colors.primary} />
            <Text style={styles.actionText}>אימון חדש</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Main", { screen: "Plans" })}
          >
            <Ionicons name="list" size={24} color={colors.primary} />
            <Text style={styles.actionText}>התוכניות שלי</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Main", { screen: "Workouts" })}
          >
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
            <Text style={styles.actionText}>היסטוריה</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      {/* Modal for selected date workouts */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>אימונים ביום זה</Text>
            {selectedDateWorkouts.map((workout, index) => (
              <View key={index} style={styles.modalWorkout}>
                <Text style={styles.modalWorkoutName}>{workout.name}</Text>
                <Text style={styles.modalWorkoutDuration}>
                  {workout.duration} דקות
                </Text>
              </View>
            ))}
            <Button
              title="סגור"
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// --- Styles ---
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
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },

  // Guest Banner Styles
  guestBanner: {
    height: height * 0.4,
    marginBottom: 20,
  },
  guestBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  guestOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  guestContent: {
    alignItems: "center",
    padding: 20,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  guestSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 30,
  },
  guestActions: {
    width: "100%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderColor: colors.primary,
  },
  guestInfo: {
    flex: 1,
    padding: 20,
  },
  guestInfoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  featureList: {
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  featureText: {
    fontSize: 16,
    color: colors.textSecondary,
    flex: 1,
  },

  // Header Styles
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },

  // Quick Stats Styles
  quickStats: {
    margin: 20,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },

  // Recent Activity Styles
  recentActivity: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 15,
    position: "relative",
    overflow: "hidden",
  },
  recentGlow: {
    position: "absolute",
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: colors.primary,
    opacity: 0.05,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
  },
  emptyState: {
    textAlign: "center",
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentInfo: {
    flex: 1,
  },
  recentWorkoutName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  recentWorkoutDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recentMeta: {
    alignItems: "flex-end",
  },
  recentDuration: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },

  // Next Workout Styles
  nextWorkoutCard: {
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.primary,
  },
  nextWorkoutGlow: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: colors.primaryLight,
    opacity: 0.3,
  },
  nextWorkoutContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  nextWorkoutInfo: {
    flex: 1,
  },
  nextWorkoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.background,
    marginBottom: 5,
  },
  nextWorkoutDesc: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.background,
    marginBottom: 8,
  },
  nextWorkoutMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  nextWorkoutTime: {
    fontSize: 14,
    color: "rgba(0,0,0,0.7)",
  },
  nextWorkoutButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  // Calendar Styles
  calendarContainer: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
  },
  calendar: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Quick Actions Styles
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 20,
    marginTop: 0,
  },
  actionButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.surface,
    borderRadius: 15,
    minWidth: 80,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: "center",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 15,
    width: width * 0.9,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
    textAlign: "center",
  },
  modalWorkout: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalWorkoutName: {
    fontSize: 16,
    color: colors.text,
  },
  modalWorkoutDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalCloseButton: {
    marginTop: 20,
  },

  bottomPadding: {
    height: 100,
  },
});

export default DashboardScreen;
