// src/components/cards/workout-card/WorkoutCard.tsx
// WorkoutCard מרכזי ממוקד שמשתמש במודולים נפרדים

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../../theme/colors";
import { Workout } from "../../../types/workout";
import { DifficultyBadge } from "./DifficultyBadge";
import { IntensityIndicator } from "./IntensityIndicator";
import { RatingStars } from "./RatingStars";
import { TargetMuscles } from "./TargetMuscles";
import {
  formatTimeAgo,
  getIntensityGradient,
  calculateWorkoutIntensity,
} from "./utils";
import { WorkoutCardSkeleton } from "./WorkoutCardSkeleton";
import { WorkoutStats } from "./WorkoutStats";
import { BASE_STYLES, ANIMATION_CONFIG, DATE_FORMATS } from "./config";

/**
 * Extended workout type for display purposes
 * כולל שדות נוספים שיכולים להגיע ממקורות שונים
 */
interface ExtendedWorkout extends Workout {
  name?: string;
  completedAt?: string;
  rating?: number;
  difficulty?: string;
  targetMuscles?: string[];
  completedExercises?: number;
  totalExercises?: number;
  isCompleted?: boolean;
}

/**
 * 🎯 רכיב WorkoutCard מתקדם וממוקד
 * מציג פרטי אימון בצורה אלגנטית עם אנימציות ואינטראקטיביות
 */
interface WorkoutCardProps {
  /** נתוני האימון */
  workout: ExtendedWorkout;
  /** פונקציה שתתרחש בלחיצה */
  onPress: () => void;
  /** פונקציה שתתרחש בלחיצה ארוכה */
  onLongPress?: () => void;
  /** אינדקס לאנימציה מדורגת */
  index?: number;
  /** האם להציג אינדיקטור אינטנסיביות */
  showIntensity?: boolean;
  /** האם להציג בפורמט מקוצר */
  compact?: boolean;
  /** וריאנט העיצוב */
  variant?: "default" | "gradient" | "minimal";
  /** האם להציג פס התקדמות */
  showProgress?: boolean;
  /** סגנון מותאם אישית */
  style?: ViewStyle;
}

export const WorkoutCard = React.memo<WorkoutCardProps>(
  ({
    workout,
    onPress,
    onLongPress,
    index = 0,
    showIntensity = true,
    compact = false,
    variant = "default",
    showProgress = false,
    style,
  }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;

    // אנימציית כניסה
    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_CONFIG.entrance.duration,
        delay: index * ANIMATION_CONFIG.entrance.delayIncrement,
        useNativeDriver: true,
      }).start();
    }, [animatedValue, index]);

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: ANIMATION_CONFIG.press.scaleIn,
        tension: ANIMATION_CONFIG.press.tension,
        friction: ANIMATION_CONFIG.press.friction,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: ANIMATION_CONFIG.press.scaleOut,
        tension: ANIMATION_CONFIG.press.tension,
        friction: ANIMATION_CONFIG.press.friction,
        useNativeDriver: true,
      }).start();
    };

    // עיצוב תאריך
    const workoutDate = new Date(
      workout.completedAt || workout.date || 0
    ).toLocaleDateString("he-IL", {
      ...DATE_FORMATS.absolute[compact ? "short" : "long"],
      year: compact ? undefined : "numeric",
    });

    // זמן שעבר
    const timeAgo = formatTimeAgo(workout.completedAt || workout.date || 0);

    // חישוב אינטנסיביות לגרדיאנט
    const intensity = React.useMemo(
      () => calculateWorkoutIntensity(workout),
      [workout]
    );
    const gradientColors = getIntensityGradient(intensity);

    // רכיב הכרטיס הפנימי
    const CardContent = () => (
      <>
        {/* פס התקדמות */}
        {showProgress && workout.completedExercises !== undefined && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (workout.completedExercises /
                      (workout.totalExercises || 1)) *
                    100
                  }%`,
                  backgroundColor: colors.success,
                },
              ]}
            />
          </View>
        )}

        {/* כותרת */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {workout.name || workout.planName || "אימון"}
            </Text>
            <DifficultyBadge
              difficulty={workout.difficulty}
              size={compact ? "small" : "medium"}
            />
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
            <RatingStars
              rating={workout.rating}
              size={compact ? "small" : "medium"}
              showNumericRating={!compact}
            />
          </View>
        </View>

        {/* תאריך */}
        <Text style={styles.cardDate}>{workoutDate}</Text>

        {/* סטטיסטיקות */}
        <WorkoutStats workout={workout} size={compact ? "small" : "medium"} />

        {/* אינדיקטור אינטנסיביות */}
        {showIntensity && !compact && (
          <IntensityIndicator
            workout={workout}
            useGradient={variant === "gradient"}
          />
        )}

        {/* תצוגת הערות */}
        {workout.notes && !compact && (
          <Text style={styles.notesPreview} numberOfLines={2}>
            &ldquo;{workout.notes}&rdquo;
          </Text>
        )}

        {/* שרירי מטרה */}
        {!compact && (
          <TargetMuscles
            muscles={workout.targetMuscles}
            size={compact ? "small" : "medium"}
          />
        )}

        {/* חץ ניווט */}
        {variant !== "minimal" && (
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={20} color="#8e8e93" />
          </View>
        )}

        {/* תווית השלמה */}
        {workout.isCompleted && (
          <View style={styles.completionBadge}>
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
      </>
    );

    // בחירת סגנון לפי וריאנט
    const cardStyle =
      variant === "gradient"
        ? [BASE_STYLES.gradientCard, compact && BASE_STYLES.compactCard]
        : [styles.card, compact && styles.compactCard];

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
          style,
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel={`כרטיס אימון: ${
            workout.name || workout.planName || "אימון"
          }`}
          accessibilityHint="הקש כדי לראות פרטים נוספים"
          accessibilityRole="button"
        >
          {variant === "gradient" ? (
            <LinearGradient
              colors={[...gradientColors]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={cardStyle}
            >
              <CardContent />
            </LinearGradient>
          ) : (
            <View style={cardStyle}>
              <CardContent />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

// הוספת displayName לצורכי דיבוג
WorkoutCard.displayName = "WorkoutCard";

// ייצוא רכיב ה-Skeleton
export { WorkoutCardSkeleton };

const styles = StyleSheet.create({
  // Container Styles
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    ...BASE_STYLES.card,
  },
  compactCard: {
    ...BASE_STYLES.compactCard,
  },

  // Progress Bar
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(0, 200, 81, 0.2)",
    borderTopLeftRadius: BASE_STYLES.card.borderRadius,
    borderTopRightRadius: BASE_STYLES.card.borderRadius,
  },
  progressFill: {
    height: "100%",
    borderTopLeftRadius: BASE_STYLES.card.borderRadius,
    borderTopRightRadius: BASE_STYLES.card.borderRadius,
  },

  // Header Styles
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    marginTop: 8, // מקום לפס התקדמות
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
