// src/screens/profile/user/components/QuizStatusCard.tsx
// רכיב ניהול מצב השאלון - קומפקטי ומהיר

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  I18nManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../theme/colors";
import { QuizStatusCardProps } from "../types";
import {
  loadQuizProgress,
  QuizProgress,
} from "../../../../services/quizProgressService";
import { Toast } from "../../../../components/common/Toast";
import QuizResultsView from "./QuizResultsView";

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

  useEffect(() => {
    loadProgress();
  }, [userId, refreshTrigger]); // הוספת refreshTrigger כ-dependency

  const loadProgress = async () => {
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
  };

  const handleViewPlans = () => {
    // Navigate to plans screen
    Toast.show("תוכניות אימון - בקרוב", "info");
  };

  const handleRetakeQuiz = () => {
    onStartNewQuiz();
  };

  if (loading) {
    return (
      <View style={styles.quizCard}>
        <LinearGradient
          colors={["#74b9ff", "#0984e3"]}
          style={styles.cardGradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingText}>טוען מידע על השאלון...</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.quizCard}>
      {!quizProgress ? (
        // לא התחיל שאלון
        <LinearGradient
          colors={["#fd79a8", "#fdcb6e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.quizContent}>
            <View style={styles.quizIconContainer}>
              <Ionicons name="help-circle" size={24} color="#fff" />
            </View>

            <Text style={styles.quizTitle}>בואו נכיר אותך טוב יותר! ✨</Text>
            <Text style={styles.quizDescription}>
              מלא שאלון קצר ונבנה עבורך תוכנית אימון מותאמת אישית
            </Text>

            <TouchableOpacity
              style={styles.quizButton}
              onPress={onStartNewQuiz}
            >
              <Text style={styles.quizButtonText}>התחל שאלון</Text>
              <Ionicons name="arrow-back" size={16} color="#fd79a8" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      ) : quizProgress.isCompleted ? (
        // השלים שאלון
        <LinearGradient
          colors={["#00b894", "#00cec9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <QuizResultsView
            answers={quizProgress.answers}
            completedAt={quizProgress.completedAt}
            onViewPlans={handleViewPlans}
            onRetakeQuiz={handleRetakeQuiz}
          />
        </LinearGradient>
      ) : (
        // באמצע שאלון
        <LinearGradient
          colors={["#fdcb6e", "#e17055"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.quizContent}>
            <View style={styles.quizIconContainer}>
              <Ionicons name="pause-circle" size={24} color="#fff" />
            </View>

            <Text style={styles.quizTitle}>השאלון שלך ממתין! ⏳</Text>
            <Text style={styles.quizDescription}>
              התחלת למלא את השאלון - בואו נמשיך מהמקום שעצרת
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (quizProgress.currentQuestionIndex / 10) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {quizProgress.currentQuestionIndex} מתוך 10 שאלות
              </Text>
            </View>

            <TouchableOpacity style={styles.quizButton} onPress={onResumeQuiz}>
              <Text style={styles.quizButtonText}>המשך שאלון</Text>
              <Ionicons name="arrow-back" size={16} color="#fdcb6e" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  quizCard: {
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
    minHeight: 120,
  },
  loadingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  quizContent: {
    alignItems: "center",
    gap: 8,
  },
  quizIconContainer: {
    marginBottom: 5,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  quizDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 16,
  },
  quizButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
});

export default QuizStatusCard;
