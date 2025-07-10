// src/components/cards/workout-card/index.tsx
// WorkoutCard מרכזי ממוקד שמשתמש במודולים נפרדים

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../theme/colors";
import { Workout } from "../../../types/workout";
import { DifficultyBadge } from "./DifficultyBadge";
import { IntensityIndicator } from "./IntensityIndicator";
import { RatingStars } from "./RatingStars";
import { TargetMuscles } from "./TargetMuscles";
import { formatTimeAgo } from "./utils";
import { WorkoutCardSkeleton } from "./WorkoutCardSkeleton";
import { WorkoutStats } from "./WorkoutStats";

/**
 * 🎯 רכיב WorkoutCard מתקדם וממוקד
 * מציג פרטי אימון בצורה אלגנטית עם אנימציות ואינטראקטיביות
 */
interface WorkoutCardProps {
  /** נתוני האימון */
  workout: Workout;
  /** פונקציה שתתרחש בלחיצה */
  onPress: () => void;
  /** פונקציה שתתרחש בלחיצה ארוכה */
  onLongPress: () => void;
  /** אינדקס לאנימציה מדורגת */
  index?: number;
  /** האם להציג אינדיקטור אינטנסיביות */
  showIntensity?: boolean;
  /** האם להציג בפורמט מקוצר */
  compact?: boolean;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
  onLongPress,
  index = 0,
  showIntensity = true,
  compact = false,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, index]);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // עיצוב תאריך
  const workoutDate = new Date(
    workout.completedAt || workout.date || 0
  ).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "short",
    year: compact ? undefined : "numeric",
  });

  // זמן שעבר
  const timeAgo = formatTimeAgo(workout.completedAt || workout.date || 0);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
            { scale: scaleValue },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, compact && styles.compactCard]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* כותרת */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {workout.name}
            </Text>
            <DifficultyBadge difficulty={workout.difficulty} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
            <RatingStars rating={workout.rating} />
          </View>
        </View>

        {/* תאריך */}
        <Text style={styles.cardDate}>{workoutDate}</Text>

        {/* סטטיסטיקות */}
        <WorkoutStats workout={workout} compact={compact} />

        {/* אינדיקטור אינטנסיביות */}
        {showIntensity && !compact && <IntensityIndicator workout={workout} />}

        {/* תצוגת הערות */}
        {workout.notes && !compact && (
          <Text style={styles.notesPreview} numberOfLines={2}>
            &ldquo;{workout.notes}&rdquo;
          </Text>
        )}

        {/* שרירי מטרה */}
        {!compact && <TargetMuscles muscles={workout.targetMuscles} />}

        {/* חץ ניווט */}
        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={20} color="#8e8e93" />
        </View>

        {/* תווית השלמה */}
        <View style={styles.completionBadge}>
          <Ionicons name="checkmark" size={12} color="white" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ייצוא רכיב ה-Skeleton
export { WorkoutCardSkeleton };

const styles = StyleSheet.create({
  // Container Styles
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#333333",
    position: "relative",
    shadowColor: "rgba(0, 0, 0, 0.3)",
  },
  compactCard: {
    padding: 12,
    borderRadius: 12,
  },

  // Header Styles
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    marginRight: 8,
    color: "#ffffff",
  },
  cardMeta: {
    alignItems: "flex-end",
  },
  timeAgo: {
    fontSize: 12,
    marginBottom: 2,
    color: "#8e8e93",
  },
  cardDate: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 12,
    color: "#cccccc",
  },

  // Notes Styles
  notesPreview: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 18,
    textAlign: "right",
    color: "#cccccc",
  },

  // Arrow Styles
  cardArrow: {
    position: "absolute",
    left: 16,
    top: "50%",
    marginTop: -10,
  },

  // Completion Badge
  completionBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.success,
  },
});
