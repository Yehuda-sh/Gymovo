// src/screens/home/components/MotivationCard.tsx
// רכיב מוטיבציה עם פרוגרס ועיצוב RTL נכון

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, I18nManager } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../theme";
import { DashboardData } from "../types";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface MotivationCardProps {
  dashboardData: DashboardData | null;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ dashboardData }) => {
  const { isSmallDevice } = useResponsiveDimensions();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Calculate weekly progress
  const weeklyGoal = 5; // יעד של 5 אימונים בשבוע
  const completed = dashboardData?.weeklyStats.completedWorkouts || 0;
  const progressPercent = Math.min((completed / weeklyGoal) * 100, 100);

  // Animate progress bar
  useEffect(() => {
    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: progressPercent,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [progressPercent]);

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (completed === 0) return "בוא נתחיל השבוע בחזקה! 💪";
    if (completed < 2) return "התחלה מעולה! ממשיך כך! 🔥";
    if (completed < 4) return "אתה במסלול מעולה! 🚀";
    if (completed >= weeklyGoal) return "וואו! השגת את המטרה! 🏆";
    return "עוד קצת ואתה שם! 💯";
  };

  // Get progress color based on completion
  const getProgressColor = () => {
    if (completed === 0) return ["#667eea", "#764ba2"] as const;
    if (completed < 2) return ["#f093fb", "#f5576c"] as const;
    if (completed < 4) return ["#4facfe", "#00f2fe"] as const;
    return ["#43e97b", "#38f9d7"] as const;
  };

  const styles = StyleSheet.create({
    container: {
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
      borderRadius: 16,
      padding: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    // RTL Header - אייקון מימין, טקסט משמאל
    header: {
      flexDirection: "row-reverse", // RTL - אייקון מימין
      alignItems: "center",
      marginBottom: isSmallDevice ? theme.spacing.sm : theme.spacing.md,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: theme.spacing.sm, // RTL - מרווח משמאל לאייקון (אחריו)
    },
    headerText: {
      flex: 1,
      alignItems: "flex-end", // RTL - טקסט מיושר לימין
    },
    title: {
      fontSize: isSmallDevice ? 16 : 18,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "right", // RTL
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    subtitle: {
      fontSize: isSmallDevice ? 11 : 12,
      color: "rgba(255, 255, 255, 0.85)",
      textAlign: "right", // RTL
      fontWeight: "500",
      marginTop: 1,
    },
    progressSection: {
      marginBottom: theme.spacing.sm,
    },
    // RTL Progress Stats - טקסט מיושר לימין
    progressStats: {
      flexDirection: "row-reverse", // RTL
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    progressText: {
      fontSize: isSmallDevice ? 13 : 14,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "right", // RTL
    },
    goalText: {
      fontSize: isSmallDevice ? 11 : 12,
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "500",
      textAlign: "right", // RTL
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 4,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
    },
    motivationMessage: {
      fontSize: isSmallDevice ? 13 : 14,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center", // המסר נשאר במרכז - זה בסדר
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
  });

  const progressGradient = getProgressColor();

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* RTL Header - אייקון מימין, טקסט משמאל */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="trophy"
              size={18}
              color="rgba(255, 255, 255, 0.95)"
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>המטרה השבועית שלך</Text>
            <Text style={styles.subtitle}>עקוב אחר ההתקדמות שלך</Text>
          </View>
        </View>

        {/* Progress Section עם RTL */}
        <View style={styles.progressSection}>
          <View style={styles.progressStats}>
            <Text style={styles.progressText}>{completed} אימונים הושלמו</Text>
            <Text style={styles.goalText}>מתוך {weeklyGoal} אימונים</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: "100%" }}
              />
            </Animated.View>
          </View>
        </View>

        {/* Motivation Message - במרכז */}
        <Text style={styles.motivationMessage}>{getMotivationalMessage()}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default MotivationCard;
