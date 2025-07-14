// src/screens/workouts/ActiveWorkoutScreen.tsx
// מסך אימון פעיל - גרסה מתוקנת ומשופרת עם אנימציות וחוויית משתמש מתקדמת

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  I18nManager,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import Button from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { useWorkoutStore } from "../../stores/workoutStore";
import {
  ActiveExerciseCard,
  LiveStats,
  NavigationProp,
  ProgressRing,
  RestTimer,
  workoutColors,
} from "./active-workout";
import { activeWorkoutStyles } from "./active-workout/styles";
import { Workout, WorkoutExercise } from "../../types/workout";

// הפעלת RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// אנימציה לפעימת הטיימר
const PulsingView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      {children}
    </Animated.View>
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
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // אנימציית כניסה
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // טיימר לאימון
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // פורמט זמן מתקדם
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const currentExercise = activeWorkout?.exercises[currentExerciseIndex];

  // טיפול בהשלמת סט
  const handleSetComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowRestTimer(true);

    // בדיקה אם זה הסט האחרון בתרגיל
    if (currentExercise) {
      const completedSets = currentExercise.sets.filter(
        (s) => s.status === "completed"
      ).length;
      if (completedSets === currentExercise.sets.length - 1) {
        Toast.success("עוד סט אחד ומסיימים את התרגיל! 💪");
      }
    }
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // מעבר לתרגיל הבא
  const handleNextExercise = () => {
    const hasNext = goToNextExercise();

    if (!hasNext && activeWorkout) {
      // האימון הסתיים
      const completedWorkout = createCompletedWorkout();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Alert.alert("כל הכבוד! 🎉", "סיימת את האימון בהצלחה!", [
        {
          text: "סיים אימון",
          style: "default",
          onPress: () => {
            finishWorkout();
            navigation.navigate("WorkoutSummary", {
              workout: completedWorkout,
            });
          },
        },
      ]);
    } else {
      // אנימציית מעבר
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePrevExercise = () => {
    goToPrevExercise();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // סיום אימון מוקדם
  const handleFinishWorkout = () => {
    if (!activeWorkout) return;

    Alert.alert("סיום אימון", "האם אתה בטוח שברצונך לסיים את האימון?", [
      {
        text: "ביטול",
        style: "cancel",
      },
      {
        text: "סיים אימון",
        style: "destructive",
        onPress: () => {
          const completedWorkout = createCompletedWorkout();
          finishWorkout();
          navigation.navigate("WorkoutSummary", {
            workout: completedWorkout,
          });
        },
      },
    ]);
  };

  // יצירת אובייקט אימון מושלם
  const createCompletedWorkout = (): Workout => {
    if (!activeWorkout) {
      throw new Error("No active workout");
    }

    return {
      id: `workout_${Date.now()}`,
      planId: activeWorkout.planId || "quick",
      planName: activeWorkout.planName || "אימון מותאם אישית",
      dayId: activeWorkout.dayId || "quick",
      dayName: activeWorkout.dayName || "אימון חופשי",
      exercises: activeWorkout.exercises,
      date: new Date().toISOString(),
      startTime: workoutStartTime,
      endTime: new Date().toISOString(),
      duration: Math.floor(elapsedTime / 60),
      status: "completed",
      totalVolume: calculateTotalVolume(activeWorkout.exercises),
      totalSets: calculateTotalSets(activeWorkout.exercises),
      totalReps: calculateTotalReps(activeWorkout.exercises),
      isQuickWorkout: activeWorkout.isQuickWorkout,
    };
  };

  // פונקציות חישוב סטטיסטיקות
  const calculateTotalVolume = (exercises: WorkoutExercise[]): number => {
    return exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exTotal, set) => {
          if (set.status === "completed") {
            return exTotal + (set.weight || 0) * (set.reps || 0);
          }
          return exTotal;
        }, 0)
      );
    }, 0);
  };

  const calculateTotalSets = (exercises: WorkoutExercise[]): number => {
    return exercises.reduce((total, exercise) => {
      return (
        total + exercise.sets.filter((set) => set.status === "completed").length
      );
    }, 0);
  };

  const calculateTotalReps = (exercises: WorkoutExercise[]): number => {
    return exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exTotal, set) => {
          if (set.status === "completed") {
            return exTotal + (set.reps || 0);
          }
          return exTotal;
        }, 0)
      );
    }, 0);
  };

  // מצב ריק - אין אימון פעיל
  if (!activeWorkout || !currentExercise) {
    return (
      <View style={activeWorkoutStyles.emptyContainer}>
        <LinearGradient
          colors={["#1a1a1a", "#2d2d2d"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Ionicons
          name="barbell-outline"
          size={80}
          color={workoutColors.subtext}
        />
        <Text style={activeWorkoutStyles.emptyText}>אין אימון פעיל</Text>
        <Text style={activeWorkoutStyles.emptySubtext}>
          התחל אימון חדש כדי להתחיל להתאמן
        </Text>
        <Button
          title="התחל אימון חדש"
          onPress={() => navigation.navigate("StartWorkout", {})}
          variant="primary"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={activeWorkoutStyles.container}>
      {/* רקע גרדיאנט */}
      <LinearGradient
        colors={["#1a1a1a", "#0d0d0d"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <Animated.View
        style={[
          activeWorkoutStyles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleFinishWorkout}
          style={activeWorkoutStyles.headerButton}
        >
          <Ionicons name="close" size={28} color={workoutColors.text} />
        </TouchableOpacity>

        <View style={activeWorkoutStyles.headerCenter}>
          <Text style={activeWorkoutStyles.workoutTitle}>
            {activeWorkout.planName}
          </Text>
          <View style={activeWorkoutStyles.timerContainer}>
            <PulsingView>
              <Ionicons
                name="timer-outline"
                size={16}
                color={workoutColors.accent}
              />
            </PulsingView>
            <Text style={activeWorkoutStyles.timerText}>
              {formatElapsedTime(elapsedTime)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowRestTimer(true)}
          style={activeWorkoutStyles.headerButton}
        >
          <Ionicons name="timer-outline" size={28} color={workoutColors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Live Stats */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <LiveStats workout={activeWorkout} />
      </Animated.View>

      {/* Exercise Content */}
      <ScrollView
        style={activeWorkoutStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={activeWorkoutStyles.scrollContent}
      >
        {activeWorkout.exercises.map((exercise, index) => (
          <ActiveExerciseCard
            key={exercise.id}
            exercise={exercise}
            isActive={index === currentExerciseIndex}
            onSetComplete={handleSetComplete}
          />
        ))}
      </ScrollView>

      {/* Navigation */}
      <View style={activeWorkoutStyles.navigationContainer}>
        <Button
          title="קודם"
          onPress={handlePrevExercise}
          variant="outline"
          disabled={currentExerciseIndex === 0}
          style={[
            activeWorkoutStyles.navButton,
            { opacity: currentExerciseIndex === 0 ? 0.5 : 1 },
          ]}
        />

        <View style={activeWorkoutStyles.exerciseCounterContainer}>
          <Text style={activeWorkoutStyles.exerciseCounter}>
            {currentExerciseIndex + 1} / {activeWorkout.exercises.length}
          </Text>
          <ProgressRing
            progress={
              ((currentExerciseIndex + 1) / activeWorkout.exercises.length) *
              100
            }
          />
        </View>

        <Button
          title={
            currentExerciseIndex === activeWorkout.exercises.length - 1
              ? "סיום"
              : "הבא"
          }
          onPress={handleNextExercise}
          variant="primary"
          style={activeWorkoutStyles.navButton}
          icon={
            <Ionicons
              name={
                currentExerciseIndex === activeWorkout.exercises.length - 1
                  ? "checkmark-circle"
                  : "arrow-forward"
              }
              size={20}
              color="#fff"
            />
          }
        />
      </View>

      {/* Rest Timer Modal */}
      <RestTimer
        isVisible={showRestTimer}
        onComplete={handleRestComplete}
        onClose={() => setShowRestTimer(false)}
        defaultSeconds={90}
      />
    </View>
  );
};

// StyleSheet import נחוץ
import { StyleSheet } from "react-native";

export default ActiveWorkoutScreen;
