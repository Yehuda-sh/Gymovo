// src/screens/home/components/WelcomeMessage.tsx
// הודעת ברוכים הבאים דינמית עם מערכת עיצוב מאוחדת

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { DashboardData } from "../types";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;

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
        colors={[colors.surfaceLight, colors.surface]}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="bulb-outline" size={16} color={colors.warning} />
        </View>
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 18,
  },
});

export default WelcomeMessage;
