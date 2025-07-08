// src/screens/workouts/ActiveWorkoutScreen.tsx
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
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
  skipped: colors.error,

  // צבעים לכרטיסים
  cardBg: colors.cardBackground || colors.surface,
  inputBg: "rgba(255,255,255,0.1)",
};

// 🏋️ רכיב תרגיל פעיל עם אנימציות
const ActiveExerciseCard = ({
  exercise,
  isActive,
  onSetUpdate,
  onSetComplete,
}: {
  exercise: WorkoutExercise;
  isActive: boolean;
  onSetUpdate: (
    setId: string,
    values: { weight?: number; reps?: number }
  ) => void;
  onSetComplete: (setId: string) => void;
}) => {
  const slideAnim = useRef(new Animated.Value(isActive ? 0 : 300)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isActive ? 0 : 300,
      useNativeDriver: true,
      tension: 40,
      friction: 8,
    }).start();
  }, [isActive, slideAnim]);

  const handleSetComplete = (setId: string) => {
    // אנימציה של השלמת סט
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // רטט
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    onSetComplete(setId);
  };

  if (!isActive) return null;

  return (
    <Animated.View
      style={[
        styles.exerciseCard,
        {
          transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.setsProgress}>
          <Text style={styles.setsProgressText}>
            {exercise.sets.filter((s) => s.status === "completed").length} /{" "}
            {exercise.sets.length} סטים
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {exercise.sets.map((set, index) => (
          <SetCard
            key={set.id}
            set={set}
            setNumber={index + 1}
            onUpdate={(values) => onSetUpdate(set.id, values)}
            onComplete={() => handleSetComplete(set.id)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

// 💪 רכיב כרטיס סט
const SetCard = ({
  set,
  setNumber,
  onUpdate,
  onComplete,
}: {
  set: WorkoutSet;
  setNumber: number;
  onUpdate: (values: { weight?: number; reps?: number }) => void;
  onComplete: () => void;
}) => {
  const [weight, setWeight] = useState(set.weight?.toString() || "");
  const [reps, setReps] = useState(set.reps?.toString() || "");
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isCompleted = set.status === "completed";

  const getBorderColor = () => {
    switch (set.status) {
      case "completed":
        return workoutColors.completed;
      case "active":
        return workoutColors.active;
      case "skipped":
        return workoutColors.skipped;
      default:
        return workoutColors.border;
    }
  };

  const handleComplete = () => {
    const weightNum = parseFloat(weight) || 0;
    const repsNum = parseInt(reps) || 0;

    if (weightNum === 0 || repsNum === 0) {
      Toast.error("אנא הכנס משקל וחזרות");
      return;
    }

    onUpdate({ weight: weightNum, reps: repsNum });
    onComplete();

    // אנימציה
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.setCard,
        {
          borderColor: getBorderColor(),
          transform: [{ scale: scaleAnim }],
          opacity: isCompleted ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.setHeader}>
        <Text style={[styles.setNumber, isCompleted && styles.completedText]}>
          סט {setNumber}
        </Text>
        {isCompleted && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={workoutColors.completed}
          />
        )}
      </View>

      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>משקל (ק"ג)</Text>
          <TextInput
            style={[
              styles.setInput,
              isCompleted && styles.completedInput,
              { borderColor: getBorderColor() },
            ]}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
            editable={!isCompleted}
          />
        </View>

        <Text style={styles.inputSeparator}>×</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>חזרות</Text>
          <TextInput
            style={[
              styles.setInput,
              isCompleted && styles.completedInput,
              { borderColor: getBorderColor() },
            ]}
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
            editable={!isCompleted}
          />
        </View>
      </View>

      {!isCompleted && (
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              backgroundColor:
                weight && reps ? workoutColors.primary : workoutColors.border,
            },
          ]}
          onPress={handleComplete}
          disabled={!weight || !reps}
        >
          <Text style={styles.completeButtonText}>
            {weight && reps ? "סיים סט" : "הכנס נתונים"}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// 📊 רכיב סטטיסטיקות אימון
const WorkoutStats = ({ workout }: { workout: any }) => {
  const stats = useMemo(() => {
    if (!workout)
      return { totalVolume: 0, completedSets: 0, totalSets: 0, progress: 0 };

    const completedSets = workout.exercises.flatMap((ex: WorkoutExercise) =>
      ex.sets.filter((s) => s.status === "completed")
    );

    const totalSets = workout.exercises.reduce(
      (sum: number, ex: WorkoutExercise) => sum + ex.sets.length,
      0
    );

    const totalVolume = completedSets.reduce(
      (sum: number, set: WorkoutSet) =>
        sum + (set.weight || 0) * (set.reps || 0),
      0
    );

    return {
      totalVolume,
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
    updateSet,
    toggleSetCompleted,
    goToNextExercise,
    goToPrevExercise,
    finishWorkout,
  } = useWorkoutStore();

  const [workoutStartTime] = useState(new Date().toISOString());

  const currentExercise = activeWorkout?.exercises[currentExerciseIndex];

  const handleSetUpdate = useCallback(
    (setId: string, values: { weight?: number; reps?: number }) => {
      if (currentExercise) {
        updateSet(currentExercise.id, setId, values);
      }
    },
    [currentExercise, updateSet]
  );

  const handleSetComplete = useCallback(
    (setId: string) => {
      if (currentExercise) {
        toggleSetCompleted(currentExercise.id, setId);
      }
    },
    [currentExercise, toggleSetCompleted]
  );

  const handleNextExercise = () => {
    const hasNext = goToNextExercise();
    if (!hasNext) {
      // האימון הסתיים
      Alert.alert("כל הכבוד! 🎉", "סיימת את האימון בהצלחה!", [
        {
          text: "סיים אימון",
          style: "default",
          onPress: async () => {
            const finishedWorkout = await finishWorkout();
            navigation.navigate("WorkoutSummary", {
              workoutData: {
                ...finishedWorkout,
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
        onPress: async () => {
          const finishedWorkout = await finishWorkout();
          navigation.navigate("WorkoutSummary", {
            workoutData: {
              ...finishedWorkout,
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
      <View style={styles.container}>
        <Text style={styles.errorText}>לא נמצא אימון פעיל</Text>
        <Button
          title="חזור למסך הבית"
          onPress={() => navigation.navigate("Main")}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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

      {/* Stats */}
      <WorkoutStats workout={activeWorkout} />

      {/* Exercise Cards */}
      <View style={styles.exerciseContainer}>
        {activeWorkout.exercises.map((exercise, index) => (
          <ActiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            isActive={index === currentExerciseIndex}
            onSetUpdate={handleSetUpdate}
            onSetComplete={handleSetComplete}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <Button
          title="תרגיל קודם"
          onPress={handlePrevExercise}
          disabled={currentExerciseIndex === 0}
          style={styles.navButton}
          variant="outline"
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
          style={styles.navButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: workoutColors.background,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    backgroundColor: workoutColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
  },

  // Error
  errorText: {
    fontSize: 18,
    color: workoutColors.text,
    textAlign: "center",
    marginVertical: 20,
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
    fontSize: 12,
    color: workoutColors.subtext,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.text,
  },

  // Exercise Container
  exerciseContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  // Exercise Card
  exerciseCard: {
    backgroundColor: workoutColors.cardBg,
    borderRadius: 16,
    padding: 20,
    flex: 1,
  },
  exerciseHeader: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  setsProgress: {
    backgroundColor: `${workoutColors.primary}20`,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  setsProgressText: {
    fontSize: 14,
    color: workoutColors.primary,
    fontWeight: "600",
  },

  // Set Card
  setCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
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
    color: workoutColors.text,
  },
  completedText: {
    color: workoutColors.completed,
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
  },
  setInput: {
    backgroundColor: workoutColors.inputBg,
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    minWidth: 80,
  },
  completedInput: {
    opacity: 0.6,
  },
  inputSeparator: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.accent,
    marginTop: 20,
  },
  completeButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
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
