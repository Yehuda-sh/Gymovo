// src/screens/profile/user/components/QuizResultsView.tsx
// רכיב הצגת תוצאות השאלון - עיצוב מודרני ועקבי

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { QuizResultsViewProps } from "../types";

// צבעים מותאמים לעיצוב החדש
const resultsColors = {
  success: "#00b894",
  successLight: "#00cec9",
  primary: "#667eea",
  primaryDark: "#764ba2",
  text: "#ffffff",
  textSecondary: "rgba(255, 255, 255, 0.9)",
  textMuted: "rgba(255, 255, 255, 0.7)",
  cardBackground: "rgba(255, 255, 255, 0.08)",
  cardBorder: "rgba(255, 255, 255, 0.15)",
};

// אכיפת RTL
I18nManager.forceRTL(true);

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  answers,
  completedAt,
  onViewPlans,
  onRetakeQuiz,
}) => {
  // אנימציות
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

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

  const resultItems = [
    {
      icon: "fitness",
      label: "המטרה שלך",
      value: getGoalText(answers.goal),
      visible: !!answers.goal,
    },
    {
      icon: "trending-up",
      label: "רמת ניסיון",
      value: getExperienceText(answers.experience),
      visible: !!answers.experience,
    },
    {
      icon: "barbell",
      label: "ציוד זמין",
      value: getEquipmentText(answers.equipment),
      visible: !!answers.equipment,
    },
    {
      icon: "calendar",
      label: "ימי אימון בשבוע",
      value: answers.workoutDays ? `${answers.workoutDays} ימים` : "",
      visible: !!answers.workoutDays,
    },
  ];

  return (
    <Animated.View
      style={[
        styles.resultsContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* כותרת מנצחת */}
      <View style={styles.resultsHeader}>
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={[resultsColors.success, resultsColors.successLight]}
            style={styles.successIconGradient}
          >
            <Ionicons name="checkmark-circle" size={36} color="#fff" />
          </LinearGradient>
        </View>

        <Text style={styles.resultsTitle}>השאלון הושלם בהצלחה! 🎉</Text>
        <Text style={styles.successSubtitle}>התוכנית האידיאלית שלך מוכנה</Text>

        {completedAt && (
          <View style={styles.dateContainer}>
            <View style={styles.dateBadge}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={resultsColors.textMuted}
              />
              <Text style={styles.completedDate}>
                {new Date(completedAt).toLocaleDateString("he-IL")}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* רשימת תשובות */}
      <View style={styles.answersList}>
        {resultItems
          .filter((item) => item.visible)
          .map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.answerItem,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.answerContent}>
                <Text style={styles.answerLabel}>{item.label}</Text>
                <Text style={styles.answerValue}>{item.value}</Text>
              </View>
              <View
                style={[
                  styles.answerIcon,
                  { backgroundColor: `${resultsColors.primary}20` },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={resultsColors.primary}
                />
              </View>
            </Animated.View>
          ))}
      </View>

      {/* כפתורי פעולה */}
      <View style={styles.resultsActions}>
        <TouchableOpacity
          style={styles.viewPlansButton}
          onPress={() => handlePress(onViewPlans)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[resultsColors.primary, resultsColors.primaryDark]}
            style={styles.viewPlansGradient}
          >
            <Text style={styles.viewPlansText}>צפה בתוכניות אימון</Text>
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => handlePress(onRetakeQuiz)}
        >
          <Text style={styles.retakeText}>מלא שאלון מחדש</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    alignItems: "center",
    width: "100%",
  },
  resultsHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: resultsColors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: resultsColors.text,
    textAlign: "center",
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 16,
    color: resultsColors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  dateContainer: {
    marginTop: 12,
  },
  dateBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    backgroundColor: resultsColors.cardBackground,
    borderWidth: 1,
    borderColor: resultsColors.cardBorder,
  },
  completedDate: {
    fontSize: 12,
    color: resultsColors.textMuted,
    fontWeight: "500",
  },
  answersList: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  answerItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: resultsColors.cardBackground,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: resultsColors.cardBorder,
  },
  answerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  answerContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  answerLabel: {
    fontSize: 12,
    color: resultsColors.textMuted,
    marginBottom: 2,
    fontWeight: "600",
  },
  answerValue: {
    fontSize: 15,
    color: resultsColors.text,
    fontWeight: "700",
    textAlign: "right",
  },
  resultsActions: {
    width: "100%",
    gap: 12,
  },
  viewPlansButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: resultsColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  viewPlansGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  viewPlansText: {
    color: resultsColors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  actionIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  retakeButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  retakeText: {
    color: resultsColors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationColor: resultsColors.textSecondary,
  },
});

export default QuizResultsView;
