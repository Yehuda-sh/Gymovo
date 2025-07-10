// src/screens/auth/quiz/components/QuizNavigation.tsx - כפתור ניווט

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuizNavigationProps, quizColors } from "../types";

// רכיב ניווט עם כפתורי הבא/קודם
const QuizNavigation: React.FC<QuizNavigationProps> = ({
  isLastQuestion,
  hasSelectedOptions,
  onNext,
}) => {
  return (
    <View style={styles.bottomContainer}>
      <TouchableOpacity
        style={[
          styles.nextButton,
          !hasSelectedOptions && styles.disabledButton,
        ]}
        onPress={onNext}
        disabled={!hasSelectedOptions}
      >
        <Text style={styles.nextButtonText}>
          {isLastQuestion ? "צור תוכנית" : "המשך"}
        </Text>
        <Ionicons
          name={isLastQuestion ? "create" : "arrow-forward"}
          size={20}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    padding: 20,
    backgroundColor: quizColors.surface,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: quizColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: quizColors.border,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default QuizNavigation;
