// src/screens/workouts/ActiveWorkoutScreen.tsx - ✅ Enhanced Version with RTL Support

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  I18nManager,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
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

// הפעלת RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

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

  // טיימר לאימון
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (seconds: number) => {
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

  const handleSetComplete = () => {
    setShowRestTimer(true);
  };

  const handleRestComplete = () => {
    setShowRestTimer(false);
    // אפשר להוסיף לוגיקה למעבר אוטומטי לתרגיל הבא
  };

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
                duration: elapsedTime,
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
              duration: elapsedTime,
            },
          });
        },
      },
    ]);
  };

  if (!activeWorkout || !currentExercise) {
    return (
      <View style={activeWorkoutStyles.emptyContainer}>
        <Ionicons
          name="barbell-outline"
          size={64}
          color={workoutColors.subtext}
        />
        <Text style={activeWorkoutStyles.emptyText}>אין אימון פעיל</Text>
        <Button
          title="התחל אימון חדש"
          onPress={() => navigation.navigate("StartWorkout")}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <View style={activeWorkoutStyles.container}>
      {/* Header */}
      <View style={activeWorkoutStyles.header}>
        <TouchableOpacity onPress={handleFinishWorkout}>
          <Ionicons name="close" size={28} color={workoutColors.text} />
        </TouchableOpacity>

        <View style={activeWorkoutStyles.headerCenter}>
          <Text style={activeWorkoutStyles.workoutTitle}>
            {activeWorkout.name}
          </Text>
          <View style={activeWorkoutStyles.timerContainer}>
            <Ionicons
              name="timer-outline"
              size={16}
              color={workoutColors.subtext}
            />
            <Text style={activeWorkoutStyles.timerText}>
              {formatElapsedTime(elapsedTime)}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowRestTimer(true)}>
          <Ionicons name="timer-outline" size={28} color={workoutColors.text} />
        </TouchableOpacity>
      </View>

      {/* Live Stats */}
      <LiveStats workout={activeWorkout} />

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
          title="תרגיל קודם"
          onPress={handlePrevExercise}
          variant="outline"
          disabled={currentExerciseIndex === 0}
          style={activeWorkoutStyles.navButton}
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
              ? "סיים אימון"
              : "תרגיל הבא"
          }
          onPress={handleNextExercise}
          variant="primary"
          style={activeWorkoutStyles.navButton}
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

export default ActiveWorkoutScreen;
