// src/screens/workouts/WorkoutSummaryScreen.tsx - Fixed Version

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
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Toast from "../../components/common/Toast"; // שינוי מ-named import ל-default
import { saveWorkoutToHistory } from "../../data/storage";
import { UserState, useUserStore } from "../../stores/userStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { Workout, WorkoutExercise, WorkoutSet } from "../../types/workout";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutSummary">;

const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
}) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={24} color={colors.primary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const EffortRating = ({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (r: number) => void;
}) => (
  <View style={styles.ratingContainer}>
    {[1, 2, 3, 4, 5].map((r) => (
      <TouchableOpacity key={r} onPress={() => onRate(r)}>
        <Ionicons
          name={r <= rating ? "star" : "star-outline"}
          size={32}
          color={r <= rating ? "#F59E0B" : colors.border}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const WorkoutSummaryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { workout } = route.params;
  const user = useUserStore((state: UserState) => state.user);
  const [effort, setEffort] = useState(3);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // חישוב סטטיסטיקות האימון
  const workoutStats = useMemo(() => {
    const totalVolume = workout.totalVolume || 0;
    const totalSets = workout.totalSets || 0;
    const completedSets = workout.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.filter((s) => s.status === "completed").length,
      0
    );

    return {
      duration: workout.duration || 0,
      exercises: workout.exercises.length,
      totalSets,
      completedSets,
      totalVolume,
    };
  }, [workout]);

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
        user?.id || "guest", // שינוי מ-uid ל-id
        workoutToSave // הפרמטרים בסדר הנכון
      );
      if (success) {
        Toast.success("האימון נשמר בהצלחה! 💪");
        setTimeout(() => {
          navigation.navigate("Main", { screen: "Home" });
        }, 1500);
      }
    } catch (error) {
      console.error("Failed to save workout:", error);
      Toast.error("שגיאה בשמירת האימון");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      const message = `סיימתי אימון ב-Gymovo! 💪
⏱ ${workoutStats.duration} דקות
🏋️ ${workoutStats.exercises} תרגילים
✅ ${workoutStats.completedSets} סטים
📊 ${workoutStats.totalVolume} ק"ג נפח כולל`;

      await Share.share({
        message,
        title: "האימון שלי ב-Gymovo",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>סיכום אימון</Text>
        <Text style={styles.workoutName}>{workout.planName}</Text>
        {workout.dayName && (
          <Text style={styles.workoutDay}>{workout.dayName}</Text>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          label="זמן"
          value={`${workoutStats.duration} דק'`}
          icon="timer-outline"
        />
        <StatCard
          label="תרגילים"
          value={workoutStats.exercises}
          icon="barbell-outline"
        />
        <StatCard
          label="סטים"
          value={`${workoutStats.completedSets}/${workoutStats.totalSets}`}
          icon="checkmark-circle-outline"
        />
        <StatCard
          label="נפח כולל"
          value={`${workoutStats.totalVolume} ק"ג`}
          icon="trending-up-outline"
        />
      </View>

      {/* Exercise List */}
      <View style={styles.exerciseList}>
        <Text style={styles.sectionTitle}>תרגילים שבוצעו</Text>
        {workout.exercises.map((exercise: WorkoutExercise) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.setsContainer}>
              {exercise.sets.map((set: WorkoutSet, index: number) => (
                <View key={set.id} style={styles.setItem}>
                  <Text style={styles.setText}>
                    סט {index + 1}:{" "}
                    <Text style={styles.bold}>
                      {set.weight}kg × {set.reps}
                    </Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>איך הרגשת?</Text>
        <EffortRating rating={effort} onRate={setEffort} />
        <Input
          label="הערות"
          value={notes}
          onChangeText={setNotes}
          placeholder="הוסף הערות על האימון..."
          multiline
          style={styles.notesInput}
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
        />
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.shareButtonText}>שתף</Text>
        </TouchableOpacity>
        <Button
          title="חזור לדף הבית"
          onPress={() => navigation.navigate("Main", { screen: "Home" })}
          variant="outline"
          style={styles.homeButton}
        />
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
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "600",
  },
  workoutDay: {
    fontSize: 16,
    color: colors.textSecondary, // שינוי מ-subtext
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statCard: {
    width: "50%",
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary, // שינוי מ-subtext
  },
  exerciseList: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
  },
  exerciseItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  setsContainer: {
    marginLeft: 16,
  },
  setItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  setText: {
    fontSize: 14,
    color: colors.text,
  },
  bold: {
    fontWeight: "bold",
  },
  feedbackSection: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    gap: 8,
  },
  shareButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    borderColor: colors.primary,
  },
  bottomPadding: {
    height: 20,
  },
});

export default WorkoutSummaryScreen;
