// src/screens/profile/user/hooks/useProfileData.ts
// Hook לניהול מצב ונתונים של הפרופיל

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { Toast } from "../../../../components/common/Toast";
import { clearAllData } from "../../../../data/storage/utilities";
import { savePlan } from "../../../../data/storage/plans";
import { generatePlan, QuizAnswers } from "../../../../services/planGenerator";
import {
  QuizProgress,
  clearQuizProgress,
  saveQuizProgress,
  markQuizCompleted,
  devMarkQuizCompleted,
  devClearQuizOverride,
} from "../../../../services/quizProgressService";
import { useUserStore } from "../../../../stores/userStore";
import { RootStackParamList } from "../../../../types/navigation";
import { ProfileDataHook } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useProfileData = (): ProfileDataHook & {
  refreshTrigger: number;
} => {
  const navigation = useNavigation<NavigationProp>();
  const userState = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    triggerRefresh(); // הפעלת הטריגר לרענון הקומפוננטים
  }, [triggerRefresh]);

  const handleStartQuiz = useCallback(() => {
    if (!userState) return;

    navigation.navigate("Quiz", {
      signupData: {
        email: userState.email,
        password: "",
        age: userState.age || 25,
        name: userState.name,
      },
    });
  }, [userState, navigation]);

  const handleResumeQuiz = useCallback(
    (progress: QuizProgress) => {
      if (!userState) return;

      navigation.navigate("Quiz", {
        signupData: {
          email: userState.email,
          password: "",
          age: userState.age || 25,
          name: userState.name,
        },
        resumeFrom: progress.currentQuestionId,
        existingAnswers: progress.answers,
      });
    },
    [userState, navigation]
  );

  const handleLogout = useCallback(() => {
    Alert.alert("יציאה מהחשבון", "האם אתה בטוח שברצונך לצאת?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "יציאה",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.navigate("Welcome");
        },
      },
    ]);
  }, [logout, navigation]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "מחיקת חשבון",
      "פעולה זו תמחק את כל הנתונים שלך ולא ניתן לבטל אותה. האם אתה בטוח?",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק חשבון",
          style: "destructive",
          onPress: async () => {
            if (userState?.id) {
              await clearAllData();
              logout();
              navigation.navigate("Welcome");
              Toast.show("החשבון נמחק בהצלחה", "success");
            }
          },
        },
      ]
    );
  }, [userState, logout, navigation]);

  const getInitials = useMemo(() => {
    if (!userState?.name) return "G";
    return userState.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userState?.name]);

  // Dev Tools functions
  const handleClearQuiz = useCallback(async () => {
    if (!userState?.id) return;

    try {
      // נסה לנקות override קודם (לכלי פיתוח)
      await devClearQuizOverride(userState.id);

      // ואז נקה את השאלון הרגיל (אם זה לא משתמש דמו)
      await clearQuizProgress(userState.id);

      Toast.show("התקדמות השאלון נמחקה", "success");

      // רענון להצגת השינויים
      triggerRefresh();
    } catch (error) {
      console.error("Failed to clear quiz:", error);
      Toast.show("שגיאה בניקוי השאלון", "error");
    }
  }, [userState, triggerRefresh]);

  // פונקציה מתקדמת ליצירת שאלון חלקי אקראי
  const generateRandomQuizAnswers = (): QuizAnswers => {
    const goals = [
      "strength",
      "weight_loss",
      "endurance",
      "hypertrophy",
    ] as const;
    const experiences = ["beginner", "intermediate", "advanced"] as const;
    const equipmentOptions = [
      ["gym"],
      ["home"],
      ["gym", "dumbbells"],
      ["dumbbells"],
      ["minimal"],
    ];
    const workoutDaysOptions = [3, 4, 5, 6];
    const timeOptions = [30, 45, 60, 75, 90];

    return {
      goal: goals[Math.floor(Math.random() * goals.length)],
      experience: experiences[Math.floor(Math.random() * experiences.length)],
      equipment:
        equipmentOptions[Math.floor(Math.random() * equipmentOptions.length)],
      workoutDays:
        workoutDaysOptions[
          Math.floor(Math.random() * workoutDaysOptions.length)
        ],
      timePerSession:
        timeOptions[Math.floor(Math.random() * timeOptions.length)],
      injuries: Math.random() > 0.8 ? ["knee"] : [], // 20% סיכוי לפציעה
    };
  };

  const handleCreatePartialQuiz = useCallback(async () => {
    if (!userState?.id) {
      Toast.show("משתמש לא מחובר", "error");
      return;
    }

    try {
      Toast.show("יוצר שאלון חדש ומפעיל אלגוריתם...", "info");

      // שלב 1: יצירת תשובות אקראיות
      const randomAnswers = generateRandomQuizAnswers();

      // שלב 2: סימון השאלון כהושלם (עובד גם עם משתמשי דמו!)
      const success = await devMarkQuizCompleted(userState.id, randomAnswers);

      if (!success) {
        Toast.show("שגיאה בשמירת השאלון", "error");
        return;
      }

      // שלב 3: הפעלת האלגוריתם לבניית תוכנית
      const newPlan = await generatePlan(randomAnswers, userState.id);

      // שלב 4: שמירת התוכנית החדשה
      await savePlan(userState.id, newPlan);

      // שלב 5: רענון הפרופיל להצגת השינויים
      triggerRefresh(); // שימוש ב-triggerRefresh במקום handleRefresh

      // שלב 6: הצגת פרטי התוכנית החדשה
      const goalNames = {
        strength: "כוח",
        weight_loss: "ירידה במשקל",
        endurance: "סיבולת",
        hypertrophy: "בניית שריר",
      };

      const experienceNames = {
        beginner: "מתחיל",
        intermediate: "בינוני",
        advanced: "מתקדם",
      };

      Toast.show(
        `נוצרה תוכנית חדשה!\n` +
          `מטרה: ${goalNames[randomAnswers.goal]}\n` +
          `רמה: ${experienceNames[randomAnswers.experience]}\n` +
          `ימי אימון: ${randomAnswers.workoutDays}`,
        "success"
      );
    } catch (error) {
      console.error("Error creating quiz and plan:", error);
      Toast.show("שגיאה ביצירת השאלון והתוכנית", "error");
    }
  }, [userState, triggerRefresh]);

  const handleClearAllData = useCallback(async () => {
    await clearAllData();
    Toast.show("כל הנתונים נמחקו", "success");
  }, []);

  return {
    user: userState,
    isRefreshing,
    handleRefresh,
    handleStartQuiz,
    handleResumeQuiz,
    handleLogout,
    handleDeleteAccount,
    getInitials,
    handleClearQuiz,
    handleCreatePartialQuiz,
    handleClearAllData,
    refreshTrigger,
  };
};
