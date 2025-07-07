// src/components/cards/WorkoutCard.tsx - 💫 Enhanced Workout Card

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getCurrentColors,
  getDifficultyColor,
  getMuscleColor,
} from "../../theme/colors";
import { Workout } from "../../types/workout";

const { width } = Dimensions.get("window");

// 🎨 Enhanced Color System
const useColors = () => getCurrentColors();

// 💀 Skeleton Loading Component
export const WorkoutCardSkeleton = ({ index = 0 }: { index?: number }) => {
  const colors = useColors();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Staggered animation
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]).start();
  }, [pulseAnim, slideAnim, index]);

  const skeletonOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeletonContainer,
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.light,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Header Skeleton */}
      <View style={styles.skeletonHeader}>
        <Animated.View
          style={[
            styles.skeletonTitle,
            {
              backgroundColor: colors.border.medium,
              opacity: skeletonOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonBadge,
            {
              backgroundColor: colors.border.medium,
              opacity: skeletonOpacity,
            },
          ]}
        />
      </View>

      {/* Date Skeleton */}
      <Animated.View
        style={[
          styles.skeletonDate,
          {
            backgroundColor: colors.border.medium,
            opacity: skeletonOpacity,
          },
        ]}
      />

      {/* Stats Skeleton */}
      <View style={styles.skeletonStats}>
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.skeletonStat,
              {
                backgroundColor: colors.border.medium,
                opacity: skeletonOpacity,
              },
            ]}
          />
        ))}
      </View>

      {/* Notes Skeleton */}
      <Animated.View
        style={[
          styles.skeletonNotes,
          {
            backgroundColor: colors.border.medium,
            opacity: skeletonOpacity,
          },
        ]}
      />

      {/* Muscles Skeleton */}
      <View style={styles.skeletonMuscles}>
        {[1, 2, 3].map((item) => (
          <Animated.View
            key={item}
            style={[
              styles.skeletonMuscleTag,
              {
                backgroundColor: colors.border.medium,
                opacity: skeletonOpacity,
              },
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// 🏷️ Difficulty Badge Component
const DifficultyBadge = ({ difficulty }: { difficulty?: string }) => {
  if (!difficulty) return null;

  const getBadgeStyle = () => {
    switch (difficulty) {
      case "beginner":
        return {
          color: getDifficultyColor("beginner"),
          text: "מתחיל",
          icon: "leaf",
        };
      case "intermediate":
        return {
          color: getDifficultyColor("intermediate"),
          text: "בינוני",
          icon: "flash",
        };
      case "advanced":
        return {
          color: getDifficultyColor("advanced"),
          text: "מתקדם",
          icon: "flame",
        };
      default:
        return {
          color: getCurrentColors().text.secondary,
          text: difficulty,
          icon: "help",
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <View
      style={[styles.difficultyBadge, { backgroundColor: badgeStyle.color }]}
    >
      <Ionicons name={badgeStyle.icon as any} size={12} color="white" />
      <Text style={styles.difficultyText}>{badgeStyle.text}</Text>
    </View>
  );
};

// ⭐ Rating Stars Component
const RatingStars = ({ rating }: { rating?: number }) => {
  const colors = useColors();

  if (!rating) return null;

  return (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={12}
          color={
            star <= rating
              ? colors.workout.rating.star
              : colors.workout.rating.starEmpty
          }
        />
      ))}
      <Text style={[styles.ratingText, { color: colors.text.secondary }]}>
        ({rating.toFixed(1)})
      </Text>
    </View>
  );
};

// 📊 Workout Stats Component
const WorkoutStats = ({ workout }: { workout: Workout }) => {
  const colors = useColors();

  const totalVolume = React.useMemo(() => {
    return workout.exercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((setTotal, set) => {
        return setTotal + (set.weight || 0) * (set.reps || 0);
      }, 0);
      return total + exerciseVolume;
    }, 0);
  }, [workout.exercises]);

  const totalSets = React.useMemo(() => {
    return workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);
  }, [workout.exercises]);

  const formatVolume = (kg: number) => {
    if (kg > 1000) return `${(kg / 1000).toFixed(1)}k`;
    return Math.round(kg).toString();
  };

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons
          name="barbell-outline"
          size={14}
          color={colors.text.secondary}
        />
        <Text style={[styles.statText, { color: colors.text.secondary }]}>
          {workout.exercises.length} תרגילים
        </Text>
      </View>

      <View style={styles.statItem}>
        <Ionicons
          name="layers-outline"
          size={14}
          color={colors.text.secondary}
        />
        <Text style={[styles.statText, { color: colors.text.secondary }]}>
          {totalSets} סטים
        </Text>
      </View>

      {workout.duration && (
        <View style={styles.statItem}>
          <Ionicons
            name="time-outline"
            size={14}
            color={colors.text.secondary}
          />
          <Text style={[styles.statText, { color: colors.text.secondary }]}>
            {workout.duration} דק׳
          </Text>
        </View>
      )}

      {totalVolume > 0 && (
        <View style={styles.statItem}>
          <Ionicons
            name="trending-up-outline"
            size={14}
            color={colors.text.secondary}
          />
          <Text style={[styles.statText, { color: colors.text.secondary }]}>
            {formatVolume(totalVolume)} ק״ג
          </Text>
        </View>
      )}
    </View>
  );
};

// 💪 Target Muscles Component
const TargetMuscles = ({ muscles }: { muscles?: string[] }) => {
  const colors = useColors();

  if (!muscles || muscles.length === 0) return null;

  return (
    <View style={styles.musclesContainer}>
      {muscles.slice(0, 4).map((muscle, index) => (
        <View
          key={index}
          style={[
            styles.muscleTag,
            {
              backgroundColor: getMuscleColor(muscle) + "15",
              borderColor: getMuscleColor(muscle) + "30",
            },
          ]}
        >
          <Text style={[styles.muscleText, { color: getMuscleColor(muscle) }]}>
            {muscle}
          </Text>
        </View>
      ))}
      {muscles.length > 4 && (
        <View
          style={[
            styles.moreMuscles,
            { backgroundColor: colors.background.tertiary },
          ]}
        >
          <Text
            style={[styles.moreMusclesText, { color: colors.text.tertiary }]}
          >
            +{muscles.length - 4}
          </Text>
        </View>
      )}
    </View>
  );
};

// 🔥 Workout Intensity Indicator
const IntensityIndicator = ({ workout }: { workout: Workout }) => {
  const colors = useColors();

  const intensity = React.useMemo(() => {
    // Calculate intensity based on volume, duration, and sets
    const totalVolume = workout.exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((setTotal, set) => {
          return setTotal + (set.weight || 0) * (set.reps || 0);
        }, 0)
      );
    }, 0);

    const totalSets = workout.exercises.reduce((total, exercise) => {
      return total + exercise.sets.length;
    }, 0);

    const duration = workout.duration || 45;

    // Normalize intensity (0-100)
    const volumeScore = Math.min((totalVolume / 1000) * 30, 30);
    const setsScore = Math.min((totalSets / 20) * 40, 40);
    const durationScore = Math.min((duration / 90) * 30, 30);

    return Math.round(volumeScore + setsScore + durationScore);
  }, [workout]);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return colors.error;
    if (intensity >= 60) return colors.warning;
    if (intensity >= 40) return colors.success;
    return colors.text.tertiary;
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity >= 80) return "גבוהה";
    if (intensity >= 60) return "בינונית";
    if (intensity >= 40) return "נמוכה";
    return "קלה";
  };

  return (
    <View style={styles.intensityContainer}>
      <View
        style={[styles.intensityBar, { backgroundColor: colors.border.light }]}
      >
        <View
          style={[
            styles.intensityFill,
            {
              backgroundColor: getIntensityColor(intensity),
              width: `${intensity}%`,
            },
          ]}
        />
      </View>
      <Text
        style={[styles.intensityLabel, { color: getIntensityColor(intensity) }]}
      >
        עצימות {getIntensityLabel(intensity)}
      </Text>
    </View>
  );
};

// 🎯 Main Enhanced Workout Card Component
interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onLongPress: () => void;
  index?: number;
  showIntensity?: boolean;
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
  const colors = useColors();
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

  const workoutDate = new Date(
    workout.completedAt || workout.date || 0
  ).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "short",
    year: compact ? undefined : "numeric",
  });

  const timeAgo = React.useMemo(() => {
    const date = new Date(workout.completedAt || workout.date || 0);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "עכשיו";
    if (diffInHours < 24) return `לפני ${diffInHours} שעות`;
    if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `לפני ${days} ימים`;
    }
    if (diffInHours < 24 * 30) {
      const weeks = Math.floor(diffInHours / (24 * 7));
      return `לפני ${weeks} שבועות`;
    }
    const months = Math.floor(diffInHours / (24 * 30));
    return `לפני ${months} חודשים`;
  }, [workout.completedAt, workout.date]);

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
        style={[
          styles.card,
          compact && styles.compactCard,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
            shadowColor: colors.shadow.medium,
          },
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text
              style={[styles.cardTitle, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {workout.name}
            </Text>
            <DifficultyBadge difficulty={workout.difficulty} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={[styles.timeAgo, { color: colors.text.tertiary }]}>
              {timeAgo}
            </Text>
            <RatingStars rating={workout.rating} />
          </View>
        </View>

        {/* Date */}
        <Text style={[styles.cardDate, { color: colors.text.secondary }]}>
          {workoutDate}
        </Text>

        {/* Stats */}
        <WorkoutStats workout={workout} />

        {/* Intensity Indicator */}
        {showIntensity && !compact && <IntensityIndicator workout={workout} />}

        {/* Notes Preview */}
        {workout.notes && !compact && (
          <Text
            style={[styles.notesPreview, { color: colors.text.secondary }]}
            numberOfLines={2}
          >
            "{workout.notes}"
          </Text>
        )}

        {/* Target Muscles */}
        {!compact && <TargetMuscles muscles={workout.targetMuscles} />}

        {/* Arrow */}
        <View style={styles.cardArrow}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.text.tertiary}
          />
        </View>

        {/* Completion Badge */}
        <View
          style={[styles.completionBadge, { backgroundColor: colors.success }]}
        >
          <Ionicons name="checkmark" size={12} color="white" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🎨 Styles
const styles = StyleSheet.create({
  // Container Styles
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    position: "relative",
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
  },
  cardMeta: {
    alignItems: "flex-end",
  },
  timeAgo: {
    fontSize: 12,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 14,
    textAlign: "right",
    marginBottom: 12,
  },

  // Badge Styles
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
    gap: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  completionBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  // Rating Styles
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 4,
  },

  // Stats Styles
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },

  // Intensity Styles
  intensityContainer: {
    marginBottom: 12,
  },
  intensityBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  intensityFill: {
    height: "100%",
    borderRadius: 2,
  },
  intensityLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "right",
  },

  // Notes Styles
  notesPreview: {
    fontSize: 13,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 18,
    textAlign: "right",
  },

  // Muscles Styles
  musclesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  muscleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  muscleText: {
    fontSize: 10,
    fontWeight: "500",
  },
  moreMuscles: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    marginBottom: 4,
  },
  moreMusclesText: {
    fontSize: 10,
    fontWeight: "500",
  },

  // Arrow Styles
  cardArrow: {
    position: "absolute",
    left: 16,
    top: "50%",
    marginTop: -10,
  },

  // Skeleton Styles
  skeletonContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  skeletonTitle: {
    height: 20,
    borderRadius: 4,
    width: "60%",
  },
  skeletonBadge: {
    height: 16,
    borderRadius: 8,
    width: 50,
  },
  skeletonDate: {
    height: 14,
    borderRadius: 4,
    marginBottom: 12,
    width: "30%",
    alignSelf: "flex-end",
  },
  skeletonStats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 12,
  },
  skeletonStat: {
    height: 12,
    borderRadius: 4,
    width: 60,
  },
  skeletonNotes: {
    height: 32,
    borderRadius: 4,
    marginBottom: 12,
    width: "80%",
    alignSelf: "flex-end",
  },
  skeletonMuscles: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
  },
  skeletonMuscleTag: {
    height: 20,
    borderRadius: 10,
    width: 50,
  },
});

export default WorkoutCard;
