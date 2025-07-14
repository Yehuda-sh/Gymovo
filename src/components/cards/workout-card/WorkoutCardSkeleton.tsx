// src/components/cards/workout-card/WorkoutCardSkeleton.tsx
// רכיב Skeleton לטעינת WorkoutCard עם אנימציות

import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { BASE_STYLES, ANIMATION_CONFIG } from "./config";

/**
 * 💀 רכיב Skeleton לטעינת כרטיס אימון
 * מציג placeholder אנימטיבי בזמן טעינת נתונים
 */
interface WorkoutCardSkeletonProps {
  /** האם להציג בפורמט מקוצר */
  compact?: boolean;
  /** אינדקס לאנימציה מדורגת */
  index?: number;
  /** וריאנט העיצוב */
  variant?: "default" | "gradient" | "minimal";
  /** סגנון מותאם אישית */
  style?: ViewStyle;
}

export const WorkoutCardSkeleton = React.memo<WorkoutCardSkeletonProps>(
  ({ compact = false, index = 0, variant = "default", style }) => {
    const pulseAnim = useRef(new Animated.Value(0.3)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // אנימציית כניסה
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_CONFIG.entrance.duration,
        delay: index * ANIMATION_CONFIG.entrance.delayIncrement,
        useNativeDriver: true,
      }).start();

      // אנימציית פעימה
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    }, [pulseAnim, fadeAnim, index]);

    // רכיב שלד בודד
    const SkeletonItem = ({
      width,
      height = 12,
      borderRadius = 4,
      marginBottom = 0,
    }: {
      width: number | `${number}%`;
      height?: number;
      borderRadius?: number;
      marginBottom?: number;
    }) => (
      <Animated.View
        style={[
          styles.skeletonItem,
          {
            width,
            height,
            borderRadius,
            marginBottom,
            opacity: pulseAnim,
          },
        ]}
      />
    );

    // בחירת סגנון לפי וריאנט
    const containerStyle =
      variant === "gradient"
        ? [styles.gradientContainer, compact && styles.compactContainer]
        : [styles.container, compact && styles.compactContainer];

    return (
      <Animated.View style={[containerStyle, { opacity: fadeAnim }, style]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <SkeletonItem width="60%" height={20} />
            {!compact && (
              <SkeletonItem width={60} height={16} borderRadius={8} />
            )}
          </View>
          <View style={styles.metaSection}>
            <SkeletonItem width={50} height={12} marginBottom={4} />
            {!compact && <SkeletonItem width={80} height={16} />}
          </View>
        </View>

        {/* Date */}
        <View style={styles.dateRow}>
          <SkeletonItem width="30%" height={14} />
        </View>

        {/* Stats */}
        <View style={[styles.stats, compact && styles.compactStats]}>
          <SkeletonItem width={50} height={12} />
          <SkeletonItem width={40} height={12} />
          <SkeletonItem width={45} height={12} />
          {!compact && <SkeletonItem width={55} height={12} />}
        </View>

        {/* Additional elements for non-compact view */}
        {!compact && (
          <>
            {/* Intensity bar */}
            <View style={styles.intensitySection}>
              <SkeletonItem width="100%" height={4} marginBottom={4} />
              <View style={styles.intensityLabels}>
                <SkeletonItem width={60} height={10} />
                <SkeletonItem width={30} height={10} />
              </View>
            </View>

            {/* Notes */}
            {variant !== "minimal" && (
              <View style={styles.notesSection}>
                <SkeletonItem width="80%" height={16} marginBottom={4} />
                <SkeletonItem width="60%" height={16} />
              </View>
            )}

            {/* Muscle tags */}
            <View style={styles.muscles}>
              <SkeletonItem width={50} height={20} borderRadius={10} />
              <SkeletonItem width={45} height={20} borderRadius={10} />
              <SkeletonItem width={55} height={20} borderRadius={10} />
            </View>
          </>
        )}
      </Animated.View>
    );
  }
);

// הוספת displayName לצורכי דיבוג
WorkoutCardSkeleton.displayName = "WorkoutCardSkeleton";

const styles = StyleSheet.create({
  container: {
    ...BASE_STYLES.card,
    marginBottom: 12,
  },
  gradientContainer: {
    ...BASE_STYLES.gradientCard,
    marginBottom: 12,
    backgroundColor: "#1e1e1e",
  },
  compactContainer: {
    ...BASE_STYLES.compactCard,
  },
  skeletonItem: {
    backgroundColor: "#3a3a3c",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaSection: {
    alignItems: "flex-end",
  },
  dateRow: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
    gap: 16,
  },
  compactStats: {
    marginBottom: 0,
    gap: 12,
  },
  intensitySection: {
    marginBottom: 12,
  },
  intensityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notesSection: {
    marginBottom: 12,
    alignItems: "flex-end",
  },
  muscles: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
    flexWrap: "wrap",
  },
});
