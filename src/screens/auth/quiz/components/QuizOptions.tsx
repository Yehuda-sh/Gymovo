// src/screens/auth/quiz/components/QuizOptions.tsx - רשימת האפשרויות

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { QuizOptionsProps } from "../types";
import QuizOptionCard from "./QuizOptionCard";

// רכיב רשימת האפשרויות עם scroll חלק
export const QuizOptions: React.FC<QuizOptionsProps> = ({
  options,
  selectedOptions,
  multiSelect,
  onSelect,
}) => {
  return (
    <ScrollView
      style={styles.optionsContainer}
      showsVerticalScrollIndicator={false}
    >
      {options.map((option, index) => {
        const isSelected = selectedOptions.some(
          (o) => o.value === option.value
        );

        return (
          <QuizOptionCard
            key={index}
            option={option}
            isSelected={isSelected}
            onPress={() => onSelect(option)}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default QuizOptions;
