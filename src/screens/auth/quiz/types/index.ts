// src/screens/auth/quiz/types/index.ts

import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../types/navigation";

export type QuizScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Quiz"
>;

// Quiz Questions Interface
export interface QuizQuestion {
  id: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  multiSelect: boolean;
  options: QuizOption[];
  next: string | null;
}

export interface QuizOption {
  text: string;
  value: any;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  description?: string;
}

// Props לרכיבים שונים
export interface QuizHeaderProps {
  progress: number;
  currentIndex: number;
  totalQuestions: number;
  onBack: () => void;
}

export interface QuizQuestionProps {
  question: QuizQuestion;
  fadeAnim: any;
  slideAnim: any;
}

export interface QuizOptionsProps {
  options: QuizOption[];
  selectedOptions: any[];
  multiSelect: boolean;
  onSelect: (option: QuizOption) => void;
}

export interface QuizOptionCardProps {
  option: QuizOption;
  isSelected: boolean;
  onPress: () => void;
}

export interface QuizNavigationProps {
  isLastQuestion: boolean;
  hasSelectedOptions: boolean;
  onNext: () => void;
}

export interface LoadingScreenProps {
  text?: string;
}

// State types
export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, any>;
  selectedOptions: any[];
  isLoading: boolean;
}

// Animation types
export interface QuizAnimations {
  slideAnim: any;
  fadeAnim: any;
  animateToNextQuestion: () => void;
}

// אובייקט הצבעים של Quiz
export const quizColors = {
  // צבעים עיקריים
  primary: "#3B82F6",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#1F2937",
  textLight: "#64748B",
  border: "#E2E8F0",

  // צבעים ספציפיים לQuiz
  headerBg: "#3B82F6",
  progressBg: "rgba(255,255,255,0.3)",
  progressBar: "white",
  selectedOption: "#3B82F6",
  selectedText: "white",

  // צבעים לסטטוס
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",

  // צבעים לאפשרויות
  goalHypertrophy: "#E74C3C",
  goalWeightLoss: "#3498DB",
  goalStrength: "#9B59B6",
  goalEndurance: "#E67E22",

  experienceBeginner: "#27AE60",
  experienceIntermediate: "#F39C12",
  experienceAdvanced: "#8E44AD",

  equipmentGym: "#2C3E50",
  equipmentDumbbells: "#34495E",
  equipmentBodyweight: "#16A085",
  equipmentMinimal: "#7F8C8D",

  daysLow: "#3498DB",
  daysMedium: "#E67E22",
  daysHigh: "#E74C3C",
};
