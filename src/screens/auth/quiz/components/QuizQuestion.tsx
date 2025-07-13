// src/screens/auth/quiz/components/QuizQuestion.tsx - תצוגת השאלה עם אנימציה

import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuizQuestionProps, quizColors } from "../types";

// רכיב שאלה עם אנימציות
const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  fadeAnim,
  slideAnim,
}) => {
  return (
    <Animated.View
      style={[
        styles.questionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.questionHeader}>
        <Ionicons name={question.icon} size={48} color={quizColors.primary} />
        <Text style={styles.questionText}>{question.text}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  questionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: quizColors.text,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 32,
  },
});

export default QuizQuestion;
