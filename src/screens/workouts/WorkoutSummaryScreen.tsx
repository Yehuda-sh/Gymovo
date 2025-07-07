// src/screens/workouts/WorkoutSummaryScreen.tsx - ✅ Fixed TypeScript Errors

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { Toast } from "../../components/common/Toast";
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
          color={colors.primary}
        />
      </TouchableOpacity>
    ))}
  </View>
);

const WorkoutSummaryScreen = ({ route, navigation }: Props) => {
  // ✅ Fixed: Use workoutData instead of workout
  const { workoutData } = route.params;
  const workout = workoutData as Workout; // Cast to Workout type for better type safety

  const userId = useUserStore((state: UserState) => state.user?.id);

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);

  const totalVolume = useMemo(() => {
    if (!workout?.exercises) return 0;
    // ✅ Fixed: Added type annotations to prevent implicit any
    return workout.exercises.reduce(
      (total: number, exercise: WorkoutExercise) => {
        const exerciseVolume = exercise.sets.reduce(
          (exTotal: number, set: WorkoutSet) => {
            return exTotal + (set.weight || 0) * (set.reps || 0);
          },
          0
        );
        return total + exerciseVolume;
      },
      0
    );
  }, [workout.exercises]);

  const totalSets = useMemo(() => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce(
      (total: number, exercise: WorkoutExercise) =>
        total + exercise.sets.length,
      0
    );
  }, [workout.exercises]);

  const completedSets = useMemo(() => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce(
      (total: number, exercise: WorkoutExercise) => {
        return (
          total +
          exercise.sets.filter(
            (set) => set.status === "completed" || set.completed
          ).length
        );
      },
      0
    );
  }, [workout.exercises]);

  const workoutDuration = useMemo(() => {
    if (workout.startedAt && workout.completedAt) {
      const start = new Date(workout.startedAt);
      const end = new Date(workout.completedAt);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // in minutes
    }
    return workout.duration || 0;
  }, [workout.startedAt, workout.completedAt, workout.duration]);

  const handleFinishAndSave = async () => {
    if (!userId) {
      Toast.show("לא ניתן לשמור אימון למשתמש אורח", "error");
      navigation.popToTop();
      return;
    }

    const completedWorkout: Workout = {
      ...workout,
      notes: notes,
      rating: rating,
      completedAt: workout.completedAt || new Date().toISOString(),
      duration: workoutDuration,
    };

    const success = await saveWorkoutToHistory(userId, completedWorkout);
    if (success) {
      Toast.show("האימון נשמר בהצלחה!", "success");
      navigation.popToTop();
    } else {
      Toast.show("שגיאה בשמירת האימון", "error");
    }
  };

  const handleShareWorkout = () => {
    const shareText =
      `סיימתי אימון מעולה! 💪\n` +
      `🏋️ ${totalSets} סטים\n` +
      `⚖️ ${Math.round(totalVolume)}kg נפח כולל\n` +
      `⏱️ ${workoutDuration} דקות\n` +
      `⭐ דירוג: ${rating}/5\n\n` +
      `#Gymovo #כושר #אימון`;

    // Here you would implement sharing functionality
    Toast.show("שיתוף יהיה זמין בקרוב!", "info");
  };

  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={styles.errorText}>לא נמצאו נתוני אימון</Text>
        <Button title="חזור" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>סיכום אימון</Text>
        <TouchableOpacity
          onPress={handleShareWorkout}
          style={styles.headerButton}
        >
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Workout Name */}
      <View style={styles.workoutNameContainer}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDate}>
          {new Date(
            workout.completedAt || workout.date || Date.now()
          ).toLocaleDateString("he-IL")}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <StatCard
          label="סטים הושלמו"
          value={`${completedSets}/${totalSets}`}
          icon="checkmark-circle-outline"
        />
        <StatCard
          label="נפח כולל"
          value={`${Math.round(totalVolume)}kg`}
          icon="barbell-outline"
        />
        <StatCard
          label="זמן אימון"
          value={`${workoutDuration}m`}
          icon="time-outline"
        />
      </View>

      {/* Exercise Summary */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>סיכום תרגילים</Text>
        {workout.exercises?.map((ex, index) => (
          <View key={index} style={styles.exerciseBlock}>
            <Text style={styles.exerciseName}>
              {/* ✅ Fixed: Added null check for ex.exercise */}
              {ex.exercise?.name || ex.name}
            </Text>
            {ex.sets.map((set, setIndex) => (
              <View key={setIndex} style={styles.setRow}>
                <Text style={[styles.setText, styles.bold]}>
                  סט {setIndex + 1}:
                </Text>
                <Text style={styles.setText}>
                  {set.weight || 0}kg × {set.reps || 0} חזרות
                  {set.status === "completed" || set.completed ? " ✅" : " ⏳"}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Rating Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>איך הרגשת באימון?</Text>
        <EffortRating rating={rating} onRate={setRating} />
      </View>

      {/* Notes Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>הערות (אופציונלי)</Text>
        <Input
          placeholder="איך היה האימון? מה למדת? איך אתה מרגיש?"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          title="שמור וסיים"
          onPress={handleFinishAndSave}
          style={styles.saveButton}
        />
        <Button
          title="חזור לבית"
          variant="outline"
          onPress={() => navigation.popToTop()}
          style={styles.homeButton}
        />
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    flex: 1,
  },

  // Workout Info
  workoutNameContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.surface,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },

  // Sections
  exercisesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "right",
  },
  exerciseBlock: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  setText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },

  // Feedback
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
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  // Actions
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  homeButton: {
    borderColor: colors.primary,
  },

  bottomPadding: {
    height: 20,
  },
});

export default WorkoutSummaryScreen;
