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

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  }, [slideAnim]); // ✅ Fixed: Added missing dependency

  return (
    <Animated.View
      style={[styles.guestBanner, { transform: [{ translateY: slideAnim }] }]}
    >
      <ImageBackground
        source={require("../../assets/images/guest-banner-bg.png")}
        style={styles.guestBannerBg}
        imageStyle={styles.guestBannerImage}
      >
        <View style={styles.guestBannerContent}>
          <Text style={styles.guestBannerTitle}>הצטרף ל-Gymovo</Text>
          <Text style={styles.guestBannerText}>
            שמור את ההתקדמות שלך וקבל תוכניות מותאמות אישית
          </Text>
          <Button
            title="הרשם עכשיו"
            onPress={() => navigation.navigate("Signup")}
            style={styles.guestBannerButton}
          />
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

// Quick Stats Component
const QuickStats = ({ workouts }: { workouts: Workout[] }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]); // ✅ Fixed: Added missing dependency

  const totalWorkouts = workouts.length;
  const currentStreak = calculateStreak(workouts);

  return (
    <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{totalWorkouts}</Text>
        <Text style={styles.statLabel}>אימונים</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{currentStreak}</Text>
        <Text style={styles.statLabel}>ימי רצף</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>
          {workouts[0]?.exercises?.length || 0}
        </Text>
        <Text style={styles.statLabel}>תרגילים אחרונים</Text>
      </View>
    </Animated.View>
  );
};

// Recent Activity Component
const RecentActivity = ({ workouts }: { workouts: Workout[] }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const recentWorkouts = workouts.slice(0, 3);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]); // ✅ Fixed: Added missing dependency

  if (recentWorkouts.length === 0) return null;

  return (
    <Animated.View
      style={[
        styles.recentContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.sectionTitle}>פעילות אחרונה</Text>
      {recentWorkouts.map((workout, index) => (
        <View key={index} style={styles.recentItem}>
          <View style={styles.recentContent}>
            <Ionicons name="barbell-outline" size={24} color={colors.primary} />
            <Text style={styles.recentName} numberOfLines={1}>
              {workout.name}
            </Text>
            <Text style={styles.recentDate}>
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
          onPress={() => navigation.navigate("StartWorkout")} // ✅ Fixed: Changed from SelectPlan to StartWorkout
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

  // --- Animations ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // --- Effects ---
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]); // ✅ Fixed: Added missing dependencies

  // --- Computed Values ---
  const markedDates = useMemo(() => {
    const dates: any = {};
    workoutHistory.forEach((workout) => {
      if (workout.completedAt) {
        const date = new Date(workout.completedAt).toISOString().split("T")[0];
        dates[date] = {
          marked: true,
          dotColor: colors.primary,
        };
      }
    });
    return dates;
  }, [workoutHistory]);

  // --- Handlers ---
  const handleDatePress = (day: any) => {
    const workoutsOnDate = workoutHistory.filter((workout) => {
      if (!workout.completedAt) return false;
      const workoutDate = new Date(workout.completedAt)
        .toISOString()
        .split("T")[0];
      return workoutDate === day.dateString;
    });

    if (workoutsOnDate.length > 0) {
      setSelectedDateWorkouts(workoutsOnDate);
      setModalVisible(true);
    }
  };

  // --- Render ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* Guest Banner for non-registered users */}
        {status === "guest" && <GuestBanner />}

        {/* Header Section */}
        <Animated.View style={styles.header}>
          <Text style={styles.headerTitle}>
            שלום, {user?.name || "אורח"} 👋
          </Text>
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
            onPress={() => navigation.navigate("StartWorkout")} // ✅ Fixed: Changed from SelectPlan to StartWorkout
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
  },

  // Guest Banner
  guestBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  guestBannerBg: {
    width: "100%",
    padding: 20,
  },
  guestBannerImage: {
    borderRadius: 16,
  },
  guestBannerContent: {
    alignItems: "center",
  },
  guestBannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  guestBannerText: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 16,
  },
  guestBannerButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  // Next Workout
  nextWorkoutCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.primary,
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  nextWorkoutGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
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
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  nextWorkoutDesc: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  nextWorkoutMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nextWorkoutTime: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  nextWorkoutButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },

  // Recent Activity
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  recentDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recentMeta: {
    marginLeft: 12,
  },
  recentDuration: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },

  // Calendar
  calendarContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  calendar: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Quick Actions
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxHeight: height * 0.6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  modalWorkout: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalWorkoutName: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  modalWorkoutDuration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalCloseButton: {
    marginTop: 20,
  },

  // Misc
  bottomPadding: {
    height: 100,
  },
});

// Helper function
function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;

  const sortedWorkouts = [...workouts].sort((a, b) => {
    const dateA = new Date(a.completedAt || 0).getTime();
    const dateB = new Date(b.completedAt || 0).getTime();
    return dateB - dateA;
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const workout of sortedWorkouts) {
    if (!workout.completedAt) continue;

    const workoutDate = new Date(workout.completedAt);
    workoutDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - workoutDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (daysDiff <= 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }

  return streak;
}

export default DashboardScreen;
