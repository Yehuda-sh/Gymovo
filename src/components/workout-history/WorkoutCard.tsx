// src/components/workout-history/WorkoutCard.tsx
// כרטיס אימון מעוצב עם אנימציות ומידע מפורט - מתוקן לתאריכים

import { Ionicons } from "@expo/vector-icons";
import { MotiView } from "moti";
import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { WorkoutCardProps, modernColors } from "./types";

/**
 * WorkoutCard Component - מציג אימון בודד עם עיצוב מודרני
 * כולל אנימציות, סטטיסטיקות ופעולות משתמש
 */
export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
  onLongPress,
  index = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // אנימציית לחיצה
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: -2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // פרמוט זמן אימון
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}`
      : `${mins} דק'`;
  };

  // ✅ תיקון: פונקציה לפרמוט תאריך - מטפלת בכל סוגי התאריכים
  const formatDate = (date: Date | string | number | undefined) => {
    if (!date) return "ללא תאריך";

    // המרה בטוחה לאובייקט Date
    const dateObj = date instanceof Date ? date : new Date(date);

    // בדיקה שהתאריך תקף
    if (isNaN(dateObj.getTime())) return "תאריך לא תקין";

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return dateObj.toLocaleDateString("he-IL");
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: 50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
    >
      <Animated.View
        style={[
          {
            transform: [
              { scale: scaleAnim },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [-2, 0],
                  outputRange: ["-2deg", "0deg"],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onLongPress();
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.workoutCard}
        >
          {/* מחוון התקדמות למעלה */}
          <View style={styles.progressIndicator}>
            <LinearGradient
              colors={[modernColors.success, "#00C851"]}
              style={[
                styles.progressBar,
                {
                  width: `${
                    ((workout.completedExercises || 0) /
                      (workout.totalExercises || 0)) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          {/* תוכן הכרטיס */}
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleSection}>
                <Text style={styles.workoutTitle}>{workout.name}</Text>
                <Text style={styles.workoutDate}>
                  {formatDate(workout.date)}
                </Text>
              </View>
              {workout.rating && (
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{workout.rating}</Text>
                </View>
              )}
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={modernColors.muted}
                />
                <Text style={styles.statValue}>
                  {formatDuration(workout.duration || 0)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Ionicons
                  name="barbell-outline"
                  size={16}
                  color={modernColors.muted}
                />
                <Text style={styles.statValue}>
                  {workout.exercises.length} תרגילים
                </Text>
              </View>

              {workout.totalVolume && (
                <View style={styles.statItem}>
                  <Ionicons
                    name="analytics-outline"
                    size={16}
                    color={modernColors.muted}
                  />
                  <Text style={styles.statValue}>
                    {Math.round(workout.totalVolume)}kg
                  </Text>
                </View>
              )}
            </View>

            {/* נקודות עיקריות לשיפור */}
            {workout.personalRecords && workout.personalRecords.length > 0 && (
              <View style={styles.highlightBadge}>
                <Ionicons name="trophy" size={12} color="#FFD700" />
                <Text style={styles.highlightText}>
                  {workout.personalRecords.length} שיאים אישיים!
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </MotiView>
  );
};

// סטיילים למרכיב WorkoutCard
const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: modernColors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  progressIndicator: {
    height: 4,
    backgroundColor: "rgba(0, 200, 81, 0.1)",
  },
  progressBar: {
    height: "100%",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitleSection: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: modernColors.text,
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: modernColors.muted,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFD700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    color: modernColors.muted,
  },
  highlightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFD700",
  },
});
