// src/screens/exercises/ExerciseDetailsScreen.tsx

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/common/Button";
import { Toast } from "../../components/common/Toast";
import { useExerciseDetails } from "../../hooks/useExerciseDetails";
import { useWorkoutStore } from "../../stores/workoutStore";
import { colors } from "../../theme/colors";
import { RootStackParamList } from "../../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "ExerciseDetails">;

// מסך המציג פרטים מלאים על תרגיל ספציפי
const ExerciseDetailsScreen = ({ route, navigation }: Props) => {
  const { exerciseId } = route.params;

  // שימוש ב-Hook לשליפת פרטי התרגיל (מהמטמון או מהרשת)
  const { data: exercise, isLoading, isError } = useExerciseDetails(exerciseId);
  const addExerciseToWorkout = useWorkoutStore((state) => state.addExercise);

  // פונקציה להוספת התרגיל לאימון הפעיל הנוכחי
  const handleAddToWorkout = () => {
    if (exercise) {
      addExerciseToWorkout(exercise);
      Toast.show(`${exercise.name} נוסף לאימון!`);
      navigation.goBack();
    }
  };

  // טיפול במצבי טעינה או שגיאה
  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }
  if (isError || !exercise) {
    return <Text style={styles.centered}>אירעה שגיאה בטעינת התרגיל.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{exercise.name}</Text>
      <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>

      <Image source={{ uri: exercise.imageUrl }} style={styles.image} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>תיאור</Text>
        <Text style={styles.description}>{exercise.description}</Text>
      </View>

      {exercise.instructions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הוראות ביצוע</Text>
          {exercise.instructions.map((inst, index) => (
            <Text
              key={index}
              style={styles.instruction}
            >{`\u2022 ${inst}`}</Text>
          ))}
        </View>
      )}

      {/* TODO: בעתיד, להוסיף כאן גרף התקדמות אישי של המשתמש בתרגיל זה */}
      <Button
        title="הוסף לאימון הנוכחי"
        onPress={handleAddToWorkout}
        style={{ margin: 16 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  muscleGroup: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  image: { width: "100%", height: 250, resizeMode: "cover" },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right",
  }, // RTL Support
  description: { fontSize: 16, lineHeight: 24, textAlign: "right" }, // RTL Support
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
    textAlign: "right",
  }, // RTL Support
});

export default ExerciseDetailsScreen;
