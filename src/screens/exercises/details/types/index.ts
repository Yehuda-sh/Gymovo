// src/screens/exercises/details/types/index.ts
// טיפוסים עבור רכיבי מסך פרטי תרגיל

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";
import { Exercise } from "../../../../types/exercise";

export type ExerciseDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ExerciseDetails"
>;

export interface ExerciseHeaderProps {
  exercise: Exercise;
  onDifficultyColorSelect: (difficulty?: string) => string;
  onDifficultyTextSelect: (difficulty?: string) => string;
}

export interface ExerciseImageProps {
  imageUrl?: string;
  exerciseName: string;
}

export interface ExerciseDescriptionProps {
  description?: string;
}

export interface ExerciseInstructionsProps {
  instructions?: string | string[];
}

export interface ExerciseMusclesProps {
  targetMuscleGroups?: string[];
}

export interface ExerciseEquipmentProps {
  equipment?: string[];
}

export interface ExerciseDurationCaloriesProps {
  duration?: number;
  calories?: number;
}

export interface ExerciseActionsProps {
  exercise: Exercise;
  onAddToWorkout: () => void;
}

export interface LoadingStateProps {
  loadingText?: string;
}

export interface ErrorStateProps {
  errorText?: string;
  onBackPress: () => void;
}

export interface ExerciseDataHook {
  exercise: Exercise | null;
  isLoading: boolean;
  isError: boolean;
  handleAddToWorkout: () => void;
}

export interface DifficultyUtils {
  getDifficultyColor: (difficulty?: string) => string;
  getDifficultyText: (difficulty?: string) => string;
}
