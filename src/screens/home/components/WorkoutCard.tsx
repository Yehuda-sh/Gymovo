// src/screens/home/components/WorkoutCard.tsx
// כרטיס אימון מודרני עם אנימציות וגרדיאנטים

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { theme } from "../../../theme";
import { Workout } from "../../../types/workout";
import { useResponsiveDimensions } from "../../../hooks/useDeviceInfo";

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  isCompact?: boolean;
  animationDelay?: number;
}

/**
 * Modern workout card component with animations and gradients
 */
const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
  isCompact = false,
  animationDelay = 0,
}) => {
  const { isSmallDevice } = useResponsiveDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  // Get workout intensity color
  const getIntensityGradient = (): readonly [string, string] => {
    const exerciseCount = workout.exercises?.length || 0;
    const duration = workout.duration || 0;

    if (duration > 60 || exerciseCount > 8) {
      return ["#f093fb", "#f5576c"] as const; // High intensity - Pink
    } else if (duration > 30 || exerciseCount > 5) {
      return ["#4facfe", "#00f2fe"] as const; // Medium intensity - Blue
    } else {
      return ["#43e97b", "#38f9d7"] as const; // Low intensity - Green
    }
  };

  const formatDate = (dateValue: string | Date | undefined) => {
    if (!dateValue) return "לא ידוע";
    const date = new Date(dateValue);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "היום";
    if (diffDays === 2) return "אתמול";
    if (diffDays <= 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString("he-IL", { day: "numeric", month: "short" });
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: isCompact ? 16 : 20,
      padding: isCompact ? theme.spacing.md : theme.spacing.lg,
      marginBottom: isCompact ? theme.spacing.xs : theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: isCompact ? theme.spacing.sm : theme.spacing.md,
    },
    workoutName: {
      fontSize: isCompact ? 16 : 18,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "right",
      flex: 1,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    dateContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    dateText: {
      fontSize: isCompact ? 11 : 12,
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.95)",
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    statItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    statText: {
      fontSize: isCompact ? 11 : 12,
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.9)",
      marginRight: theme.spacing.xs,
    },
  });

  const gradientColors = getIntensityGradient();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {formatDate(workout.date || workout.completedAt)}
              </Text>
            </View>
            <Text style={styles.workoutName} numberOfLines={1}>
              {workout.name || "אימון"}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {/* Exercises count */}
            <View style={styles.statItem}>
              <Text style={styles.statText}>
                {workout.exercises?.length || 0}
              </Text>
              <Ionicons
                name="barbell"
                size={14}
                color="rgba(255, 255, 255, 0.9)"
              />
            </View>

            {/* Duration */}
            {workout.duration && (
              <View style={styles.statItem}>
                <Text style={styles.statText}>{workout.duration}m</Text>
                <Ionicons
                  name="time"
                  size={14}
                  color="rgba(255, 255, 255, 0.9)"
                />
              </View>
            )}

            {/* Rating */}
            {workout.rating && (
              <View style={styles.statItem}>
                <Text style={styles.statText}>{workout.rating}/5</Text>
                <Ionicons
                  name="star"
                  size={14}
                  color="rgba(255, 255, 255, 0.9)"
                />
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WorkoutCard;
