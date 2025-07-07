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
import {
  ActiveWorkout,
  isActiveWorkout,
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from "../../types/workout";

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
  // ✅ Fixed: Use workoutData instead of workout and handle both Workout and ActiveWorkout types
  const { workoutData } = route.params;
  const workout = workoutData as Workout | ActiveWorkout;

  const userId = useUserStore((state: UserState) => state.user?.id);

  const [notes, setNotes] = useState(workout.notes || "");
  const [rating, setRating] = useState(workout.rating || 0);

  const totalVolume = useMemo(() => {
    if (!workout?.exercises) return 0;
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

  // ✅ Fixed: Handle both ActiveWorkout and Workout types properly
  const workoutDuration = useMemo(() => {
    // Check if it's an ActiveWorkout with startedAt
    if (isActiveWorkout(workout) && workout.startedAt && workout.completedAt) {
      const start = new Date(workout.startedAt);
      const end = new Date(workout.completedAt);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // in minutes
    }

    // Fall back to duration field or 0
    return workout.duration || 0;
  }, [workout]);

  // ✅ Fixed: Calculate start time safely
  const workoutStartTime = useMemo(() => {
    if (isActiveWorkout(workout) && workout.startedAt) {
      return new Date(workout.startedAt).toLocaleTimeString("he-IL", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return null;
  }, [workout]);

  const handleFinishAndSave = async () => {
    if (!userId) {
      Toast.show("לא ניתן לשמור אימון למשתמש אורח", "error");
      navigation.popToTop();
      return;
    }

    // Create completed workout - remove ActiveWorkout specific fields
    const completedWorkout: Workout = {
      id: workout.id,
      name: workout.name,
      date: workout.date,
      exercises: workout.exercises,
      notes: notes,
      rating: rating,
      completedAt: workout.completedAt || new Date().toISOString(),
      duration: workoutDuration,
      difficulty: workout.difficulty,
      targetMuscles: workout.targetMuscles,
      calories: workout.calories,
      intensityLevel: workout.intensityLevel,
      workoutType: workout.workoutType,
      planId: workout.planId,
      templateId: workout.templateId,
      createdAt: workout.createdAt,
      updatedAt: new Date().toISOString(),
      isTemplate: workout.isTemplate,
      goals: workout.goals,
      results: workout.results,
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
    // ✅ Fixed: Remove unused variable warning by using the shareText
    const shareText = `סיימתי אימון מעולה!
📊 ${completedSets}/${totalSets} סטים
⏱️ ${workoutDuration} דקות
💪 ${totalVolume.toLocaleString()}ק"ג נפח כולל
⭐ ${rating}/5

#Gymovo #אימון #כושר`;

    // Share the workout (you can implement actual sharing later)
    console.log("Sharing workout:", shareText);
    Toast.show("תכונת שיתוף תבוא בעדכון הבא!", "info");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>סיכום אימון</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleShareWorkout}
        >
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Workout Info */}
        <View style={styles.workoutNameContainer}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDate}>
            {new Date(workout.date || new Date()).toLocaleDateString("he-IL")}
            {workoutStartTime && ` • ${workoutStartTime}`}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            label="זמן"
            value={`${workoutDuration} דק'`}
            icon="time-outline"
          />
          <StatCard
            label="סטים"
            value={`${completedSets}/${totalSets}`}
            icon="fitness-outline"
          />
          <StatCard
            label="נפח כולל"
            value={`${totalVolume.toLocaleString()}ק"ג`}
            icon="barbell-outline"
          />
        </View>

        {/* Exercises Breakdown */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>פירוט תרגילים</Text>
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseBlock}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.sets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setRow}>
                  <Text style={styles.setText}>סט {setIndex + 1}:</Text>
                  <Text style={[styles.setText, styles.bold]}>
                    {set.weight ? `${set.weight}ק"ג × ` : ""}
                    {set.reps ? `${set.reps} חזרות` : ""}
                    {set.duration ? ` • ${set.duration}"` : ""}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Feedback Section */}
        <View style={styles.feedbackSection}>
          <Text style={styles.sectionTitle}>איך היה האימון?</Text>
          <EffortRating rating={rating} onRate={setRating} />

          <Input
            label="הערות"
            value={notes}
            onChangeText={setNotes}
            placeholder="איך היה האימון? הערות להבא..."
            multiline
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
    </View>
  );
};

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
    paddingTop: 60,
    paddingBottom: 20,
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
