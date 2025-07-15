// src/screens/workouts/WorkoutSummaryScreen.tsx
// מסך סיכום אימון מעודכן ומתוקן עם עיצוב מודרני

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Toast } from "../../components/common/Toast"; // תיקון: named import
import { saveWorkoutToHistory } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Workout, WorkoutExercise, WorkoutSet } from "../../types/workout";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSummary">;

// רכיב כרטיס סטטיסטיקה
const StatCard = ({
  label,
  value,
  icon,
  gradient,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string, ...string[]]; // תיקון: לפחות 2 צבעים
}) => (
  <TouchableOpacity
    style={styles.statCard}
    activeOpacity={0.8}
    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
  >
    <LinearGradient
      colors={gradient}
      style={styles.statCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Ionicons name={icon} size={28} color="#fff" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

// רכיב דירוג מאמץ
const EffortRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) => (
  <View style={styles.ratingContainer}>
    {[1, 2, 3, 4, 5].map((r) => (
      <TouchableOpacity
        key={r}
        onPress={() => {
          onRate(r);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={styles.starButton}
      >
        <Ionicons
          name={r <= rating ? "star" : "star-outline"}
          size={36}
          color={r <= rating ? "#FFD700" : colors.border}
        />
      </TouchableOpacity>
    ))}
  </View>
);

// רכיב תרגיל מסוכם
const ExerciseSummaryItem = ({ exercise }: { exercise: WorkoutExercise }) => {
  const completedSets = exercise.sets.filter(
    (set) => set.status === "completed"
  ).length;
  const totalVolume = exercise.sets.reduce((sum, set) => {
    if (set.status === "completed") {
      return sum + (set.weight || 0) * (set.reps || 0);
    }
    return sum;
  }, 0);

  return (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <Text style={styles.exerciseVolume}>{totalVolume} ק&quot;ג</Text>
      </View>

      <View style={styles.setsContainer}>
        {exercise.sets.map((set: WorkoutSet, index: number) => {
          if (set.status !== "completed") return null;

          return (
            <View key={set.id} style={styles.setChip}>
              <Text style={styles.setChipText}>
                {set.weight}kg × {set.reps}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={styles.completedSetsText}>
        {completedSets}/{exercise.sets.length} סטים הושלמו
      </Text>
    </View>
  );
};

// רכיב ראשי
const WorkoutSummaryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;
  const user = useUserStore((state: UserState) => state.user);
  const [effort, setEffort] = useState(3);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // חישוב סטטיסטיקות האימון
  const workoutStats = useMemo(() => {
    const totalVolume = workout.totalVolume || 0;
    const totalSets = workout.totalSets || 0;
    const completedSets = workout.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.filter((s) => s.status === "completed").length,
      0
    );

    const completionRate =
      totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return {
      duration: workout.duration || 0,
      exercises: workout.exercises.length,
      totalSets,
      completedSets,
      totalVolume,
      completionRate,
    };
  }, [workout]);

  // שמירת האימון
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const workoutToSave: Workout = {
        ...workout,
        notes,
        mood:
          effort === 5
            ? "great"
            : effort === 4
            ? "good"
            : effort === 3
            ? "okay"
            : effort === 2
            ? "tired"
            : "bad",
        energyLevel: effort * 2, // המרה מ-1-5 ל-2-10
      };

      const success = await saveWorkoutToHistory(
        user?.id || "guest",
        workoutToSave
      );

      if (success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.success("האימון נשמר בהצלחה! 💪");

        setTimeout(() => {
          navigation.navigate("Main", { screen: "Home" });
        }, 1500);
      } else {
        throw new Error("Failed to save workout");
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.error("שגיאה בשמירת האימון");
    } finally {
      setIsSaving(false);
    }
  };

  // שיתוף האימון
  const handleShare = async () => {
    try {
      const message = `🎯 סיימתי אימון ב-Gymovo!

📊 סיכום האימון:
⏱ ${workoutStats.duration} דקות
💪 ${workoutStats.exercises} תרגילים
✅ ${workoutStats.completedSets}/${workoutStats.totalSets} סטים
📈 ${workoutStats.totalVolume.toLocaleString()} ק"ג נפח כולל
🎯 ${workoutStats.completionRate}% השלמה

#Gymovo #כושר #אימון`;

      await Share.share({
        message,
        title: "האימון שלי ב-Gymovo",
      });

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      if (error instanceof Error && error.message !== "User did not share") {
        console.error("Error sharing:", error);
      }
    }
  };

  // פונקציה ליציאה ללא שמירה
  const handleExitWithoutSaving = () => {
    Alert.alert(
      "יציאה ללא שמירה",
      "האם אתה בטוח שברצונך לצאת מבלי לשמור את האימון?",
      [
        {
          text: "ביטול",
          style: "cancel",
        },
        {
          text: "צא ללא שמירה",
          style: "destructive",
          onPress: () => navigation.navigate("Main", { screen: "Home" }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={[colors.primary + "20", "transparent"] as [string, string]}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>כל הכבוד! 🎉</Text>
        <Text style={styles.subtitle}>סיימת את האימון בהצלחה</Text>
        <Text style={styles.workoutName}>{workout.planName}</Text>
        {workout.dayName && (
          <Text style={styles.workoutDay}>{workout.dayName}</Text>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          label="זמן"
          value={`${workoutStats.duration}'`}
          icon="timer-outline"
          gradient={
            [colors.primary, colors.primaryDark || colors.primary] as [
              string,
              string
            ]
          }
        />
        <StatCard
          label="תרגילים"
          value={workoutStats.exercises}
          icon="barbell-outline"
          gradient={["#10B981", "#059669"] as [string, string]}
        />
        <StatCard
          label="סטים"
          value={`${workoutStats.completedSets}/${workoutStats.totalSets}`}
          icon="checkmark-circle-outline"
          gradient={["#F59E0B", "#D97706"] as [string, string]}
        />
        <StatCard
          label="נפח כולל"
          value={`${workoutStats.totalVolume.toLocaleString()} ק"ג`}
          icon="trending-up-outline"
          gradient={["#8B5CF6", "#6D28D9"] as [string, string]}
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          אחוז השלמה: {workoutStats.completionRate}%
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${workoutStats.completionRate}%` },
            ]}
          />
        </View>
      </View>

      {/* Exercise List */}
      <View style={styles.exerciseList}>
        <Text style={styles.sectionTitle}>תרגילים שבוצעו</Text>
        {workout.exercises.map((exercise: WorkoutExercise) => (
          <ExerciseSummaryItem key={exercise.id} exercise={exercise} />
        ))}
      </View>

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>איך הרגשת באימון?</Text>
        <EffortRating rating={effort} onRate={setEffort} />

        <Input
          label="הערות ומחשבות"
          value={notes}
          onChangeText={setNotes}
          placeholder="איך היה האימון? מה היה קל/קשה?"
          multiline
          style={styles.notesInput}
          numberOfLines={4}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title={isSaving ? "שומר..." : "שמור אימון"}
          onPress={handleSave}
          variant="primary"
          disabled={isSaving}
          style={styles.saveButton}
          iconName="save-outline"
        />

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["#4267B2", "#365899"] as [string, string]}
            style={styles.shareButtonGradient}
          >
            <Ionicons name="share-social-outline" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>שתף הישג</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exitButton}
          onPress={handleExitWithoutSaving}
        >
          <Text style={styles.exitButtonText}>צא ללא שמירה</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "600",
  },
  workoutDay: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "50%",
    padding: 8,
  },
  statCardGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },

  // Progress Section
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 6,
  },

  // Exercise List
  exerciseList: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  exerciseItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  exerciseVolume: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  setsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  setChip: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  setChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  completedSetsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },

  // Feedback Section
  feedbackSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },

  // Actions
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#4267B2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  exitButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  exitButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  bottomPadding: {
    height: 40,
  },
});

export default WorkoutSummaryScreen;
