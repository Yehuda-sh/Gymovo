// src/screens/profile/user/hooks/useProfileData.ts
// Hook לניהול מצב ונתונים של הפרופיל

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { Toast } from "../../../../components/common/Toast";
import { clearAllData } from "../../../../data/storage";
import {
  QuizProgress,
  clearQuizProgress,
  saveQuizProgress,
} from "../../../../services/quizProgressService";
import { useUserStore } from "../../../../stores/userStore";
import { RootStackParamList } from "../../../../types/navigation";
import { ProfileDataHook } from "../types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useProfileData = (): ProfileDataHook => {
  const navigation = useNavigation<NavigationProp>();
  const userState = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

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
    if (userState?.id) {
      await clearQuizProgress(userState.id);
      Toast.show("התקדמות השאלון נמחקה", "success");
    }
  }, [userState]);

  const handleCreatePartialQuiz = useCallback(async () => {
    if (userState?.id) {
      const partialProgress: QuizProgress = {
        isCompleted: false,
        currentQuestionId: "experience",
        questionIndex: 4,
        answers: {
          goal: "hypertrophy",
          experience: "intermediate",
          equipment: ["gym"],
          workoutDays: 4,
        },
        lastUpdated: new Date().toISOString(),
      };
      await saveQuizProgress(userState.id, partialProgress);
      Toast.show("נוצר שאלון חלקי לבדיקה", "success");
    }
  }, [userState]);

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
  };
};
