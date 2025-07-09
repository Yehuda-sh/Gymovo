// src/screens/profile/user/components/QuizResultsView.tsx
// רכיב הצגת תוצאות השאלון

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../../../theme/colors";
import { QuizResultsViewProps } from "../types";

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  answers,
  completedAt,
  onViewPlans,
  onRetakeQuiz,
}) => {
  const getGoalText = (goal?: string) => {
    const goals = {
      hypertrophy: "הגדלת מסת שריר 💪",
      strength: "חיזוק כוח 🏋️",
      endurance: "סיבולת וחיטוב 🏃",
      weight_loss: "ירידה במשקל 🔥",
    };
    return goals[goal as keyof typeof goals] || "לא צוין";
  };

  const getExperienceText = (exp?: string) => {
    const levels = {
      beginner: "מתחיל 🌱",
      intermediate: "בינוני ⚡",
      advanced: "מתקדם 🚀",
    };
    return levels[exp as keyof typeof levels] || "לא צוין";
  };

  const getEquipmentText = (equipment?: string[]) => {
    if (!equipment || equipment.length === 0) return "לא צוין";
    const equipmentMap: Record<string, string> = {
      gym: "חדר כושר",
      home: "בית",
      dumbbells: "משקולות",
      bands: "גומיות",
      bodyweight: "משקל גוף",
    };
    return equipment.map((e) => equipmentMap[e] || e).join(", ");
  };

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <View style={styles.quizIcon}>
          <Ionicons name="checkmark-circle" size={32} color={colors.success} />
        </View>
        <Text style={styles.resultsTitle}>השאלון הושלם בהצלחה! 🎉</Text>
        {completedAt && (
          <Text style={styles.completedDate}>
            הושלם ב-{new Date(completedAt).toLocaleDateString("he-IL")}
          </Text>
        )}
      </View>

      <View style={styles.answersList}>
        {/* מטרה */}
        {answers.goal && (
          <View style={styles.answerItem}>
            <View style={styles.answerIcon}>
              <Ionicons name="fitness" size={18} color={colors.primary} />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>המטרה שלך</Text>
              <Text style={styles.answerValue}>
                {getGoalText(answers.goal)}
              </Text>
            </View>
          </View>
        )}

        {/* ניסיון */}
        {answers.experience && (
          <View style={styles.answerItem}>
            <View
              style={[
                styles.answerIcon,
                { backgroundColor: colors.warning + "20" },
              ]}
            >
              <Ionicons name="trending-up" size={18} color={colors.warning} />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>רמת ניסיון</Text>
              <Text style={styles.answerValue}>
                {getExperienceText(answers.experience)}
              </Text>
            </View>
          </View>
        )}

        {/* ציוד */}
        {answers.equipment && (
          <View style={styles.answerItem}>
            <View style={[styles.answerIcon, { backgroundColor: "#9333ea20" }]}>
              <Ionicons name="barbell" size={18} color="#9333ea" />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>ציוד זמין</Text>
              <Text style={styles.answerValue}>
                {getEquipmentText(answers.equipment)}
              </Text>
            </View>
          </View>
        )}

        {/* ימי אימון */}
        {answers.workoutDays && (
          <View style={styles.answerItem}>
            <View style={[styles.answerIcon, { backgroundColor: "#3b82f620" }]}>
              <Ionicons name="calendar" size={18} color="#3b82f6" />
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>ימי אימון בשבוע</Text>
              <Text style={styles.answerValue}>{answers.workoutDays} ימים</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.resultsActions}>
        <TouchableOpacity style={styles.viewPlansButton} onPress={onViewPlans}>
          <Text style={styles.viewPlansText}>צפה בתוכניות אימון</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.retakeButton} onPress={onRetakeQuiz}>
          <Text style={styles.retakeText}>מלא שאלון מחדש</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    alignItems: "center",
  },
  resultsHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  quizIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginTop: 12,
  },
  completedDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  answersList: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  answerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  answerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  answerContent: {
    flex: 1,
  },
  answerLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  answerValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "600",
  },
  resultsActions: {
    width: "100%",
    gap: 8,
  },
  viewPlansButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  viewPlansText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  retakeButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  retakeText: {
    color: colors.textSecondary,
    fontSize: 13,
    textDecorationLine: "underline",
  },
});

export default QuizResultsView;
