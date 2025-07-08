// src/screens/workouts/ActiveWorkoutScreen.tsx - ✅ Fixed All Errors

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { useWorkoutStore } from "../../stores/workoutStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { WorkoutExercise, WorkoutSet } from "../../types/workout";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// צבעים ספציפיים לאימון פעיל
const workoutColors = {
  primary: colors.primary,
  background: colors.background,
  surface: colors.surface,
  text: colors.text,
  subtext: colors.textSecondary,
  accent: colors.accent,
  border: colors.border,
  success: colors.success,

  // צבעים לסטטוסי סטים
  pending: colors.warning,
  completed: colors.success,
  active: colors.primary,

  // צבעים לכרטיסים
  cardBg: colors.cardBackground,
  inputBg: "rgba(255,255,255,0.1)",
};

// 🏋️ רכיב תרגיל פעיל עם אנימציות
const ActiveExerciseCard = ({
  exercise,
  isActive,
}: {
  exercise: WorkoutExercise;
  isActive: boolean;
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
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.muscleTag}>
          <Text style={styles.muscleText}>{exercise.category || "אחר"}</Text>
        </View>
      </View>

      {exercise.sets.map((set, index) => (
        <SetRow
          key={set.id}
          set={set}
          setIndex={index}
          onWeightChange={(weight) =>
            updateSet(exercise.id, set.id, { weight })
          }
          onRepsChange={(reps) => updateSet(exercise.id, set.id, { reps })}
          onComplete={() => toggleSetCompleted(exercise.id, set.id)}
          isActive={isActive}
        />
      ))}
    </Animated.View>
  );
};

// 💪 רכיב סט בודד
const SetRow = ({
  set,
  setIndex,
  onWeightChange,
  onRepsChange,
  onComplete,
  isActive,
}: {
  set: WorkoutSet;
  setIndex: number;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
  onComplete: () => void;
  isActive: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const getSetColor = () => {
    switch (set.status) {
      case "completed":
        return workoutColors.completed;
      case "skipped":
        return workoutColors.subtext;
      default:
        return isActive ? workoutColors.active : workoutColors.pending;
    }
  };

  useEffect(() => {
    if (set.status === "completed") {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [set.status, scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.setRow,
        {
          borderColor: getSetColor(),
          transform: [{ scale: scaleAnim }],
          opacity:
            set.status === "skipped"
              ? 0.5
              : set.status === "completed"
              ? 0.8
              : 1,
        },
      ]}
    >
      <View style={styles.setHeader}>
        <Text style={[styles.setNumber, { color: getSetColor() }]}>
          סט {setIndex + 1}
        </Text>
      </View>

      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>משקל (קג)</Text>
          <TextInput
            style={[styles.setInput, { borderColor: getSetColor() }]}
            value={set.weight?.toString() || "0"}
            onChangeText={(text) => {
              const weight = parseFloat(text) || 0;
              onWeightChange(weight);
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
            editable={set.status !== "completed"}
          />
        </View>

        <Text style={styles.inputSeparator}>×</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>חזרות</Text>
          <TextInput
            style={[styles.setInput, { borderColor: getSetColor() }]}
            value={set.reps?.toString() || "0"}
            onChangeText={(text) => {
              const reps = parseInt(text) || 0;
              onRepsChange(reps);
            }}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
            editable={set.status !== "completed"}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.completeButton,
          {
            backgroundColor:
              set.status === "completed"
                ? workoutColors.completed
                : workoutColors.pending,
          },
        ]}
        onPress={onComplete}
        disabled={set.status === "completed"}
      >
        <Text
          style={[
            styles.completeButtonText,
            { color: set.status === "completed" ? "#000" : workoutColors.text },
          ]}
        >
          {set.status === "completed" ? "הושלם ✓" : "סיימתי סט"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 📊 רכיב סטטיסטיקות בזמן אמת
const LiveStats = ({ workout }: { workout: any }) => {
  const stats = useMemo(() => {
    const completedSets =
      workout?.exercises?.flatMap((ex: WorkoutExercise) =>
        ex.sets.filter((set) => set.status === "completed")
      ) || [];

    const totalSets =
      workout?.exercises?.reduce(
        (sum: number, ex: WorkoutExercise) => sum + ex.sets.length,
        0
      ) || 0;

    return {
      totalVolume: completedSets.reduce(
        (sum: number, set: WorkoutSet) =>
          sum + (set.weight || 0) * (set.reps || 0),
        0
      ),
      completedSets: completedSets.length,
      totalSets,
      progress: totalSets > 0 ? (completedSets.length / totalSets) * 100 : 0,
    };
  }, [workout]);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>נפח</Text>
        <Text style={styles.statValue}>{Math.round(stats.totalVolume)}kg</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>סטים</Text>
        <Text style={styles.statValue}>
          {stats.completedSets}/{stats.totalSets}
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>התקדמות</Text>
        <Text style={styles.statValue}>{Math.round(stats.progress)}%</Text>
      </View>
    </View>
  );
};

// 🏃‍♂️ המסך הראשי לאימון פעיל
const ActiveWorkoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const {
    activeWorkout,
    currentExerciseIndex,
    goToNextExercise,
    goToPrevExercise,
    finishWorkout,
  } = useWorkoutStore();

  const [workoutStartTime] = useState(new Date().toISOString());

  const currentExercise = activeWorkout?.exercises[currentExerciseIndex];

  const handleNextExercise = () => {
    const hasNext = goToNextExercise();
    if (!hasNext) {
      // האימון הסתיים
      Alert.alert("כל הכבוד! 🎉", "סיימת את האימון בהצלחה!", [
        {
          text: "סיים אימון",
          style: "default",
          onPress: () => {
            finishWorkout();
            navigation.navigate("WorkoutSummary", {
              workoutData: {
                ...activeWorkout,
                startedAt: workoutStartTime,
                completedAt: new Date().toISOString(),
              },
            });
          },
        },
      ]);
    }
  };

  const handlePrevExercise = () => {
    goToPrevExercise();
  };

  const handleFinishWorkout = () => {
    Alert.alert("סיום אימון", "האם אתה בטוח שברצונך לסיים את האימון?", [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "סיים אימון",
        style: "destructive",
        onPress: () => {
          finishWorkout();
          navigation.navigate("WorkoutSummary", {
            workoutData: {
              ...activeWorkout,
              startedAt: workoutStartTime,
              completedAt: new Date().toISOString(),
            },
          });
        },
      },
    ]);
  };

  if (!activeWorkout || !currentExercise) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="barbell-outline"
          size={64}
          color={workoutColors.subtext}
        />
        <Text style={styles.emptyText}>אין אימון פעיל</Text>
        <Button
          title="התחל אימון חדש"
          onPress={() => navigation.navigate("StartWorkout")}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleFinishWorkout}>
          <Ionicons name="close" size={28} color={workoutColors.text} />
        </TouchableOpacity>
        <Text style={styles.workoutTitle}>{activeWorkout.name}</Text>
        <TouchableOpacity>
          <Ionicons name="timer-outline" size={28} color={workoutColors.text} />
        </TouchableOpacity>
      </View>

      {/* Live Stats */}
      <LiveStats workout={activeWorkout} />

      {/* Exercise Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeWorkout.exercises.map((exercise, index) => (
          <ActiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            isActive={index === currentExerciseIndex}
          />
        ))}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <Button
          title="תרגיל קודם"
          onPress={handlePrevExercise}
          variant="outline"
          disabled={currentExerciseIndex === 0}
          style={styles.navButton}
        />

        <Text style={styles.exerciseCounter}>
          {currentExerciseIndex + 1} / {activeWorkout.exercises.length}
        </Text>

        <Button
          title={
            currentExerciseIndex === activeWorkout.exercises.length - 1
              ? "סיים אימון"
              : "תרגיל הבא"
          }
          onPress={handleNextExercise}
          variant="primary"
          style={styles.navButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: workoutColors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: workoutColors.background,
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    color: workoutColors.subtext,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    backgroundColor: workoutColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.text,
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: workoutColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: workoutColors.subtext,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.text,
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Exercise Card
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
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
    flex: 1,
  },
  muscleTag: {
    backgroundColor: workoutColors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  muscleText: {
    fontSize: 12,
    color: workoutColors.primary,
    fontWeight: "600",
  },

  // Set Row
  setRow: {
    backgroundColor: workoutColors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  setHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  setInputs: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    gap: 16,
  },
  inputGroup: {
    alignItems: "center",
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: workoutColors.subtext,
    marginBottom: 8,
    textAlign: "center",
  },
  setInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    minWidth: 80,
  },
  inputSeparator: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.accent,
    marginTop: 20,
  },
  completeButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Navigation
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: workoutColors.surface,
    borderTopWidth: 1,
    borderTopColor: workoutColors.border,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  exerciseCounter: {
    fontSize: 16,
    fontWeight: "bold",
    color: workoutColors.text,
    marginHorizontal: 16,
  },
});

export default ActiveWorkoutScreen;
