// src/screens/home/components/WelcomeMessage.tsx
// הודעת ברוכים הבאים דינמית

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { DashboardData } from "../types";

interface WelcomeMessageProps {
  dashboardData: DashboardData | null;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ dashboardData }) => {
  const [message, setMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const messages = getRandomMessage();
    setMessage(messages);

    // אנימציית fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [dashboardData, fadeAnim]);

  const getRandomMessage = () => {
    const recentWorkouts = dashboardData?.recentWorkouts || [];
    const hasRecentWorkout = recentWorkouts.length > 0;
    const streak = dashboardData?.weeklyStats.streak || 0;
    const completed = dashboardData?.weeklyStats.completedWorkouts || 0;

    // הודעות לפי מצב
    if (!hasRecentWorkout) {
      return "זמן מצוין להתחיל! האימון הראשון שלך מחכה 🚀";
    }

    if (streak > 7) {
      return `${streak} ימים ברצף! אתה בלתי ניתן לעצירה! 🔥`;
    }

    if (completed === 0) {
      return "שבוע חדש, הזדמנויות חדשות! בוא נתחיל 💪";
    }

    if (completed >= 5) {
      return "שבוע מדהים! אתה השראה לכולם 🌟";
    }

    const tips = [
      "💡 טיפ: נסה להוסיף משקל קטן כל שבוע",
      "🎯 זכור: עקביות מנצחת אינטנסיביות",
      "⚡ אתגר היום: נסה תרגיל חדש!",
      "🏃 תזונה נכונה = 70% מההצלחה",
      "😴 מנוחה היא חלק מהאימון",
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={["rgba(102, 126, 234, 0.1)", "rgba(118, 75, 162, 0.05)"]}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
        </View>
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default WelcomeMessage;
