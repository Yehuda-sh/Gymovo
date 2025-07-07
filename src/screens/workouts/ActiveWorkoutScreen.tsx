// 🔥 מסך אימון פעיל מתקדם עם עיצוב ספורטיבי כהה ואנימציות - גרסה מתוקנת
import { Ionicons } from "@expo/vector-icons";
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
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/common/Button";
import { WorkoutState, useWorkoutStore } from "../../stores/workoutStore";
import { WorkoutExercise, WorkoutSet } from "../../types/workout";

const { width } = Dimensions.get("window");

// 🎨 ערכת צבעים ספורטיבית כהה
const workoutColors = {
  background: "#0a0a0a", // שחור עמוק
  cardBg: "#1a1a1a", // אפור כהה לכרטיסים
  accent: "#00ff88", // ירוק זוהר
  pending: "#333333", // סט שלא בוצע
  completed: "#00ff88", // סט הושלם - ירוק
  text: "#ffffff",
  subtext: "#cccccc",
  border: "#333333",
  danger: "#ff4444",
  success: "#00ff88",
};

// 🎯 רכיב Header מתקדם
const WorkoutHeader = ({
  workoutName,
  currentExercise,
  totalExercises,
  elapsedTime,
}: {
  workoutName: string;
  currentExercise: number;
  totalExercises: number;
  elapsedTime: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]); // תיקון: הוספת dependencies

  const formatTime = useCallback((seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.workoutTitle} numberOfLines={1}>
          {workoutName}
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentExercise}/{totalExercises} תרגילים
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${(currentExercise / totalExercises) * 100}%` },
                ]}
              />
            </View>
          </View>
          <View style={styles.timerContainer}>
            <Ionicons
              name="time-outline"
              size={16}
              color={workoutColors.accent}
            />
            <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

// ⏱️ רכיב טיימר מנוחה מתקדם
const RestTimer = ({
  isVisible,
  duration,
  onComplete,
  onSkip,
}: {
  isVisible: boolean;
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(duration);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, duration, scaleAnim]); // תיקון: הוספת dependencies

  useEffect(() => {
    if (!isVisible || timeLeft <= 0) {
      if (timeLeft <= 0) {
        // רטט בסיום + התראה
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
      }
      return;
    }

    // עדכון אנימציה
    Animated.timing(progressAnim, {
      toValue: timeLeft / duration,
      duration: 1000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isVisible, duration, onComplete, progressAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[styles.restTimerOverlay, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.restTimerCard}>
        <Text style={styles.restTitle}>מנוחה</Text>

        {/* מעגל התקדמות */}
        <View style={styles.circularTimer}>
          <Animated.View
            style={[
              styles.circularProgress,
              {
                transform: [
                  {
                    rotate: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["360deg", "0deg"],
                    }),
                  },
                ],
              },
            ]}
          />
          <Text style={styles.circularTimerText}>{timeLeft}</Text>
        </View>

        <View style={styles.restTimerButtons}>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>דלג</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addTimeButton}
            onPress={() => setTimeLeft((prev) => prev + 30)}
          >
            <Text style={styles.addTimeButtonText}>+30ש</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// 💪 רכיב כרטיס תרגיל אינטראקטיבי
const ExerciseCard = ({
  exercise,
  isActive,
  exerciseIndex,
}: {
  exercise: WorkoutExercise;
  isActive: boolean;
  exerciseIndex: number;
}) => {
  const { updateSet, toggleSetCompleted } = useWorkoutStore();
  const slideAnim = useRef(new Animated.Value(width)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, slideAnim, scaleAnim]);

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
        <Text style={styles.exerciseName}>{exercise.exercise.name}</Text>
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
            key={set.id}
            set={set}
            setIndex={setIndex}
            onWeightChange={(weight) =>
              updateSet(exercise.id, set.id, { weight })
            }
            onRepsChange={(reps) => updateSet(exercise.id, set.id, { reps })}
            onComplete={() => handleSetComplete(set.id)}
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
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [set.status, glowAnim]);

  return (
    <Animated.View
      style={[
        styles.setCard,
        {
          borderColor: getSetColor(),
          shadowColor: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [workoutColors.border, getSetColor()],
          }),
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
          }),
        },
      ]}
    >
      <View style={styles.setHeader}>
        <Text style={[styles.setNumber, { color: getSetColor() }]}>
          סט {setIndex + 1}
        </Text>
        {set.status === "completed" && (
          <Ionicons
            name="checkmark-circle"
            size={24}
            color={workoutColors.completed}
          />
        )}
      </View>

      <View style={styles.setInputs}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>משקל (קג)</Text>
          <TextInput
            style={[styles.setInput, { borderColor: getSetColor() }]}
            value={set.weight.toString()}
            onChangeText={(text) => onWeightChange(Number(text) || 0)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
          />
        </View>

        <Text style={styles.inputSeparator}>×</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>חזרות</Text>
          <TextInput
            style={[styles.setInput, { borderColor: getSetColor() }]}
            value={set.reps.toString()}
            onChangeText={(text) => onRepsChange(Number(text) || 0)}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={workoutColors.subtext}
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
        (sum: number, set: WorkoutSet) => sum + set.weight * set.reps,
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
        <Ionicons
          name="barbell-outline"
          size={20}
          color={workoutColors.accent}
        />
        <Text style={styles.statLabel}>נפח</Text>
        <Text style={styles.statValue}>{stats.totalVolume}kg</Text>
      </View>

      <View style={styles.statItem}>
        <Ionicons
          name="checkmark-circle-outline"
          size={20}
          color={workoutColors.accent}
        />
        <Text style={styles.statLabel}>סטים</Text>
        <Text style={styles.statValue}>
          {stats.completedSets}/{stats.totalSets}
        </Text>
      </View>

      <View style={styles.statItem}>
        <Ionicons
          name="trophy-outline"
          size={20}
          color={workoutColors.accent}
        />
        <Text style={styles.statLabel}>התקדמות</Text>
        <Text style={styles.statValue}>{Math.round(stats.progress)}%</Text>
      </View>
    </View>
  );
};

// 🏋️‍♂️ המסך הראשי
const ActiveWorkoutScreen = () => {
  const {
    activeWorkout,
    currentExerciseIndex,
    isResting,
    restTimeLeft,
    finishWorkout,
    goToNextExercise, // תיקון: שימוש בפונקציה הקיימת
  } = useWorkoutStore((state: WorkoutState) => state);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRestingLocal, setIsRestingLocal] = useState(false);
  const [restTimeLeftLocal, setRestTimeLeftLocal] = useState(90);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // טיימר זמן אימון
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // אנימציית כניסה
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleNextExercise = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const canProceed = goToNextExercise();

    if (canProceed) {
      // התחל מנוחה
      setIsRestingLocal(true);
      setRestTimeLeftLocal(90);
    }
  }, [goToNextExercise]);

  const handleFinishWorkout = useCallback(() => {
    Alert.alert("סיום אימון", "האם אתה בטוח שברצונך לסיים את האימון?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "סיים",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          finishWorkout();
        },
      },
    ]);
  }, [finishWorkout]);

  const handleRestComplete = useCallback(() => {
    setIsRestingLocal(false);
    setRestTimeLeftLocal(0);
  }, []);

  const handleSkipRest = useCallback(() => {
    setIsRestingLocal(false);
    setRestTimeLeftLocal(0);
  }, []);

  if (!activeWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.noWorkoutText}>אין אימון פעיל</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExercise = activeWorkout.exercises[currentExerciseIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <WorkoutHeader
          workoutName={activeWorkout.name}
          currentExercise={currentExerciseIndex + 1}
          totalExercises={activeWorkout.exercises.length}
          elapsedTime={elapsedTime}
        />

        {/* סטטיסטיקות בזמן אמת */}
        <LiveStats workout={activeWorkout} />

        {/* התרגיל הנוכחי */}
        <View style={styles.exerciseContainer}>
          <ExerciseCard
            exercise={currentExercise}
            isActive={true}
            exerciseIndex={currentExerciseIndex}
          />
        </View>

        {/* כפתורי פעולה */}
        <View style={styles.actionButtons}>
          <Button
            title="תרגיל הבא"
            onPress={handleNextExercise}
            style={styles.nextButton}
            disabled={
              currentExerciseIndex >= activeWorkout.exercises.length - 1
            }
          />

          <Button
            title="סיים אימון"
            onPress={handleFinishWorkout}
            variant="outline"
            style={styles.finishButton}
          />
        </View>

        {/* טיימר מנוחה */}
        <RestTimer
          isVisible={isRestingLocal}
          duration={restTimeLeftLocal}
          onComplete={handleRestComplete}
          onSkip={handleSkipRest}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

// 🎨 סטיילים
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: workoutColors.background,
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noWorkoutText: {
    fontSize: 18,
    color: workoutColors.text,
    textAlign: "center",
  },

  // Header
  header: {
    backgroundColor: workoutColors.cardBg,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  headerContent: {
    alignItems: "center",
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  headerStats: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressContainer: {
    flex: 1,
    marginRight: 20,
  },
  progressText: {
    fontSize: 14,
    color: workoutColors.subtext,
    textAlign: "right",
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: workoutColors.pending,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: workoutColors.accent,
    borderRadius: 2,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "600",
    color: workoutColors.accent,
  },

  // Live Stats
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: workoutColors.cardBg,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
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
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // Rest Timer
  restTimerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  restTimerCard: {
    backgroundColor: workoutColors.cardBg,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: workoutColors.accent,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: workoutColors.text,
    marginBottom: 24,
  },
  circularTimer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: workoutColors.pending,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  circularProgress: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: workoutColors.accent,
    borderRadius: 60,
  },
  circularTimerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: workoutColors.text,
    zIndex: 1,
  },
  restTimerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  skipButton: {
    backgroundColor: workoutColors.danger,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  addTimeButton: {
    backgroundColor: workoutColors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addTimeButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  nextButton: {
    flex: 1,
    backgroundColor: workoutColors.accent,
  },
  finishButton: {
    flex: 1,
    borderColor: workoutColors.danger,
  },
});

export default ActiveWorkoutScreen;
