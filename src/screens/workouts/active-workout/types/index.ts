// src/screens/workouts/active-workout/types/index.ts

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../../../../theme/colors";
import { RootStackParamList } from "../../../../types/navigation";
import { WorkoutExercise, WorkoutSet } from "../../../../types/workout";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// צבעים ספציפיים לאימון פעיל
export const workoutColors = {
  primary: colors.primary,
  background: colors.background,
  surface: colors.surface,
  text: colors.text,
  subtext: colors.textSecondary,
  accent: colors.accent,
  border: colors.border,
  success: colors.success,

  // צבעים לסטטוסי סטים
  pending: colors.warning,
  completed: colors.success,
  active: colors.primary,

  // צבעים לכרטיסים
  cardBg: colors.cardBackground,
  inputBg: colors.inputBackground,

  // צבעים נוספים
  danger: colors.danger,
  info: colors.info,
};

// Props לרכיבים שונים
export interface ProgressRingProps {
  progress: number;
}

export interface RestTimerProps {
  isVisible: boolean;
  onComplete: () => void;
  onClose: () => void;
  defaultSeconds?: number;
}

export interface PreviousPerformanceProps {
  exerciseId: string;
  setIndex: number;
}

export interface SetNotesProps {
  setId: string;
  initialNote?: string;
}

export interface ActiveExerciseCardProps {
  exercise: WorkoutExercise;
  isActive: boolean;
  onSetComplete: () => void;
}

export interface SetRowProps {
  set: WorkoutSet;
  setIndex: number;
  exerciseId: string;
  onWeightChange: (weight: number) => void;
  onRepsChange: (reps: number) => void;
  onComplete: () => void;
  isActive: boolean;
}

export interface LiveStatsProps {
  workout: any; // TODO: יש לעדכן לטיפוס מדויק
}

// טיפוס לסטטיסטיקות
export interface WorkoutStats {
  totalVolume: number;
  completedSets: number;
  totalSets: number;
  completedExercises: number;
  totalExercises: number;
  progress: number;
}
