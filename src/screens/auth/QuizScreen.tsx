// src/screens/auth/QuizScreen.tsx - שאלון מותאם אישית

import React, { useCallback } from "react";
import { View, StatusBar, BackHandler, Alert, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../../theme/colors";

// ייבוא מהקובץ המרכזי
import {
  LoadingScreen,
  QuizHeader,
  QuizQuestion,
  QuizOptions,
  QuizNavigation,
  useQuizAnimations,
  useQuizLogic,
  type QuizScreenProps,
  QUIZ_QUESTIONS,
} from "./quiz";

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

  // טיפול בכפתור חזרה של המכשיר
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
    return <LoadingScreen text="יוצר תוכנית מותאמת אישית..." />;
  }

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default QuizScreen;
