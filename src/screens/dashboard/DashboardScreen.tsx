// src/screens/dashboard/DashboardScreen.tsx - גרסה מקצועית ברמה עולמית

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
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.guestBanner,
        {
          transform: [{ translateY: slideAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.guestBannerGlow} />
      <Ionicons
        name="rocket"
        size={24}
        color="#ffffff"
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.guestBannerText}>רוצה לשמור את ההתקדמות שלך?</Text>
      <Button
        title="הירשם בחינם"
        onPress={() => navigation.navigate("Signup")}
        variant="primary"
        style={styles.guestBannerButton}
      />
    </Animated.View>
  );
};

// Stats Card Component with animations
const QuickStatCard = ({
  icon,
  label,
  value,
  color = colors.primary,
  index = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color?: string;
  index?: number;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.statCardGlow} />
      <View
        style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
      >
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// Next Workout Widget
const NextWorkoutWidget = ({
  nextWorkout,
}: {
  nextWorkout: { planName: string; dayName: string } | null;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const slideAnim = useRef(new Animated.Value(100)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

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
            {`${nextWorkout.planName} - ${nextWorkout.dayName}`}
          </Text>
          <View style={styles.nextWorkoutMeta}>
            <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={styles.nextWorkoutTime}>45-60 דקות משוערות</Text>
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
  const { data: workoutHistory, isLoading } = useWorkoutHistory();

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
  }, []);

  // --- Calculations (useMemo for performance) ---
  const markedDates = useMemo(() => {
    const marks: { [key: string]: { marked: boolean; dotColor: string } } = {};
    if (workoutHistory) {
      workoutHistory.forEach((workout) => {
        const dateString = workout.date.split("T")[0];
        marks[dateString] = { marked: true, dotColor: colors.primary };
      });
    }
    return marks;
  }, [workoutHistory]);

  const weeklyStats = useMemo(() => {
    if (!workoutHistory) return { count: 0, volume: 0, streak: 0 };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentWorkouts = workoutHistory.filter(
      (w) => new Date(w.date) > oneWeekAgo
    );

    const totalVolume = recentWorkouts.reduce((sum, w) => {
      const workoutVolume = w.exercises.reduce(
        (exSum, ex) =>
          exSum +
          ex.sets.reduce((setSum, set) => setSum + set.weight * set.reps, 0),
        0
      );
      return sum + workoutVolume;
    }, 0);

    // Calculate streak
    const sortedWorkouts = [...workoutHistory].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    let streak = 0;
    const today = new Date();
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff <= streak + 1) {
        streak++;
      } else {
        break;
      }
    }

    return { count: recentWorkouts.length, volume: totalVolume, streak };
  }, [workoutHistory]);

  const nextWorkoutSuggestion = useMemo(() => {
    if (!workoutHistory || workoutHistory.length === 0) {
      return {
        planName: demoPlans[0].name,
        dayName: demoPlans[0].days[0].name,
      };
    }
    return null;
  }, [workoutHistory]);

  // --- Functions ---
  const handleDayPress = (day: { dateString: string }) => {
    const workouts =
      workoutHistory?.filter((w) => w.date.startsWith(day.dateString)) || [];
    if (workouts.length > 0) {
      setSelectedDateWorkouts(workouts);
      setModalVisible(true);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "start_workout":
        navigation.navigate("SelectPlan");
        break;
      case "view_plans":
        navigation.navigate("Main", { screen: "Plans" });
        break;
      case "view_history":
        navigation.navigate("Main", { screen: "Workouts" });
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <ImageBackground
        source={require("../../../assets/images/backgrounds/welcome-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            {/* Guest Banner */}
            {status === "guest" && <GuestBanner />}

            {/* Header Section */}
            <Animated.View
              style={[
                styles.headerSection,
                { transform: [{ translateY: titleSlide }] },
              ]}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.greeting}>
                  {(() => {
                    const hour = new Date().getHours();
                    if (hour < 12) return "בוקר טוב";
                    if (hour < 18) return "צהריים טובים";
                    return "ערב טוב";
                  })()}
                </Text>
                <Text style={styles.userName}>
                  {user?.name ? user.name : "לוחם כושר"}
                </Text>
                <Text style={styles.motivationalText}>
                  {weeklyStats.count > 0
                    ? `${weeklyStats.count} אימונים השבוע - מדהים! 🔥`
                    : "בואו נתחיל את השבוע בחזקה! 💪"}
                </Text>
              </View>
            </Animated.View>

            {/* Next Workout Widget */}
            <NextWorkoutWidget nextWorkout={nextWorkoutSuggestion} />

            {/* Quick Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>סטטיסטיקות מהירות</Text>
              <View style={styles.statsContainer}>
                <QuickStatCard
                  icon="barbell-outline"
                  label="אימונים השבוע"
                  value={weeklyStats.count}
                  color={colors.primary}
                  index={0}
                />
                <QuickStatCard
                  icon="flame-outline"
                  label="נפח שבועי"
                  value={`${(weeklyStats.volume / 1000).toFixed(1)}K`}
                  color="#ff6b35"
                  index={1}
                />
                <QuickStatCard
                  icon="trending-up"
                  label="רצף ימים"
                  value={weeklyStats.streak}
                  color="#8b5cf6"
                  index={2}
                />
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>פעולות מהירות</Text>
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.quickActionCard,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                  onPress={() => handleQuickAction("start_workout")}
                >
                  <Ionicons name="play" size={32} color={colors.primary} />
                  <Text style={styles.quickActionText}>התחל אימון</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickActionCard,
                    { backgroundColor: "#ff6b35" + "20" },
                  ]}
                  onPress={() => handleQuickAction("view_plans")}
                >
                  <Ionicons name="document-text" size={32} color="#ff6b35" />
                  <Text style={styles.quickActionText}>התוכניות שלי</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.quickActionCard,
                    { backgroundColor: "#8b5cf6" + "20" },
                  ]}
                  onPress={() => handleQuickAction("view_history")}
                >
                  <Ionicons name="analytics" size={32} color="#8b5cf6" />
                  <Text style={styles.quickActionText}>היסטוריה</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar Section */}
            <View style={styles.calendarSection}>
              <Text style={styles.sectionTitle}>לוח אימונים</Text>
              {isLoading ? (
                <View style={styles.calendarLoading}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>טוען נתוני אימונים...</Text>
                </View>
              ) : (
                <View style={styles.calendarContainer}>
                  <Calendar
                    current={new Date().toISOString().split("T")[0]}
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    monthFormat={"MMMM yyyy"}
                    firstDay={0}
                    enableSwipeMonths={true}
                    style={styles.calendar}
                    theme={{
                      calendarBackground: "rgba(255, 255, 255, 0.05)",
                      dayTextColor: "#ffffff",
                      monthTextColor: colors.primary,
                      arrowColor: colors.primary,
                      todayTextColor: colors.primary,
                      selectedDayBackgroundColor: colors.primary,
                      textSectionTitleColor: "rgba(255, 255, 255, 0.7)",
                      textDayFontWeight: "500",
                      textMonthFontWeight: "700",
                      textDayHeaderFontWeight: "600",
                    }}
                  />
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Workout Details Modal */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>אימונים ביום זה</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
              {selectedDateWorkouts.map((workout) => (
                <View key={workout.id} style={styles.modalWorkoutItem}>
                  <Ionicons name="fitness" size={20} color={colors.primary} />
                  <Text style={styles.modalWorkoutText}>{workout.name}</Text>
                  <Text style={styles.modalWorkoutTime}>
                    {new Date(workout.date).toLocaleTimeString("he-IL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              ))}
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Guest Banner
  guestBanner: {
    backgroundColor: "rgba(0, 255, 136, 0.15)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  guestBannerGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 16,
  },
  guestBannerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  guestBannerButton: {
    width: "100%",
    marginVertical: 0,
  },

  // Header
  headerSection: {
    marginBottom: 32,
  },
  titleContainer: {
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "Futura" : "sans-serif-condensed",
    textShadowColor: "rgba(0, 255, 136, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  motivationalText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    textAlign: "center",
  },

  // Next Workout
  nextWorkoutCard: {
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
    position: "relative",
    overflow: "hidden",
  },
  nextWorkoutGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 255, 136, 0.05)",
  },
  nextWorkoutContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 24,
  },
  nextWorkoutInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nextWorkoutTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 4,
  },
  nextWorkoutDesc: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "right",
    marginBottom: 8,
  },
  nextWorkoutMeta: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  nextWorkoutTime: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginRight: 4,
  },
  nextWorkoutButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },

  // Stats
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "right",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  },
  statCardGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: 32,
  },
  quickActionsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  quickActionText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },

  // Calendar
  calendarSection: {
    marginBottom: 32,
  },
  calendarContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  calendar: {
    borderRadius: 16,
  },
  calendarLoading: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 12,
    fontSize: 14,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "rgba(20, 20, 20, 0.95)",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "60%",
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  modalWorkoutItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalWorkoutText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    marginHorizontal: 12,
    textAlign: "right",
  },
  modalWorkoutTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
});

export default DashboardScreen;
