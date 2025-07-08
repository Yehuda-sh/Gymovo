// src/services/quizProgressService.ts - ✅ שירות ניהול התקדמות שאלון

import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuizAnswers } from "./planGenerator";

// 📊 מבנה נתוני התקדמות השאלון
export interface QuizProgress {
  isCompleted: boolean;
  currentQuestionId?: string;
  answers: Partial<QuizAnswers>;
  completedAt?: string;
  lastUpdated: string;
  questionIndex?: number;
}

// 🔑 מפתחות אחסון
const QUIZ_STORAGE_KEY = "quiz_progress_";

// 💾 שמירת התקדמות השאלון
export const saveQuizProgress = async (
  userId: string,
  progress: QuizProgress
): Promise<boolean> => {
  try {
    const key = `${QUIZ_STORAGE_KEY}${userId}`;
    const progressData = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(key, JSON.stringify(progressData));
    console.log("✅ Quiz progress saved successfully", progressData);
    return true;
  } catch (error) {
    console.error("❌ Failed to save quiz progress:", error);
    return false;
  }
};

// 📖 טעינת התקדמות השאלון
export const loadQuizProgress = async (
  userId: string
): Promise<QuizProgress | null> => {
  try {
    const key = `${QUIZ_STORAGE_KEY}${userId}`;
    const stored = await AsyncStorage.getItem(key);

    if (!stored) {
      console.log("ℹ️ No quiz progress found for user:", userId);
      return null;
    }

    const progress = JSON.parse(stored) as QuizProgress;
    console.log("✅ Quiz progress loaded successfully", progress);
    return progress;
  } catch (error) {
    console.error("❌ Failed to load quiz progress:", error);
    return null;
  }
};

// 🗑️ מחיקת התקדמות השאלון
export const clearQuizProgress = async (userId: string): Promise<boolean> => {
  try {
    const key = `${QUIZ_STORAGE_KEY}${userId}`;
    await AsyncStorage.removeItem(key);
    console.log("✅ Quiz progress cleared successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("❌ Failed to clear quiz progress:", error);
    return false;
  }
};

// ✅ סימון השאלון כהושלם
export const markQuizCompleted = async (
  userId: string,
  finalAnswers: QuizAnswers
): Promise<boolean> => {
  try {
    const completedProgress: QuizProgress = {
      isCompleted: true,
      answers: finalAnswers,
      completedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    return await saveQuizProgress(userId, completedProgress);
  } catch (error) {
    console.error("❌ Failed to mark quiz as completed:", error);
    return false;
  }
};

// 🔄 עדכון התקדמות בזמן אמת
export const updateQuizProgress = async (
  userId: string,
  currentQuestionId: string,
  questionIndex: number,
  currentAnswers: Partial<QuizAnswers>
): Promise<boolean> => {
  try {
    const progress: QuizProgress = {
      isCompleted: false,
      currentQuestionId,
      questionIndex,
      answers: currentAnswers,
      lastUpdated: new Date().toISOString(),
    };

    return await saveQuizProgress(userId, progress);
  } catch (error) {
    console.error("❌ Failed to update quiz progress:", error);
    return false;
  }
};

// 📊 קבלת סטטיסטיקות התקדמות
export const getQuizStats = (progress: QuizProgress) => {
  const totalQuestions = 12; // מספר השאלות הכולל
  const answeredQuestions = Object.keys(progress.answers).length;
  const completionPercentage = Math.round(
    (answeredQuestions / totalQuestions) * 100
  );

  return {
    totalQuestions,
    answeredQuestions,
    completionPercentage,
    isMoreThanHalf: answeredQuestions > totalQuestions / 2,
    estimatedTimeLeft: Math.max(0, (totalQuestions - answeredQuestions) * 2), // 2 דקות לשאלה
  };
};

// 🔍 בדיקה אם המשתמש התחיל שאלון
export const hasUserStartedQuiz = async (userId: string): Promise<boolean> => {
  try {
    const progress = await loadQuizProgress(userId);
    return progress !== null;
  } catch (error) {
    console.error("❌ Failed to check if user started quiz:", error);
    return false;
  }
};

// 🎯 קבלת השאלה הבאה להמשכה
export const getNextQuestionId = (
  currentQuestionId: string,
  answers: Partial<QuizAnswers>
): string | null => {
  // לוגיקה פשוטה - במציאות נצטרך לוגיקה מורכבת יותר
  const questionIds = [
    "goal",
    "whereToTrain",
    "gymMachines",
    "homeEquipment",
    "experience",
    "days",
    "injuries",
    "injuryDetails",
    "trainingType",
    "preferredTime",
    "motivation",
  ];

  const currentIndex = questionIds.indexOf(currentQuestionId);

  if (currentIndex === -1 || currentIndex >= questionIds.length - 1) {
    return null; // סיום השאלון
  }

  return questionIds[currentIndex + 1];
};
