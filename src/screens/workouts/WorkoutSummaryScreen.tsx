// src/screens/workouts/WorkoutSummaryScreen.tsx - ✅ Fixed with userId

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

  const workoutDuration = useMemo(() => {
    if (isActiveWorkout(workout) && workout.startedAt && workout.completedAt) {
      const start = new Date(workout.startedAt);
      const end = new Date(workout.completedAt);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }
    return workout.duration || 0;
  }, [workout]);

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

    // ✅ תיקון: הוספת userId לאובייקט updatedWorkout
    const updatedWorkout: Workout = {
      id: workout.id,
      name: workout.name,
      date: workout.date || new Date().toISOString(),
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
      createdAt: workout.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTemplate: workout.isTemplate,
      goals: workout.goals,
      results: workout.results || {
        totalSets: totalSets,
        completedSets: completedSets,
        totalWeight: totalVolume,
      },
      // ✅ הוספת userId - השדה החסר
      userId: userId,
    };

    try {
      const success = await saveWorkoutToHistory(userId, updatedWorkout);
      if (success) {
        Toast.show("האימון נשמר בהצלחה!", "success");
        navigation.popToTop();
      } else {
        Toast.show("שגיאה בשמירת האימון", "error");
      }
    } catch (error) {
      Toast.show("שגיאה בשמירת האימון", "error");
      console.error("Error saving workout:", error);
    }
  };

  const handleShareWorkout = async () => {
    const shareText = `סיימתי אימון מעולה! 💪

🏋️ ${workout.name}
⏱️ ${workoutDuration} דקות
💯 ${completedSets}/${totalSets} סטים
🎯 ${totalVolume.toFixed(0)} ק״ג נפח כולל
⭐ דירוג: ${rating}/5

#Gymovo #כושר #אימון`;

    try {
      await Share.share({
        message: shareText,
        title: "שיתוף אימון",
      });
    } catch (error) {
      console.error("Error sharing workout:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>סיכום אימון</Text>
        <Text style={styles.workoutName}>{workout.name}</Text>
        {workoutStartTime && (
          <Text style={styles.dateTime}>
            {new Date(workout.date || "").toLocaleDateString("he-IL")} •{" "}
            {workoutStartTime}
          </Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard
          label="משך זמן"
          value={`${workoutDuration} דק׳`}
          icon="time-outline"
        />
        <StatCard
          label="סטים"
          value={`${completedSets}/${totalSets}`}
          icon="list-outline"
        />
        <StatCard
          label="נפח כולל"
          value={`${totalVolume.toFixed(0)} ק״ג`}
          icon="barbell-outline"
        />
      </View>

      {/* Exercise Details */}
      <View style={styles.exerciseSection}>
        <Text style={styles.sectionTitle}>פירוט תרגילים</Text>
        {workout.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            {exercise.sets.map((set, index) => (
              <View key={set.id} style={styles.setRow}>
                <Text style={styles.setText}>
                  סט {index + 1}:{" "}
                  <Text style={styles.bold}>
                    {set.weight}ק״ג × {set.reps} חזרות
                  </Text>
                </Text>
                {set.status === "skipped" && (
                  <Text style={[styles.setText, { color: colors.warning }]}>
                    (דולג)
                  </Text>
                )}
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
          placeholder="איך הרגשת? מה היה טוב? מה אפשר לשפר?"
          multiline
          style={styles.notesInput}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          title="שמור אימון"
          onPress={handleFinishAndSave}
          style={styles.saveButton}
          disabled={!userId}
        />

        <TouchableOpacity onPress={handleShareWorkout}>
          <View style={styles.shareButton}>
            <Ionicons
              name="share-social-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.shareButtonText}>שתף אימון</Text>
          </View>
        </TouchableOpacity>

        <Button
          title="חזור לבית"
          onPress={() => navigation.popToTop()}
          variant="outline"
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
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
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
  },
  exerciseSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  setRow: {
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
