// src/screens/exercises/ExerciseDetailsScreen.tsx
// מסך המציג פרטים מלאים על תרגיל ספציפי

import React from "react";
import { ScrollView } from "react-native";
import {
  ExerciseHeader,
  ExerciseImage,
  ExerciseDescription,
  ExerciseInstructions,
  ExerciseMuscles,
  ExerciseEquipment,
  ExerciseDurationCalories,
  ExerciseActions,
  LoadingState,
  ErrorState,
} from "./details";
import { useExerciseData } from "./details/hooks";
import { getDifficultyColor, getDifficultyText } from "./details/utils";
import { exerciseStyles } from "./details/styles";
import { ExerciseDetailsScreenProps } from "./details/types";

const ExerciseDetailsScreen: React.FC<ExerciseDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { exerciseId } = route.params;

  const { exercise, isLoading, isError, handleAddToWorkout } = useExerciseData(
    exerciseId,
    () => navigation.goBack()
  );

  // טיפול במצבי טעינה או שגיאה
  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !exercise) {
    return <ErrorState onBackPress={() => navigation.goBack()} />;
  }

  return (
    <ScrollView style={exerciseStyles.container}>
      <ExerciseHeader
        exercise={exercise}
        onDifficultyColorSelect={getDifficultyColor}
        onDifficultyTextSelect={getDifficultyText}
      />

      <ExerciseImage
        imageUrl={exercise.imageUrl}
        exerciseName={exercise.name}
      />

      <ExerciseDescription description={exercise.description} />

      <ExerciseInstructions instructions={exercise.instructions} />

      <ExerciseMuscles targetMuscleGroups={exercise.targetMuscleGroups} />

      <ExerciseEquipment equipment={exercise.equipment} />

      <ExerciseDurationCalories
        duration={exercise.duration}
        calories={exercise.calories}
      />

      <ExerciseActions
        exercise={exercise}
        onAddToWorkout={handleAddToWorkout}
      />
    </ScrollView>
  );
};

export default ExerciseDetailsScreen;
