// src/screens/workouts/ActiveWorkoutScreen.tsx - ✅ Fixed TypeScript Errors

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
  success: colors.success, // ✅ Added missing success color

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
      toValue: isActive ? 0 : 300,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isActive, slideAnim]);

  const handleSetComplete = useCallback(
    (setId: string) => {
      // אנימציית הצלחה
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

      // רטט
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      toggleSetCompleted(exercise.id, setId);
    },
    [exercise.id, scaleAnim, toggleSetCompleted]
  );

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
        {/* ✅ Fixed: Added null check for exercise.exercise */}
        <Text style={styles.exerciseName}>
          {exercise.exercise?.name || exercise.name}
        </Text>
        <View style={styles.setsProgress}>
          <Text style={styles.setsProgressText}>
            {exercise.sets.filter((s) => s.status === "completed").length}/
            {exercise.sets.length} סטים
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {exercise.sets.map((set, setIndex) => (
          <SetCard
            key={set.id || `set_${setIndex}`}
            set={set}
            setIndex={setIndex}
            onWeightChange={(weight) =>
              updateSet(exercise.id, set.id || `set_${setIndex}`, { weight })
            }
            onRepsChange={(reps) =>
              updateSet(exercise.id, set.id || `set_${setIndex}`, { reps })
            }
            onComplete={() => handleSetComplete(set.id || `set_${setIndex}`)}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
};

// 🎯 רכיב כרטיס סט בודד
const SetCard = ({
  set,
  setIndex,
  onWeightChange,
  onRepsChange,
  onComplete,
}: {
  set: WorkoutSet;
  setIndex: number;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
  onComplete: () => void;
}) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  const getSetColor = useCallback(() => {
    switch (set.status) {
      case "completed":
        return workoutColors.completed;
      default:
        return workoutColors.pending;
    }
  }, [set.status]);

  useEffect(() => {
    if (set.status === "completed") {
      // אנימציית זוהר בסיום
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [set.status, glowAnim]);

  return (
    <Animated.View
      style={[
        styles.setCard,
        {
          borderColor: getSetColor(),
          opacity: set.status === "completed" ? 0.8 : 1,
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
            value={set.weight?.toString() || "0"} // ✅ Fixed: Added fallback
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
            value={set.reps?.toString() || "0"} // ✅ Fixed: Added fallback
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
          sum + (set.weight || 0) * (set.reps || 0), // ✅ Fixed: Added fallbacks
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

  // ✅ Fixed: Removed unused variables to fix ESLint warnings
  // const [isResting, setIsResting] = useState(false);
  // const [restTimeLeft, setRestTimeLeft] = useState(0);

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
      { text: "המשך אימון", style: "cancel" },
      {
        text: "סיים",
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>לא נמצא אימון פעיל</Text>
        <Button
          title="חזור לבחירת תוכנית"
          onPress={() => navigation.navigate("SelectPlan")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={workoutColors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{activeWorkout.name}</Text>

        <TouchableOpacity
          onPress={handleFinishWorkout}
          style={styles.headerButton}
        >
          <Ionicons name="checkmark" size={24} color={workoutColors.success} />
        </TouchableOpacity>
      </View>

      {/* סטטיסטיקות */}
      <LiveStats workout={activeWorkout} />

      {/* תרגיל נוכחי */}
      <View style={styles.exerciseContainer}>
        <ActiveExerciseCard exercise={currentExercise} isActive={true} />
      </View>

      {/* ניווט בין תרגילים */}
      <View style={styles.navigationContainer}>
        <Button
          title="תרגיל קודם"
          variant="outline"
          onPress={handlePrevExercise}
          disabled={currentExerciseIndex === 0}
          style={styles.navButton}
        />

        <Text style={styles.exerciseCounter}>
          {currentExerciseIndex + 1} / {activeWorkout.exercises.length}
        </Text>

        <Button
          title="תרגיל הבא"
          onPress={handleNextExercise}
          style={styles.navButton}
        />
      </View>
    </View>
  );
};

// 🎨 סטיילים מעוצבים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: workoutColors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: workoutColors.background,
  },
  errorText: {
    fontSize: 18,
    color: workoutColors.text,
    marginBottom: 20,
    textAlign: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: workoutColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    flex: 1,
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
    marginTop: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: workoutColors.text,
    marginTop: 2,
  },

  // Exercise Card
  exerciseContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
    fontSize: 22,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  setsProgress: {
    backgroundColor: workoutColors.pending,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  setsProgressText: {
    fontSize: 14,
    color: workoutColors.accent,
    fontWeight: "600",
  },

  // Set Card
  setCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
