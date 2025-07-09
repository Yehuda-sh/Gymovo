// src/screens/auth/quiz/components/QuizHeader.tsx - Header עם progress bar

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuizHeaderProps, quizColors } from "../types";

// רכיב Header עם progress bar מואנם וניווט
export const QuizHeader: React.FC<QuizHeaderProps> = ({
  progress,
  currentIndex,
  totalQuestions,
  onBack,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <Text style={styles.questionCounter}>
        {currentIndex + 1} / {totalQuestions}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: quizColors.headerBg,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: quizColors.progressBg,
    borderRadius: 2,
    marginRight: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: quizColors.progressBar,
    borderRadius: 2,
  },
  questionCounter: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default QuizHeader;
