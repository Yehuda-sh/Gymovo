// src/screens/profile/user/components/QuizStatusCard.tsx
// רכיב ניהול מצב השאלון

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { colors } from "../../../../theme/colors";
import { QuizStatusCardProps } from "../types";
import {
  loadQuizProgress,
  QuizProgress,
} from "../../../../services/quizProgressService";
import { Toast } from "../../../../components/common/Toast";
import QuizResultsView from "./QuizResultsView";

const QuizStatusCard: React.FC<QuizStatusCardProps> = ({
  userId,
  onResumeQuiz,
  onStartNewQuiz,
}) => {
  const [quizProgress, setQuizProgress] = useState<QuizProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [userId]);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const progress = await loadQuizProgress(userId);
      setQuizProgress(progress);
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>טוען מידע על השאלון...</Text>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={styles.quizCard}>
      {!quizProgress ? (
        // לא התחיל שאלון
        <View style={styles.quizContent}>
          <View style={styles.quizIcon}>
            <Ionicons name="help-circle" size={32} color={colors.primary} />
          </View>
          <Text style={styles.quizTitle}>בואו נכיר אותך טוב יותר!</Text>
          <Text style={styles.quizDescription}>
            מלא שאלון קצר ונבנה עבורך תוכנית אימון מותאמת אישית
          </Text>
          <TouchableOpacity style={styles.quizButton} onPress={onStartNewQuiz}>
            <Text style={styles.quizButtonText}>התחל שאלון</Text>
            <Ionicons name="arrow-forward" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      ) : quizProgress.isCompleted ? (
        // השלים שאלון
        <QuizResultsView
          answers={quizProgress.answers}
          completedAt={quizProgress.completedAt}
          onViewPlans={handleViewPlans}
          onRetakeQuiz={handleRetakeQuiz}
        />
      ) : (
        // באמצע שאלון
        <View style={styles.quizContent}>
          <View style={styles.quizIcon}>
            <Ionicons name="pause-circle" size={32} color={colors.warning} />
          </View>
          <Text style={styles.quizTitle}>השאלון שלך ממתין!</Text>
          <Text style={styles.quizDescription}>
            התחלת למלא את השאלון - בואו נמשיך מהמקום שעצרת
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((quizProgress.questionIndex || 0) / 8) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              שאלה {(quizProgress.questionIndex || 0) + 1} מתוך 8
            </Text>
          </View>

          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => onResumeQuiz(quizProgress)}
          >
            <Text style={styles.quizButtonText}>המשך שאלון</Text>
            <Ionicons name="play" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  quizCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  quizContent: {
    alignItems: "center",
  },
  quizIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.warning,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  quizButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quizButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuizStatusCard;
