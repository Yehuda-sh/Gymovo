// src/screens/auth/QuizScreen.tsx - שאלון מותאם אישית

import React, { useCallback } from "react";
import { View, StatusBar, BackHandler, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import {
  LoadingScreen,
  QuizHeader,
  QuizQuestion,
  QuizOptions,
  QuizNavigation,
  useQuizAnimations,
  useQuizLogic,
  QuizScreenProps,
  quizStyles,
} from "./quiz";
import { QUIZ_QUESTIONS } from "./quiz/data";

const QuizScreen: React.FC<QuizScreenProps> = ({ navigation, route }) => {
  const { signupData } = route.params || {};

  // אנימציות
  const { slideAnim, fadeAnim, animateToNextQuestion } = useQuizAnimations();

  // לוגיקה
  const {
    state,
    currentQuestion,
    isLastQuestion,
    progress,
    handleOptionSelect,
    handleNext,
    handleBack,
  } = useQuizLogic({
    questions: QUIZ_QUESTIONS,
    onComplete: () => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    },
    signupData,
  });

  // טיפול בכפתור חזרה של המכשיר (אופציונלי)
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (state.currentQuestionIndex > 0) {
          Alert.alert("יציאה מהשאלון", "האם אתה בטוח שברצונך לצאת?", [
            { text: "ביטול", style: "cancel" },
            {
              text: "יציאה",
              style: "destructive",
              onPress: () => navigation.goBack(),
            },
          ]);
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [state.currentQuestionIndex, navigation])
  );

  // טיפול במעבר לשאלה הבאה עם אנימציה
  const handleNextWithAnimation = async () => {
    if (!isLastQuestion) {
      animateToNextQuestion();
    }
    await handleNext();
  };

  // טיפול בחזרה משופר
  const handleBackPress = () => {
    if (state.currentQuestionIndex > 0) {
      handleBack();
    } else {
      Alert.alert("יציאה מהשאלון", "האם אתה בטוח שברצונך לצאת?", [
        { text: "ביטול", style: "cancel" },
        { text: "יציאה", onPress: () => navigation.goBack() },
      ]);
    }
  };

  // מסך טעינה
  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={quizStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Header */}
      <QuizHeader
        progress={progress}
        currentIndex={state.currentQuestionIndex}
        totalQuestions={QUIZ_QUESTIONS.length}
        onBack={handleBackPress}
      />

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        fadeAnim={fadeAnim}
        slideAnim={slideAnim}
      />

      {/* Options */}
      <QuizOptions
        options={currentQuestion.options}
        selectedOptions={state.selectedOptions}
        multiSelect={currentQuestion.multiSelect}
        onSelect={handleOptionSelect}
      />

      {/* Navigation */}
      <QuizNavigation
        isLastQuestion={isLastQuestion}
        hasSelectedOptions={state.selectedOptions.length > 0}
        onNext={handleNextWithAnimation}
      />
    </View>
  );
};

export default QuizScreen;
