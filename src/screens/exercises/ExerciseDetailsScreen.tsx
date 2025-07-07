// src/screens/exercises/ExerciseDetailsScreen.tsx - תוקן

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

      {/* שימוש ב-category במקום muscleGroup */}
      <Text style={styles.muscleGroup}>{exercise.category}</Text>

      {exercise.imageUrl && (
        <Image source={{ uri: exercise.imageUrl }} style={styles.image} />
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>תיאור</Text>
        <Text style={styles.description}>
          {exercise.description || "אין תיאור זמין"}
        </Text>
      </View>

      {/* שימוש ב-instructions כ-string או array */}
      {exercise.instructions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הוראות ביצוע</Text>
          {typeof exercise.instructions === "string" ? (
            <Text style={styles.instruction}>{exercise.instructions}</Text>
          ) : Array.isArray(exercise.instructions) ? (
            exercise.instructions.map((inst: string, index: number) => (
              <Text
                key={index}
                style={styles.instruction}
              >{`\u2022 ${inst}`}</Text>
            ))
          ) : (
            <Text style={styles.instruction}>אין הוראות זמינות</Text>
          )}
        </View>
      )}

      {/* מידע נוסף על התרגיל - מסתיר אם לא קיים */}
      {exercise.targetMuscles && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>שרירים מעורבים</Text>
          <View style={styles.musclesContainer}>
            {typeof exercise.targetMuscles === "string" ? (
              <View style={styles.muscleTag}>
                <Text style={styles.muscleText}>{exercise.targetMuscles}</Text>
              </View>
            ) : Array.isArray(exercise.targetMuscles) ? (
              exercise.targetMuscles.map((muscle: string, index: number) => (
                <View key={index} style={styles.muscleTag}>
                  <Text style={styles.muscleText}>{muscle}</Text>
                </View>
              ))
            ) : null}
          </View>
        </View>
      )}

      {exercise.equipment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ציוד נדרש</Text>
          <View style={styles.equipmentContainer}>
            {typeof exercise.equipment === "string" ? (
              <View style={styles.equipmentTag}>
                <Text style={styles.equipmentText}>{exercise.equipment}</Text>
              </View>
            ) : Array.isArray(exercise.equipment) ? (
              exercise.equipment.map((item: string, index: number) => (
                <View key={index} style={styles.equipmentTag}>
                  <Text style={styles.equipmentText}>{item}</Text>
                </View>
              ))
            ) : null}
          </View>
        </View>
      )}

      {exercise.difficulty && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>רמת קושי</Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(exercise.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>
              {getDifficultyText(exercise.difficulty)}
            </Text>
          </View>
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

// פונקציות עזר
const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "beginner":
      return colors.success;
    case "intermediate":
      return colors.warning;
    case "advanced":
      return colors.danger;
    default:
      return colors.textMuted;
  }
};

const getDifficultyText = (difficulty: string): string => {
  switch (difficulty) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "בינוני";
    case "advanced":
      return "מתקדם";
    default:
      return difficulty;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: colors.text,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
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
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    backgroundColor: colors.surface,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
    color: colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "right",
    color: colors.textSecondary,
  },
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: "right",
    color: colors.textSecondary,
    paddingRight: 8,
  },

  // מידע נוסף
  musclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  muscleText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  equipmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  equipmentTag: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  equipmentText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "500",
  },

  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ExerciseDetailsScreen;
