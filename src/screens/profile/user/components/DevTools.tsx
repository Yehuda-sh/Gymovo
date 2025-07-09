// src/screens/profile/user/components/DevTools.tsx
// רכיב כלי פיתוח

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";
import { DevToolsProps } from "../types";

const DevTools: React.FC<DevToolsProps> = ({
  user,
  onClearQuiz,
  onCreatePartialQuiz,
  onClearAllData,
}) => {
  if (!__DEV__) {
    return null;
  }

  return (
    <View style={styles.devSection}>
      <Text style={styles.devTitle}>🛠️ כלי פיתוח</Text>

      <TouchableOpacity style={styles.devButton} onPress={onClearQuiz}>
        <Text style={styles.devButtonText}>מחק התקדמות שאלון</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.devButton} onPress={onCreatePartialQuiz}>
        <Text style={styles.devButtonText}>צור שאלון חלקי (בדיקה)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.devButton} onPress={onClearAllData}>
        <Text style={styles.devButtonText}>מחק את כל הנתונים</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  devSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 24,
  },
  devTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  devButton: {
    backgroundColor: colors.warning + "20",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  devButtonText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default DevTools;
