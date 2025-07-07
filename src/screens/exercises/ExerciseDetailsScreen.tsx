// src/screens/exercises/ExerciseDetailsScreen.tsx - ✅ Fixed TypeScript Errors

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

  // פונקציה לקבלת צבע לפי רמת קושי
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "#4ade80"; // ירוק
      case "intermediate":
        return "#facc15"; // צהוב
      case "advanced":
        return "#f87171"; // אדום
      default:
        return colors.textSecondary;
    }
  };

  // פונקציה לתרגום רמת קושי
  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return "לא צוין";
    }
  };

  // טיפול במצבי טעינה או שגיאה
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>טוען פרטי תרגיל...</Text>
      </View>
    );
  }

  if (isError || !exercise) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>אירעה שגיאה בטעינת התרגיל.</Text>
        <Button
          title="חזור"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>

        {/* קטגוריה (מחליף את muscleGroup) */}
        <Text style={styles.category}>{exercise.category}</Text>

        {/* רמת קושי */}
        {exercise.difficulty && (
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
        )}
      </View>

      {/* תמונת התרגיל */}
      {exercise.imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: exercise.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* תיאור התרגיל */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>תיאור</Text>
        <Text style={styles.description}>
          {exercise.description || "אין תיאור זמין"}
        </Text>
      </View>

      {/* הוראות ביצוע */}
      {exercise.instructions && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>הוראות ביצוע</Text>
          {Array.isArray(exercise.instructions) ? (
            exercise.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instruction}>
                {`${index + 1}. ${instruction}`}
              </Text>
            ))
          ) : (
            <Text style={styles.instruction}>{exercise.instructions}</Text>
          )}
        </View>
      )}

      {/* ✅ תיקון: שימוש ב-targetMuscleGroups במקום targetMuscles */}
      {exercise.targetMuscleGroups &&
        exercise.targetMuscleGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>שרירים מעורבים</Text>
            <View style={styles.musclesContainer}>
              {exercise.targetMuscleGroups.map((muscle, index) => (
                <View key={index} style={styles.muscleTag}>
                  <Text style={styles.muscleText}>{muscle}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

      {/* ציוד נדרש */}
      {exercise.equipment && exercise.equipment.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ציוד נדרש</Text>
          <View style={styles.equipmentContainer}>
            {exercise.equipment.map((item, index) => (
              <View key={index} style={styles.equipmentTag}>
                <Text style={styles.equipmentText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* משך זמן משוער */}
      {exercise.duration && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>משך זמן משוער</Text>
          <Text style={styles.duration}>
            {Math.floor(exercise.duration / 60)} דקות ו-{exercise.duration % 60}{" "}
            שניות
          </Text>
        </View>
      )}

      {/* קלוריות */}
      {exercise.calories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>קלוריות משוערות</Text>
          <Text style={styles.calories}>{exercise.calories} קלוריות</Text>
        </View>
      )}

      {/* כפתור הוספה לאימון */}
      <View style={styles.addToWorkoutContainer}>
        <Button
          title="הוסף לאימון"
          onPress={handleAddToWorkout}
          style={styles.addToWorkoutButton}
        />
      </View>
    </ScrollView>
  );
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
    backgroundColor: colors.background,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
  },

  // Header
  header: {
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "right",
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: colors.primary,
    textAlign: "right",
    marginBottom: 12,
  },
  difficultyBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Image
  imageContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },

  // Content sections
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    textAlign: "right",
  },
  instruction: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: colors.textSecondary,
    textAlign: "right",
  },

  // Muscles
  musclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
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

  // Equipment
  equipmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
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

  // Duration & Calories
  duration: {
    fontSize: 16,
    color: colors.text,
    textAlign: "right",
  },
  calories: {
    fontSize: 16,
    color: colors.text,
    textAlign: "right",
  },

  // Add to workout button
  addToWorkoutContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  addToWorkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
});

export default ExerciseDetailsScreen;
