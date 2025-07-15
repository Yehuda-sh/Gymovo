// src/screens/profile/user/components/QuizStatusCard.tsx
// רכיב ניהול מצב השאלון - גרסה קומפקטית

import { Ionicons } from "@expo/vector-icons";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  I18nManager,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { QuizStatusCardProps } from "../types";
import {
  loadQuizProgress,
  QuizProgress,
} from "../../../../services/quizProgressService";
import { Toast } from "../../../../components/common/Toast";

// צבעים לעיצוב החדש
const quizColors = {
  cardBackground: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.1)",
  gradientStart: "#667eea",
  gradientEnd: "#764ba2",
  successGradientStart: "#00b894",
  successGradientEnd: "#00cec9",
  warningGradientStart: "#fdcb6e",
  warningGradientEnd: "#e17055",
};

// אכיפת RTL
I18nManager.forceRTL(true);

const QuizStatusCard: React.FC<QuizStatusCardProps> = ({
  userId,
  onResumeQuiz,
  onStartNewQuiz,
  refreshTrigger,
}) => {
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      const progress = await loadQuizProgress(userId);
      setQuizProgress(progress);
      console.log("🔄 QuizStatusCard: Loaded progress", progress);
    } catch (error) {
      console.error("Error loading quiz progress:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProgress();

    // אנימציות כניסה
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [userId, refreshTrigger, loadProgress, scaleAnim, fadeAnim]);

  const handleViewPlans = () => {
    Toast.info("תוכניות אימון - בקרוב");
  };

  if (loading) {
    return (
      <Animated.View
        style={[styles.quizCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.cardInner}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={quizColors.gradientStart} />
            <Text style={styles.loadingText}>טוען מידע...</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.quizCard,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      {!quizProgress ? (
        // לא התחיל שאלון
        <LinearGradient
          colors={[quizColors.gradientStart, quizColors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.quizContent}>
            <View style={styles.quizHeader}>
              <View style={styles.quizIconContainer}>
                <Ionicons name="help-circle" size={24} color="#fff" />
              </View>
              <View style={styles.quizTextContainer}>
                <Text style={styles.quizTitle}>
                  בואו נכיר אותך טוב יותר! ✨
                </Text>
                <Text style={styles.quizDescription}>
                  מלא שאלון קצר ונבנה עבורך תוכנית אימון מותאמת אישית
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.quizButton}
              onPress={onStartNewQuiz}
              activeOpacity={0.8}
            >
              <Text style={styles.quizButtonText}>התחל שאלון</Text>
              <Ionicons
                name="arrow-back"
                size={16}
                color={quizColors.gradientStart}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : quizProgress.isCompleted ? (
        // השלים שאלון - גרסה קומפקטית
        <LinearGradient
          colors={[
            quizColors.successGradientStart,
            quizColors.successGradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.completedContent}>
            <View style={styles.completedHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.completedTitle}>השאלון הושלם! 🎉</Text>
            </View>
            <TouchableOpacity
              style={styles.viewPlansButton}
              onPress={handleViewPlans}
              activeOpacity={0.8}
            >
              <Text style={styles.viewPlansText}>צפה בתוכניות</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : (
        // באמצע שאלון
        <LinearGradient
          colors={[
            quizColors.warningGradientStart,
            quizColors.warningGradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.quizContent}>
            <View style={styles.quizHeader}>
              <View style={styles.quizIconContainer}>
                <Ionicons name="pause-circle" size={24} color="#fff" />
              </View>
              <View style={styles.quizTextContainer}>
                <Text style={styles.quizTitle}>השאלון שלך ממתין! ⏳</Text>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    שאלה {(quizProgress.questionIndex || 0) + 1} מתוך 4
                  </Text>
                  <View style={styles.progressBar}>
                    <Animated.View
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            ((quizProgress.questionIndex || 0) / 4) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.quizButton}
              onPress={() => onResumeQuiz(quizProgress)}
              activeOpacity={0.8}
            >
              <Text style={styles.quizButtonText}>המשך שאלון</Text>
              <Ionicons
                name="arrow-back"
                size={16}
                color={quizColors.warningGradientStart}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  quizCard: {
    marginBottom: 10, // הקטנה מ-20
    borderRadius: 10, // הקטנה מ-20
    overflow: "hidden",
    backgroundColor: quizColors.cardBackground,
    borderWidth: 1,
    borderColor: quizColors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardInner: {
    padding: 10, // הקטנה מ-24
    minHeight: 60, // הקטנה מ-140
    justifyContent: "center",
  },
  cardGradient: {
    padding: 10, // הקטנה מ-24
    minHeight: 60, // הקטנה מ-140
  },
  loadingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  quizContent: {
    gap: 12,
  },
  quizHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  quizIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quizTextContainer: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 14, // הקטנה מ-20
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  quizDescription: {
    fontSize: 12, // הקטנה מ-14
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 12, // הקטנה מ-20
  },
  quizButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 10, // הקטנה מ-24
    paddingVertical: 6, // הקטנה מ-12
    gap: 8,
    alignSelf: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  quizButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  completedContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  completedHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  viewPlansButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewPlansText: {
    fontSize: 14,
    fontWeight: "600",
    color: quizColors.successGradientStart,
  },
  progressInfo: {
    marginTop: 4,
  },
  progressText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  progressBar: {
    width: 100,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
});

export default QuizStatusCard;
