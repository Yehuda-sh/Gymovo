// src/screens/auth/quiz/components/QuizOptionCard.tsx - כרטיס אפשרות בודד

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QuizOptionCardProps, quizColors } from "../types";

// רכיב כרטיס אפשרות עם אנימציות hover ובחירה
export const QuizOptionCard: React.FC<QuizOptionCardProps> = ({
  option,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        isSelected && styles.selectedOption,
        { borderLeftColor: option.color || quizColors.primary },
      ]}
      onPress={onPress}
    >
      <View style={styles.optionContent}>
        {option.icon && (
          <Ionicons
            name={option.icon}
            size={24}
            color={
              isSelected
                ? quizColors.selectedText
                : option.color || quizColors.primary
            }
          />
        )}
        <Text
          style={[styles.optionText, isSelected && styles.selectedOptionText]}
        >
          {option.text}
        </Text>
      </View>

      {isSelected && (
        <Ionicons
          name="checkmark-circle"
          size={24}
          color={quizColors.selectedText}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: quizColors.surface,
    padding: 20,
    marginBottom: 12,
    borderRadius: 16,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedOption: {
    backgroundColor: quizColors.selectedOption,
    borderLeftColor: quizColors.selectedOption,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: quizColors.text,
    marginLeft: 16,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: quizColors.selectedText,
  },
});

export default QuizOptionCard;
