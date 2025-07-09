// src/screens/workouts/active-workout/components/ActiveExerciseCard.tsx

import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useWorkoutStore } from "../../../../stores/workoutStore";
import { ActiveExerciseCardProps, workoutColors } from "../types";
import ProgressRing from "./ProgressRing";
import SetRow from "./SetRow";

// 🏋️ רכיב תרגיל פעיל משופר
const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  exercise,
  isActive,
  onSetComplete,
}) => {
  const { updateSet, toggleSetCompleted } = useWorkoutStore();
  const slideAnim = useRef(new Animated.Value(isActive ? 0 : 300)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isActive ? 0 : 100,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: isActive ? 1 : 0.95,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isActive, slideAnim, scaleAnim]);

  const handleSetComplete = (exerciseId: string, setId: string) => {
    toggleSetCompleted(exerciseId, setId);
    onSetComplete();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // חישוב התקדמות התרגיל
  const completedSets = exercise.sets.filter(
    (set) => set.status === "completed"
  ).length;
  const totalSets = exercise.sets.length;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <Animated.View
      style={[
        styles.exerciseCard,
        {
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
          opacity: isActive ? 1 : 0.6,
        },
      ]}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.muscleTag}>
            <Text style={styles.muscleText}>{exercise.category || "אחר"}</Text>
          </View>
        </View>
        {isActive && <ProgressRing progress={progress} />}
      </View>

      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          set={set}
          setIndex={index}
          exerciseId={exercise.id}
          onWeightChange={(weight) =>
            updateSet(exercise.id, set.id, { weight })
          }
          onRepsChange={(reps) => updateSet(exercise.id, set.id, { reps })}
          onComplete={() => handleSetComplete(exercise.id, set.id)}
          isActive={isActive}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: workoutColors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: workoutColors.border,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  exerciseInfo: {
    flex: 1,
    gap: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "right",
  },
  muscleTag: {
    backgroundColor: workoutColors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  muscleText: {
    fontSize: 12,
    color: workoutColors.primary,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ActiveExerciseCard;
