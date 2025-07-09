// src/screens/exercises/details/components/ErrorState.tsx
// רכיב מצב שגיאה

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../../../../components/common/Button";
import { colors } from "../../../../theme/colors";
import { ErrorStateProps } from "../types";

const ErrorState: React.FC<ErrorStateProps> = ({
  errorText = "אירעה שגיאה בטעינת התרגיל.",
  onBackPress,
}) => {
  return (
    <View style={styles.centered}>
      <Text style={styles.errorText}>{errorText}</Text>
      <Button title="חזור" onPress={onBackPress} style={styles.backButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 24,
  },
});

export default ErrorState;
