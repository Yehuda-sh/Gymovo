// src/screens/auth/quiz/components/QuizOptions.tsx - רשימת אפשרויות מתאנמות

import React from "react";
import { View, StyleSheet } from "react-native";
import { QuizOptionsProps } from "../types";
import QuizOptionCard from "./QuizOptionCard";

// רכיב רשימת אפשרויות עם אנימציות
const QuizOptions: React.FC<QuizOptionsProps> = ({
  options,
  selectedValue,
  onSelect,
  disabled,
}) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((option, index) => (
        <QuizOptionCard
          key={option.value}
          option={option}
          isSelected={selectedValue === option.value}
          onPress={() => onSelect(option.value)}
          disabled={disabled}
          animationDelay={index * 100}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
  },
});

export default QuizOptions;
