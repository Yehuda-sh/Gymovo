// src/screens/workouts/ActiveWorkoutScreen.tsx

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { demoPlans } from "../../constants/demoPlans";
import { useWorkoutStore } from "../../stores/workoutStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";
import { WorkoutSet } from "../../types/workout";

// רכיב להצגת שורת סט בודד
// שודרג לשימוש במצב מקומי (local state) לשיפור ביצועים
const SetRow = ({
  item,
  exerciseId,
  setIndex,
}: {
  item: WorkoutSet;
  exerciseId: string;
  setIndex: number;
}) => {
  // קבלת פונקציות העדכון מה-store הכללי
  const { updateSet, toggleSetCompleted } = useWorkoutStore();
  const isCompleted = item.status === "completed";

  // ניהול מצב מקומי עבור שדות הקלט. העדכון מהיר כי הוא לא משפיע על כל האפליקציה
  const [localWeight, setLocalWeight] = useState(String(item.weight));
  const [localReps, setLocalReps] = useState(String(item.reps));

  // אפקט לסנכרון המצב המקומי עם ה-store, למקרה שהנתונים משתנים ממקור חיצוני
  useEffect(() => {
    setLocalWeight(String(item.weight));
    setLocalReps(String(item.reps));
  }, [item.weight, item.reps]);

  // הפונקציה מעדכנת את ה-store המרכזי רק כשהמשתמש מסיים לערוך שדה (יוצא מהפוקוס)
  const handleUpdateStoreOnBlur = () => {
    const weightNum = Number(localWeight) || 0;
    const repsNum = Number(localReps) || 0;

    // בודקים אם היה שינוי כדי למנוע קריאות מיותרות ל-store
    if (weightNum !== item.weight || repsNum !== item.reps) {
      updateSet(exerciseId, item.id, { weight: weightNum, reps: repsNum });
    }
  };

  return (
    <View style={[styles.setRow, isCompleted && styles.setRowCompleted]}>
      <Text style={styles.setText}>{setIndex + 1}</Text>

      <View style={styles.inputContainer}>
        <Input
          value={localWeight}
          onChangeText={setLocalWeight}
          onBlur={handleUpdateStoreOnBlur}
          keyboardType="numeric"
          style={styles.input}
          editable={!isCompleted}
          selectTextOnFocus
        />
        <Text style={styles.inputLabel}>קג</Text>
      </View>

      <View style={styles.inputContainer}>
        <Input
          value={localReps}
          onChangeText={setLocalReps}
          onBlur={handleUpdateStoreOnBlur}
          keyboardType="numeric"
          style={styles.input}
          editable={!isCompleted}
          selectTextOnFocus
        />
        <Text style={styles.inputLabel}>חזרות</Text>
      </View>

      <TouchableOpacity
        onPress={() => toggleSetCompleted(exerciseId, item.id)}
        style={styles.checkButton}
      >
        <Ionicons
          name={isCompleted ? "checkmark-circle" : "checkmark-circle-outline"}
          size={32}
          color={isCompleted ? colors.primary : "#cccccc"}
        />
      </TouchableOpacity>
    </View>
  );
};

// רכיב להצגת טיימר המנוחה
const RestTimerBar = () => {
  const { isResting, restTimeLeft } = useWorkoutStore();
  if (!isResting) return null;

  return (
    <View style={styles.restBar}>
      <Ionicons name="timer-outline" size={20} color={colors.primary} />
      <Text style={styles.restText}>{restTimeLeft} שניות מנוחה</Text>
    </View>
  );
};

// רכיב המסך הראשי
const ActiveWorkoutScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    activeWorkout,
    currentExerciseIndex,
    startWorkout,
    finishWorkout,
    goToNextExercise,
    goToPrevExercise,
  } = useWorkoutStore();

  // אפקט שרץ פעם אחת כשהמסך נטען, ומתחיל אימון דמו אם אין אימון פעיל
  useEffect(() => {
    if (!activeWorkout) {
      startWorkout(demoPlans[0], demoPlans[0].days[0].id);
    }
  }, [activeWorkout, startWorkout]);

  // טיפול במצב טעינה או אם אין תרגילים להצגה
  if (!activeWorkout || !activeWorkout.exercises[currentExerciseIndex]) {
    return <ActivityIndicator style={styles.centered} size="large" />;
  }

  const currentExercise = activeWorkout.exercises[currentExerciseIndex];
  const isLastExercise =
    currentExerciseIndex === activeWorkout.exercises.length - 1;

  // פונקציה לסיום ושמירת האימון
  const handleFinish = () => {
    if (activeWorkout) {
      navigation.navigate("WorkoutSummary", { workout: activeWorkout });
      finishWorkout();
    }
  };

  return (
    <View style={styles.container}>
      {/* כותרת עליונה עם ניווט בין תרגילים */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={goToPrevExercise}
          disabled={currentExerciseIndex === 0}
        >
          <Ionicons
            name="chevron-back-circle-outline"
            size={36}
            color={currentExerciseIndex === 0 ? "#ccc" : colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.header}>{currentExercise.exercise.name}</Text>
        <TouchableOpacity onPress={goToNextExercise} disabled={isLastExercise}>
          <Ionicons
            name="chevron-forward-circle-outline"
            size={36}
            color={isLastExercise ? "#ccc" : colors.primary}
          />
        </TouchableOpacity>
      </View>

      <RestTimerBar />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* כותרות לעמודות של טבלת הסטים */}
        <View style={styles.setsHeader}>
          <Text style={styles.setsHeaderText}>סט</Text>
          <Text style={styles.setsHeaderText}>משקל (קג)</Text>
          <Text style={styles.setsHeaderText}>חזרות</Text>
          <Text style={styles.setsHeaderText}>בוצע</Text>
        </View>
        {/* // TODO: רעיון לעתיד - לאפשר הוספה/מחיקה של סטים ישירות מכאן */}
        {currentExercise.sets.map((set, index) => (
          <SetRow
            key={set.id}
            item={set}
            exerciseId={currentExercise.id}
            setIndex={index}
          />
        ))}
      </ScrollView>

      {/* כפתור תחתון קבוע למעבר תרגיל או לסיום האימון */}
      <View style={styles.finishButtonContainer}>
        <Button
          title={isLastExercise ? "סיים וצפה בסיכום" : "התרגיל הבא"}
          onPress={() => (isLastExercise ? handleFinish() : goToNextExercise())}
          variant="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 8,
  },
  restBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#e0f7fa",
    padding: 12,
    borderRadius: 30,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  restText: { fontSize: 16, fontWeight: "bold", color: colors.primary },
  setsHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  setsHeaderText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    marginHorizontal: 16,
  },
  setRowCompleted: { backgroundColor: "#e8f5e9", opacity: 0.7 },
  setText: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "500" },
  inputContainer: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  inputLabel: { fontSize: 12, color: "#888", marginBottom: 2 },
  input: {
    width: "100%",
    textAlign: "center",
    marginVertical: 0,
    paddingVertical: 8,
    fontSize: 18,
  },
  checkButton: { flex: 1, alignItems: "center", justifyContent: "center" },
  finishButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f5f5f5",
  },
});

export default ActiveWorkoutScreen;
