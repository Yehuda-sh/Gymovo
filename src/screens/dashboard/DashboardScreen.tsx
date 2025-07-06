// src/screens/dashboard/DashboardScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
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

// קונפיגורציה חד-פעמית לתרגום לוח השנה לעברית
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

// --- רכיבי משנה ---

// רכיב המציג באנר למשתמשים אורחים, המעודד הרשמה
const GuestBanner = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.guestBanner}>
      <Text style={styles.guestBannerText}>רוצה לשמור את ההתקדמות שלך?</Text>
      <Button
        title="הירשם בחינם"
        onPress={() => navigation.navigate("Signup")}
        variant="primary"
        style={{ marginTop: 10, width: "100%" }}
      />
    </View>
  );
};

// רכיב המציג כרטיס סטטיסטיקה בודד
const QuickStatCard = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
}) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={22} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// רכיב המציג את האימון הבא המומלץ
const NextWorkoutWidget = ({
  nextWorkout,
}: {
  nextWorkout: { planName: string; dayName: string } | null;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  if (!nextWorkout) return null;
  return (
    <View style={styles.nextWorkoutCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nextWorkoutTitle}>האימון הבא שלך:</Text>
        <Text
          style={styles.nextWorkoutDesc}
          numberOfLines={1}
        >{`${nextWorkout.planName} - ${nextWorkout.dayName}`}</Text>
      </View>
      <Button
        title="התחל"
        onPress={() => navigation.navigate("SelectPlan")}
        style={styles.nextWorkoutButton}
      />
    </View>
  );
};

// --- רכיב המסך הראשי ---

const DashboardScreen = () => {
  // --- Hooks וניהול מצב ---
  const user = useUserStore((state: UserState) => state.user);
  const status = useUserStore((state: UserState) => state.status);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: workoutHistory, isLoading } = useWorkoutHistory();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateWorkouts, setSelectedDateWorkouts] = useState<Workout[]>(
    []
  );

  // --- חישובים ונתונים (useMemo לשיפור ביצועים) ---

  // חישוב התאריכים המסומנים עבור לוח השנה
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

  // חישוב סטטיסטיקות עבור השבוע האחרון
  const weeklyStats = useMemo(() => {
    if (!workoutHistory) return { count: 0, volume: 0 };
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

    return { count: recentWorkouts.length, volume: totalVolume };
  }, [workoutHistory]);

  // לוגיקה להמלצה על האימון הבא
  const nextWorkoutSuggestion = useMemo(() => {
    // TODO: בעתיד, נוכל לבנות לוגיקה מורכבת יותר על בסיס התקדמות אמיתית
    if (!workoutHistory || workoutHistory.length === 0) {
      return {
        planName: demoPlans[0].name,
        dayName: demoPlans[0].days[0].name,
      };
    }
    return null;
  }, [workoutHistory]);

  // --- פונקציות ואינטראקציה ---

  // פתיחת המודאל עם האימונים של היום הנבחר
  const handleDayPress = (day: { dateString: string }) => {
    const workouts =
      workoutHistory?.filter((w) => w.date.startsWith(day.dateString)) || [];
    if (workouts.length > 0) {
      setSelectedDateWorkouts(workouts);
      setModalVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* הצגה מותנית של הבאנר לאורחים */}
      {status === "guest" && <GuestBanner />}
      <Text style={styles.title}>
        {user?.name ? `ברוך שובך, ${user.name}!` : "ברוך הבא ל-Gymovo!"}
      </Text>

      {/* ווידג'ט להצגת האימון הבא */}
      <NextWorkoutWidget nextWorkout={nextWorkoutSuggestion} />

      {/* אזור סטטיסטיקות מהירות */}
      <View style={styles.statsContainer}>
        <QuickStatCard
          icon="barbell-outline"
          label="אימונים השבוע"
          value={weeklyStats.count}
        />
        <QuickStatCard
          icon="flame-outline"
          label="נפח שבועי (קג)"
          value={weeklyStats.volume.toLocaleString()}
        />
        <QuickStatCard
          icon="trophy-outline"
          label="שיא אישי"
          value={`120 קג`}
        />
      </View>

      {/* לוח השנה האינטראקטיבי */}
      {isLoading ? (
        <ActivityIndicator
          style={{ marginVertical: 20 }}
          color={colors.primary}
        />
      ) : (
        <Calendar
          current={new Date().toISOString().split("T")[0]}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          monthFormat={"MMMM yyyy"}
          firstDay={0}
          enableSwipeMonths={true}
          style={styles.calendar}
          theme={{
            arrowColor: colors.primary,
            todayTextColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
          }}
        />
      )}

      {/* כפתורים לפעולות נוספות */}
      <View style={styles.buttonContainer}>
        <Button
          title="צפה בתוכניות שלי"
          onPress={() => navigation.navigate("Main", { screen: "Plans" })}
          variant="secondary"
        />
      </View>

      {/* מודאל להצגת אימונים בתאריך שנבחר */}
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
            <Text style={styles.modalTitle}>אימונים ביום זה</Text>
            {selectedDateWorkouts.map((w) => (
              <Text key={w.id} style={styles.modalWorkoutText}>
                - {w.name}
              </Text>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  guestBanner: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    alignItems: "center",
  },
  guestBannerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  nextWorkoutCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  nextWorkoutTitle: { color: "white", fontSize: 14, textAlign: "right" },
  nextWorkoutDesc: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
    textAlign: "right",
  },
  nextWorkoutButton: {
    width: "auto",
    paddingHorizontal: 20,
    marginVertical: 0,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  statsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    flex: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 4 },
  statLabel: { fontSize: 12, color: "#666", marginTop: 2 },
  calendar: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "right",
  },
  modalWorkoutText: {
    fontSize: 16,
    paddingVertical: 5,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});

export default DashboardScreen;
