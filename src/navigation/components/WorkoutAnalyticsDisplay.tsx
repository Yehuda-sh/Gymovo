// src/components/WorkoutAnalyticsDisplay.tsx
// רכיב להצגת אנליטיקה בזמן אמת במסך האימון

import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useWorkoutAnalytics } from "../hooks/useWorkoutAnalytics";

export const WorkoutAnalyticsDisplay: React.FC = () => {
  const {
    analytics,
    performanceScore,
    fatigueLevel,
    getCoachingMessage,
    applyRecommendations,
    nextSetSuccessProbability,
  } = useWorkoutAnalytics();

  const scoreAnimation = useSharedValue(0);

  useEffect(() => {
    scoreAnimation.value = withSpring(performanceScore);
  }, [performanceScore]);

  const animatedScoreStyle = useAnimatedStyle(() => ({
    width: `${scoreAnimation.value}%`,
  }));

  if (!analytics) return null;

  const getFatigueColor = () => {
    const colors = {
      fresh: "#4CAF50",
      optimal: "#2196F3",
      tired: "#FF9800",
      exhausted: "#F44336",
    };
    return colors[fatigueLevel as keyof typeof colors];
  };

  const getFatigueEmoji = () => {
    const emojis = {
      fresh: "💪",
      optimal: "👍",
      tired: "😮‍💨",
      exhausted: "🥵",
    };
    return emojis[fatigueLevel as keyof typeof emojis];
  };

  return (
    <Animated.View entering={FadeInDown} style={styles.container}>
      {/* ציון ביצועים */}
      <View style={styles.scoreSection}>
        <Text style={styles.sectionTitle}>ציון ביצועים</Text>
        <View style={styles.scoreBar}>
          <Animated.View style={[styles.scoreProgress, animatedScoreStyle]}>
            <LinearGradient
              colors={["#4CAF50", "#8BC34A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </Animated.View>
        </View>
        <Text style={styles.scoreText}>{performanceScore}/100</Text>
      </View>

      {/* רמת עייפות */}
      <View style={styles.fatigueSection}>
        <Text style={styles.sectionTitle}>רמת עייפות</Text>
        <View
          style={[
            styles.fatigueIndicator,
            { backgroundColor: getFatigueColor() },
          ]}
        >
          <Text style={styles.fatigueEmoji}>{getFatigueEmoji()}</Text>
          <Text style={styles.fatigueText}>{fatigueLevel}</Text>
        </View>
      </View>

      {/* הודעת מאמן */}
      <View style={styles.coachSection}>
        <Text style={styles.coachMessage}>{getCoachingMessage()}</Text>
      </View>

      {/* המלצות */}
      {analytics.recommendations.weight.suggestion !== "maintain" && (
        <TouchableOpacity
          style={styles.recommendationButton}
          onPress={applyRecommendations}
        >
          <Feather name="trending-up" size={20} color="#fff" />
          <Text style={styles.recommendationText}>
            {analytics.recommendations.weight.suggestion === "increase"
              ? `הוסף ${analytics.recommendations.weight.amount}ק״ג`
              : `הפחת ${analytics.recommendations.weight.amount}ק״ג`}
          </Text>
        </TouchableOpacity>
      )}

      {/* חיזוי הצלחה */}
      <View style={styles.predictionSection}>
        <Text style={styles.predictionTitle}>סיכוי הצלחה בסט הבא</Text>
        <View style={styles.predictionBar}>
          <View
            style={[
              styles.predictionProgress,
              {
                width: `${nextSetSuccessProbability * 100}%`,
                backgroundColor:
                  nextSetSuccessProbability > 0.7 ? "#4CAF50" : "#FF9800",
              },
            ]}
          />
        </View>
        <Text style={styles.predictionText}>
          {Math.round(nextSetSuccessProbability * 100)}%
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  scoreBar: {
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  scoreProgress: {
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
  },
  fatigueSection: {
    marginBottom: 16,
  },
  fatigueIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  fatigueEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  fatigueText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  coachSection: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  coachMessage: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
  },
  recommendationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  recommendationText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  predictionSection: {
    marginTop: 8,
  },
  predictionTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  predictionBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  predictionProgress: {
    height: "100%",
    borderRadius: 4,
  },
  predictionText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
    textAlign: "right",
  },
});

// שימוש במסך האימון:
// <WorkoutAnalyticsDisplay />
