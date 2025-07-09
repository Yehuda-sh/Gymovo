// src/components/workout-history/WorkoutCard.tsx
// כרטיס אימון מתקדם עם אנימציות, מידע מפורט וחוויית משתמש מעולה

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAnimatedValue } from "../../hooks/useAnimatedValue";
import { Workout, modernColors } from "./types";

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onLongPress: () => void;
  index: number;
}

// רכיב כרטיס האימון הראשי - מציג פרטי אימון עם אנימציות ואינטראקציות
export const WorkoutCard = ({
  workout,
  onPress,
  onLongPress,
  index,
}: WorkoutCardProps) => {
  const scaleAnim = useAnimatedValue(1);
  const rotateAnim = useAnimatedValue(0);

  // אנימציה בעת לחיצה - מקטין וסובב קלות
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(rotateAnim, {
        toValue: -2,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // אנימציה בעת שחרור - חוזר למצב רגיל
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

  // פונקציה לפרמוט זמן אימון - מציגה שעות ודקות בצורה ברורה
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}`
      : `${mins} דק'`;
  };

  // פונקציה לפרמוט תאריך - מציגה תאריכים יחסיים (היום, אתמול, וכו')
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString("he-IL");
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
                  {formatDate(workout.date!)}
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={modernColors.warning} />
                <Text style={styles.ratingText}>{workout.rating || "—"}</Text>
              </View>
            </View>

            {/* שורת הסטטיסטיקות */}
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={modernColors.primary}
                />
                <Text style={styles.statChipText}>
                  {formatDuration(workout.duration || 0)}
                </Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons
                  name="barbell-outline"
                  size={16}
                  color={modernColors.primary}
                />
                <Text style={styles.statChipText}>
                  {workout.totalVolume ? `${workout.totalVolume} ק"ג` : "—"}
                </Text>
              </View>
              <View style={styles.statChip}>
                <Ionicons
                  name="flash-outline"
                  size={16}
                  color={modernColors.primary}
                />
                <Text style={styles.statChipText}>
                  {workout.completedExercises}/{workout.totalExercises}
                </Text>
              </View>
            </View>

            {/* תצוגה מקדימה של הערות */}
            {workout.notes && (
              <Text style={styles.notesPreview} numberOfLines={1}>
                💭 {workout.notes}
              </Text>
            )}
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={modernColors.textSecondary}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </Animated.View>
    </MotiView>
  );
};

// סטיילים לכרטיס האימון - עיצוב מודרני עם הצללות ואנימציות
const styles = StyleSheet.create({
  workoutCard: {
    backgroundColor: modernColors.cardBg,
    borderRadius: 16,
    marginHorizontal: 20,
    shadowColor: modernColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  progressIndicator: {
    height: 4,
    backgroundColor: modernColors.surface,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
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
    fontWeight: "bold",
    color: modernColors.text,
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: modernColors.textSecondary,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: modernColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: modernColors.text,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: modernColors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: modernColors.text,
  },
  notesPreview: {
    fontSize: 14,
    color: modernColors.textSecondary,
    fontStyle: "italic",
  },
  chevron: {
    position: "absolute",
    right: 16,
    top: "50%",
    marginTop: -10,
  },
});
