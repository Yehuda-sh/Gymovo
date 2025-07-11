// src/screens/profile/user/components/QuizResultsView.tsx
// רכיב הצגת תוצאות השאלון - עיצוב מהפכני ומדהים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../theme/colors";
import { QuizResultsViewProps } from "../types";

// אכיפת RTL
I18nManager.forceRTL(true);

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
      gym: "חדר כושר 🏟️",
      home: "בית 🏠",
      dumbbells: "משקולות 🏋️",
      bands: "גומיות 🎯",
      bodyweight: "משקל גוף 💪",
    };
    return equipment.map((e) => equipmentMap[e] || e).join(", ");
  };

  const getAnswerIconGradient = (index: number) => {
    const gradients = [
      ["#ff6b6b", "#ffa726"], // מטרה - אדום לכתום
      ["#4ecdc4", "#44a08d"], // ניסיון - ירוק כחלחל
      ["#a8edea", "#fed6e3"], // ציוד - תכלת לוורוד
      ["#667eea", "#764ba2"], // ימי אימון - כחול לסגול
    ];
    return gradients[index % gradients.length];
  };

  return (
    <View style={styles.resultsContainer}>
      {/* כותרת מנצחת עם אפקטים */}
      <View style={styles.resultsHeader}>
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={["#00b894", "#00cec9"]}
            style={styles.successIconGradient}
          >
            <Ionicons name="checkmark-circle" size={32} color="#fff" />
          </LinearGradient>
          {/* הילה זוהרת */}
          <View style={styles.successGlow} />
        </View>

        <Text style={styles.resultsTitle}>השאלון הושלם בהצלחה! 🎉</Text>
        <Text style={styles.successSubtitle}>
          התוכנית האידיאלית שלך מוכנה ✨
        </Text>

        {completedAt && (
          <View style={styles.dateContainer}>
            <LinearGradient
              colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
              style={styles.dateBadge}
            >
              <Ionicons
                name="calendar"
                size={12}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.completedDate}>
                הושלם ב-{new Date(completedAt).toLocaleDateString("he-IL")}
              </Text>
            </LinearGradient>
          </View>
        )}
      </View>

      {/* רשימת תשובות מעוצבת */}
      <View style={styles.answersList}>
        {/* מטרה */}
        {answers.goal && (
          <View style={styles.answerItem}>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>המטרה שלך</Text>
              <Text style={styles.answerValue}>
                {getGoalText(answers.goal)}
              </Text>
            </View>
            <LinearGradient
              colors={getAnswerIconGradient(0)}
              style={styles.answerIcon}
            >
              <Ionicons name="fitness" size={20} color="#fff" />
            </LinearGradient>
          </View>
        )}

        {/* ניסיון */}
        {answers.experience && (
          <View style={styles.answerItem}>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>רמת ניסיון</Text>
              <Text style={styles.answerValue}>
                {getExperienceText(answers.experience)}
              </Text>
            </View>
            <LinearGradient
              colors={getAnswerIconGradient(1)}
              style={styles.answerIcon}
            >
              <Ionicons name="trending-up" size={20} color="#fff" />
            </LinearGradient>
          </View>
        )}

        {/* ציוד */}
        {answers.equipment && (
          <View style={styles.answerItem}>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>ציוד זמין</Text>
              <Text style={styles.answerValue}>
                {getEquipmentText(answers.equipment)}
              </Text>
            </View>
            <LinearGradient
              colors={getAnswerIconGradient(2)}
              style={styles.answerIcon}
            >
              <Ionicons name="barbell" size={20} color="#fff" />
            </LinearGradient>
          </View>
        )}

        {/* ימי אימון */}
        {answers.workoutDays && (
          <View style={styles.answerItem}>
            <View style={styles.answerContent}>
              <Text style={styles.answerLabel}>ימי אימון בשבוע</Text>
              <Text style={styles.answerValue}>{answers.workoutDays} ימים</Text>
            </View>
            <LinearGradient
              colors={getAnswerIconGradient(3)}
              style={styles.answerIcon}
            >
              <Ionicons name="calendar" size={20} color="#fff" />
            </LinearGradient>
          </View>
        )}
      </View>

      {/* כפתורי פעולה מרשימים */}
      <View style={styles.resultsActions}>
        <TouchableOpacity
          style={styles.viewPlansContainer}
          onPress={onViewPlans}
        >
          <LinearGradient
            colors={["#667eea", "#764ba2"]}
            style={styles.viewPlansButton}
          >
            <Text style={styles.viewPlansText}>צפה בתוכניות אימון</Text>
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </View>
          </LinearGradient>
          <View style={styles.buttonGlow} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.retakeButton} onPress={onRetakeQuiz}>
          <LinearGradient
            colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
            style={styles.retakeGradient}
          >
            <Text style={styles.retakeText}>מלא שאלון מחדש</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    alignItems: "center",
    position: "relative",
    zIndex: 10,
  },
  resultsHeader: {
    alignItems: "center",
    marginBottom: 25,
  },
  successIconContainer: {
    position: "relative",
    marginBottom: 15,
  },
  successIconGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00b894",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  successGlow: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(0, 184, 148, 0.2)",
    top: -10,
    left: -10,
    zIndex: -1,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
  successSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },
  dateContainer: {
    marginTop: 8,
  },
  dateBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  completedDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontWeight: "500",
  },
  answersList: {
    width: "100%",
    gap: 15,
    marginBottom: 25,
  },
  answerItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "rgba(0,0,0,0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  answerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  answerContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  answerLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
    textAlign: "right",
    fontWeight: "600",
  },
  answerValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
    textAlign: "right",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resultsActions: {
    width: "100%",
    gap: 12,
  },
  viewPlansContainer: {
    position: "relative",
  },
  viewPlansButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
    shadowColor: "rgba(102, 126, 234, 0.3)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  buttonGlow: {
    position: "absolute",
    bottom: -8,
    left: 8,
    right: 8,
    height: 20,
    backgroundColor: "rgba(102, 126, 234, 0.3)",
    borderRadius: 25,
    blur: 15,
  },
  viewPlansText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  retakeButton: {
    alignItems: "center",
    overflow: "hidden",
    borderRadius: 20,
  },
  retakeGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  retakeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default QuizResultsView;
