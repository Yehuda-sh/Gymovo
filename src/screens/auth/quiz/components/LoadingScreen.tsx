// src/screens/auth/quiz/components/LoadingScreen.tsx - מסך טעינה יפה

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors } from "../../../../theme/colors";
import { LoadingScreenProps } from "../types";

// רכיב מסך טעינה עם הודעה מותאמת
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  text = "יוצר תוכנית מותאמת אישית..." 
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    fontWeight: "500",
  },
});

export default LoadingScreen; 