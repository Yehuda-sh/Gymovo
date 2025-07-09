// src/screens/auth/quiz/components/useQuizLogic.ts - hook לניהול לוגיקת Quiz

import { useState, useCallback } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { QuizOption, QuizQuestion, QuizState } from "../types";
import { generatePlan } from "../../../../services/planGenerator";
import { savePlan } from "../../../../data/storage";
import { UserState, useUserStore } from "../../../../stores/userStore";

// Interface לנתוני השאלון
interface QuizLogicProps {
  questions: QuizQuestion[];
  onComplete: () => void;
  userId?: string;
  signupData?: any;
}

// Custom hook לניהול לוגיקת השאלון
export const useQuizLogic = ({
  questions,
  onComplete,
  userId,
  signupData,
}: QuizLogicProps) => {
  const user = useUserStore((state: UserState) => state.user);

  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    selectedOptions: [],
    isLoading: false,
  });

  const currentQuestion = questions[state.currentQuestionIndex];
  const isLastQuestion = state.currentQuestionIndex === questions.length - 1;
  const progress = (state.currentQuestionIndex + 1) / questions.length;

  // טיפול בבחירת אפשרות
  const handleOptionSelect = useCallback(
    (option: QuizOption) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setState((prev) => {
        if (currentQuestion.multiSelect) {
          const isSelected = prev.selectedOptions.some(
            (o) => o.value === option.value
          );
          const newSelectedOptions = isSelected
            ? prev.selectedOptions.filter((o) => o.value !== option.value)
            : [...prev.selectedOptions, option];

          return {
            ...prev,
            selectedOptions: newSelectedOptions,
          };
        } else {
          return {
            ...prev,
            selectedOptions: [option],
          };
        }
      });
    },
    [currentQuestion.multiSelect]
  );

  // טיפול במעבר לשאלה הבאה
  const handleNext = useCallback(async () => {
    if (state.selectedOptions.length === 0) {
      Alert.alert("בחר תשובה", "אנא בחר לפחות תשובה אחת כדי להמשיך");
      return;
    }

    // שמירת התשובה הנוכחית
    const answerValue = currentQuestion.multiSelect
      ? state.selectedOptions.map((o) => o.value)
      : state.selectedOptions[0].value;

    const newAnswers = { ...state.answers, [currentQuestion.id]: answerValue };

    setState((prev) => ({
      ...prev,
      answers: newAnswers,
    }));

    if (isLastQuestion) {
      // יצירת תוכנית
      await handleGeneratePlan(newAnswers);
    } else {
      // מעבר לשאלה הבאה
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        selectedOptions: [],
      }));
    }
  }, [state.selectedOptions, state.answers, currentQuestion, isLastQuestion]);

  // יצירת תוכנית מותאמת אישית
  const handleGeneratePlan = async (finalAnswers: Record<string, any>) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const actualUserId =
        userId ||
        user?.id ||
        signupData?.email?.replace("@", "_").replace(".", "_");

      // המרת התשובות לפורמט הנדרש
      const quizAnswers = {
        goal: finalAnswers.goal || "hypertrophy",
        experience: finalAnswers.experience || "beginner",
        equipment: Array.isArray(finalAnswers.equipment)
          ? finalAnswers.equipment
          : finalAnswers.whereToTrain?.includes("gym")
          ? ["gym"]
          : ["home"],
        injuries: finalAnswers.injuries || [],
        workoutDays: finalAnswers.days || 3,
        timePerSession: 60,
      };

      const plan = await generatePlan(quizAnswers, actualUserId);

      // שמירת תוכנית
      if (actualUserId && plan) {
        await savePlan(actualUserId, plan);
        console.log("✅ Plan saved successfully");
      }

      onComplete();
    } catch (error) {
      console.error("❌ Plan generation failed:", error);
      Alert.alert(
        "שגיאה",
        "לא ניתן ליצור תוכנית אישית כרגע. נסה שוב מאוחר יותר.",
        [
          { text: "נסה שוב", onPress: () => handleGeneratePlan(finalAnswers) },
          { text: "דלג", onPress: onComplete },
        ]
      );
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // טיפול בחזרה
  const handleBack = useCallback(() => {
    if (state.currentQuestionIndex > 0) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        selectedOptions: [],
      }));
    }
  }, [state.currentQuestionIndex]);

  return {
    state,
    currentQuestion,
    isLastQuestion,
    progress,
    handleOptionSelect,
    handleNext,
    handleBack,
  };
};

export default useQuizLogic;
