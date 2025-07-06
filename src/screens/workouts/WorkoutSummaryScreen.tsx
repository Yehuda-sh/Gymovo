// File: src/screens/workouts/WorkoutSummaryScreen.tsx
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
  const { workout } = route.params;
  const userId = useUserStore((state: UserState) => state.user?.id);

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);

  const totalVolume = useMemo(() => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((exTotal, set) => {
        return exTotal + set.weight * set.reps;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }, [workout.exercises]);

  const totalSets = useMemo(() => {
    if (!workout?.exercises) return 0;
    return workout.exercises.reduce(
      (total, exercise) => total + exercise.sets.length,
      0
    );
  }, [workout.exercises]);

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
    };

    const success = await saveWorkoutToHistory(userId, completedWorkout);
    if (success) {
      Toast.show("האימון נשמר בהצלחה!");
    } else {
      Toast.show("אירעה שגיאה בשמירת האימון", "error");
    }
    navigation.popToTop();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>כל הכבוד!</Text>
      <Text style={styles.subHeader}>סיכום האימון שלך</Text>

      <View style={styles.statsContainer}>
        <StatCard label="נפח כולל (קג)" value={totalVolume} icon="barbell" />
        <StatCard
          label="תרגילים"
          value={workout.exercises.length}
          icon="analytics-outline"
        />
        <StatCard label="סטים" value={totalSets} icon="layers" />
      </View>

      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>איך הרגשת באימון?</Text>
        <EffortRating rating={rating} onRate={setRating} />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          הערות אישיות
        </Text>
        <Input
          value={notes}
          onChangeText={setNotes}
          placeholder="איך היה האימון, דגשים לפעם הבאה..."
          multiline
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />
      </View>

      {workout.exercises.map((ex: WorkoutExercise) => (
        <View key={ex.id} style={styles.exerciseBlock}>
          <Text style={styles.exerciseName}>{ex.exercise.name}</Text>
          {ex.sets.map((set: WorkoutSet, idx: number) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={styles.setText}>
                <Text style={styles.bold}>סט {idx + 1}:</Text> {set.weight} קג ×{" "}
                {set.reps} חזרות
              </Text>
            </View>
          ))}
        </View>
      ))}
      <Button
        title="סיום ושמירה"
        onPress={handleFinishAndSave}
        variant="primary"
        style={{ marginTop: 24 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.primary,
  },
  subHeader: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
  },
  statsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  feedbackSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 12,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
  },
  exerciseBlock: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "100%",
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    textAlign: "right",
  },
  setRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  setText: {
    fontSize: 16,
    textAlign: "right",
    width: "100%",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default WorkoutSummaryScreen;
