// src/services/quizProgressService.ts - ✅ שירות ניהול התקדמות שאלון

import AsyncStorage from "@react-native-async-storage/async-storage";
import { QuizAnswers } from "./planGenerator";
import { isDemoUser } from "../constants/demo-users";

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
const DEV_QUIZ_OVERRIDE_KEY = "dev_quiz_override_";

// 🎯 נתוני שאלון דמו עבור משתמשי דמו
const getDemoQuizProgress = (userId: string): QuizProgress | null => {
  if (!isDemoUser(userId)) {
    return null;
  }

  switch (userId) {
    case "demo-user-yoni":
      return {
        isCompleted: true,
        answers: {
          goal: "hypertrophy",
          experience: "beginner",
          equipment: ["gym"],
          workoutDays: 3,
          timePerSession: 45,
          injuries: [],
        },
        completedAt: "2024-11-01T10:30:00Z",
        lastUpdated: "2024-11-01T10:30:00Z",
      };

    case "demo-user-avi":
      return {
        isCompleted: true,
        answers: {
          goal: "strength",
          experience: "intermediate",
          equipment: ["gym"],
          workoutDays: 4,
          timePerSession: 75,
          injuries: [],
        },
        completedAt: "2024-10-01T15:00:00Z",
        lastUpdated: "2024-10-01T15:00:00Z",
      };

    case "demo-user-maya":
      return {
        isCompleted: true,
        answers: {
          goal: "weight_loss",
          experience: "advanced",
          equipment: ["gym", "dumbbells"],
          workoutDays: 6,
          timePerSession: 45,
          injuries: [],
        },
        completedAt: "2024-09-15T12:00:00Z",
        lastUpdated: "2024-09-15T12:00:00Z",
      };

    default:
      return null;
  }
};

// 💾 שמירת התקדמות השאלון
export const saveQuizProgress = async (
  userId: string,
  progress: QuizProgress
): Promise<boolean> => {
  try {
    // אם זה משתמש דמו, לא שומרים במחסן
    if (isDemoUser(userId)) {
      console.log("⚠️ Cannot save quiz progress for demo user:", userId);
      return false;
    }

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
    // בדיקה עבור override של כלי פיתוח תחילה
    if (__DEV__) {
      const overrideKey = `${DEV_QUIZ_OVERRIDE_KEY}${userId}`;
      const override = await AsyncStorage.getItem(overrideKey);
      if (override) {
        const progress = JSON.parse(override) as QuizProgress;
        console.log("🔧 DEV: Using quiz override for", userId, progress);
        return progress;
      }
    }

    // בדיקה עבור משתמשי דמו
    if (isDemoUser(userId)) {
      const demoProgress = getDemoQuizProgress(userId);
      if (demoProgress) {
        console.log("✅ Demo quiz progress loaded successfully", demoProgress);
        return demoProgress;
      }
    }

    // עבור משתמשים רגילים - טעינה מהמחסן
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
    // אם זה משתמש דמו, לא ניתן למחוק
    if (isDemoUser(userId)) {
      console.log("⚠️ Cannot clear quiz progress for demo user:", userId);
      return false;
    }

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
    // אם זה משתמש דמו, לא שומרים
    if (isDemoUser(userId)) {
      console.log("ℹ️ Demo user quiz already completed:", userId);
      return true;
    }

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
    // אם זה משתמש דמו, לא מעדכנים
    if (isDemoUser(userId)) {
      console.log("ℹ️ Cannot update quiz progress for demo user:", userId);
      return false;
    }

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

// 🛠️ פונקציות כלי פיתוח - עובדות גם עם משתמשי דמו
export const devOverrideQuizProgress = async (
  userId: string,
  progress: QuizProgress
): Promise<boolean> => {
  if (!__DEV__) {
    console.warn("⚠️ Dev override only available in development mode");
    return false;
  }

  try {
    const overrideKey = `${DEV_QUIZ_OVERRIDE_KEY}${userId}`;
    const progressData = {
      ...progress,
      lastUpdated: new Date().toISOString(),
    };

    await AsyncStorage.setItem(overrideKey, JSON.stringify(progressData));
    console.log("🔧 DEV: Quiz override saved for", userId, progressData);
    return true;
  } catch (error) {
    console.error("❌ Failed to save dev quiz override:", error);
    return false;
  }
};

export const devClearQuizOverride = async (
  userId: string
): Promise<boolean> => {
  if (!__DEV__) {
    console.warn("⚠️ Dev override only available in development mode");
    return false;
  }

  try {
    const overrideKey = `${DEV_QUIZ_OVERRIDE_KEY}${userId}`;
    await AsyncStorage.removeItem(overrideKey);
    console.log("🔧 DEV: Quiz override cleared for", userId);
    return true;
  } catch (error) {
    console.error("❌ Failed to clear dev quiz override:", error);
    return false;
  }
};

export const devMarkQuizCompleted = async (
  userId: string,
  finalAnswers: QuizAnswers
): Promise<boolean> => {
  if (!__DEV__) {
    console.warn("⚠️ Dev functions only available in development mode");
    return false;
  }

  try {
    const completedProgress: QuizProgress = {
      isCompleted: true,
      answers: finalAnswers,
      completedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    // עבור משתמשי דמו - שמור כ-override
    if (isDemoUser(userId)) {
      return await devOverrideQuizProgress(userId, completedProgress);
    }

    // עבור משתמשים רגילים - שמור רגיל
    return await saveQuizProgress(userId, completedProgress);
  } catch (error) {
    console.error("❌ Failed to mark quiz as completed (dev):", error);
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
