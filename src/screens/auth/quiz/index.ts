// src/screens/auth/quiz/index.ts
// ייצוא כל קומפוננטות השאלון - מתוקן

// Components
export { default as LoadingScreen } from "./components/LoadingScreen";
export { default as QuizHeader } from "./components/QuizHeader";
export { default as QuizQuestion } from "./components/QuizQuestion";
export { default as QuizOptions } from "./components/QuizOptions";
export { default as QuizOptionCard } from "./components/QuizOptionCard";
export { default as QuizNavigation } from "./components/QuizNavigation";

// Hooks
export { default as useQuizAnimations } from "./components/useQuizAnimations";
export { default as useQuizLogic } from "./components/useQuizLogic";

// Types - ייבוא עם alias כדי למנוע התנגשות עם הקומפוננטה
export type {
  QuizQuestion as QuizQuestionType,
  QuizOption,
  QuizScreenProps,
  QuizHeaderProps,
  QuizQuestionProps,
  QuizOptionsProps,
  QuizOptionCardProps,
  QuizNavigationProps,
  LoadingScreenProps,
  QuizState,
  QuizAnimations,
} from "./types";

// Colors
export { quizColors } from "./types";

// Data
export * from "./data";

// Styles (אם יש)
// export * from "./styles";
