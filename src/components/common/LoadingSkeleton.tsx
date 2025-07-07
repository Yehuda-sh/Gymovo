// src/components/common/LoadingSkeleton.tsx - Loading Skeletons מתקדמים

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/colors";

const { width: screenWidth } = Dimensions.get("window");

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  animated?: boolean;
  shimmerColors?: string[];
}

// רכיב Skeleton בסיסי עם אנימציה
export const Skeleton: React.FC<SkeletonProps> = ({
  width = 100,
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
  shimmerColors = [
    colors.surface || "#f0f0f0",
    colors.border || "#e0e0e0",
    colors.surface || "#f0f0f0",
  ],
}) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;

    const shimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => shimmer());
    };

    shimmer();
  }, [shimmerAnimation, animated]);

  const backgroundColor = animated
    ? shimmerAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: shimmerColors,
      })
    : shimmerColors[0];

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Loading Skeleton עבור כרטיס אימון
export const WorkoutCardSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.workoutCard, style]}>
    <View style={styles.workoutCardHeader}>
      <Skeleton width="60%" height={20} borderRadius={6} />
      <Skeleton width="25%" height={16} borderRadius={4} />
    </View>

    <Skeleton
      width="80%"
      height={14}
      borderRadius={4}
      style={{ marginBottom: 12 }}
    />

    <View style={styles.workoutCardStats}>
      <View style={styles.statItem}>
        <Skeleton width={16} height={16} borderRadius={8} />
        <Skeleton width={40} height={12} borderRadius={4} />
      </View>
      <View style={styles.statItem}>
        <Skeleton width={16} height={16} borderRadius={8} />
        <Skeleton width={50} height={12} borderRadius={4} />
      </View>
      <View style={styles.statItem}>
        <Skeleton width={16} height={16} borderRadius={8} />
        <Skeleton width={30} height={12} borderRadius={4} />
      </View>
    </View>
  </View>
);

// Loading Skeleton עבור כרטיס תוכנית
export const PlanCardSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.planCard, style]}>
    <View style={styles.planCardHeader}>
      <View style={styles.planMainInfo}>
        <Skeleton width="70%" height={20} borderRadius={6} />
        <Skeleton
          width="40%"
          height={14}
          borderRadius={4}
          style={{ marginTop: 4 }}
        />
      </View>
      <Skeleton width={60} height={24} borderRadius={12} />
    </View>

    <Skeleton
      width="85%"
      height={14}
      borderRadius={4}
      style={{ marginBottom: 16 }}
    />

    <View style={styles.planCardFooter}>
      <View style={styles.planTags}>
        <Skeleton width={50} height={20} borderRadius={10} />
        <Skeleton width={60} height={20} borderRadius={10} />
      </View>
      <Skeleton width={24} height={24} borderRadius={12} />
    </View>
  </View>
);

// Loading Skeleton עבור פרופיל משתמש
export const UserProfileSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.userProfile, style]}>
    <Skeleton width={80} height={80} borderRadius={40} />
    <View style={styles.userInfo}>
      <Skeleton width="60%" height={20} borderRadius={6} />
      <Skeleton
        width="40%"
        height={16}
        borderRadius={4}
        style={{ marginTop: 8 }}
      />
    </View>
  </View>
);

// Loading Skeleton עבור סטטיסטיקות
export const StatsGridSkeleton: React.FC<{
  columns?: number;
  style?: ViewStyle;
}> = ({ columns = 4, style }) => (
  <View style={[styles.statsGrid, style]}>
    {Array.from({ length: columns }).map((_, index) => (
      <View key={index} style={styles.statCard}>
        <Skeleton
          width={32}
          height={32}
          borderRadius={16}
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          width="80%"
          height={16}
          borderRadius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton width="60%" height={12} borderRadius={4} />
      </View>
    ))}
  </View>
);

// Loading Skeleton עבור רשימת תרגילים
export const ExerciseListSkeleton: React.FC<{
  count?: number;
  style?: ViewStyle;
}> = ({ count = 5, style }) => (
  <View style={[styles.exerciseList, style]}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Skeleton width={50} height={50} borderRadius={8} />
        <View style={styles.exerciseInfo}>
          <Skeleton width="70%" height={16} borderRadius={4} />
          <Skeleton
            width="50%"
            height={14}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
          <Skeleton
            width="40%"
            height={12}
            borderRadius={4}
            style={{ marginTop: 4 }}
          />
        </View>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
    ))}
  </View>
);

// Loading Skeleton עבור מסך הבית
export const HomeDashboardSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.homeDashboard, style]}>
    {/* Header */}
    <View style={styles.homeHeader}>
      <View>
        <Skeleton width="40%" height={24} borderRadius={6} />
        <Skeleton
          width="30%"
          height={16}
          borderRadius={4}
          style={{ marginTop: 8 }}
        />
      </View>
      <Skeleton width={40} height={40} borderRadius={20} />
    </View>

    {/* Quick Stats */}
    <StatsGridSkeleton columns={3} style={{ marginVertical: 20 }} />

    {/* Recent Workouts */}
    <View style={styles.homeSection}>
      <Skeleton
        width="50%"
        height={20}
        borderRadius={6}
        style={{ marginBottom: 16 }}
      />
      <WorkoutCardSkeleton style={{ marginBottom: 12 }} />
      <WorkoutCardSkeleton style={{ marginBottom: 12 }} />
    </View>

    {/* Recommended Plan */}
    <View style={styles.homeSection}>
      <Skeleton
        width="60%"
        height={20}
        borderRadius={6}
        style={{ marginBottom: 16 }}
      />
      <PlanCardSkeleton />
    </View>
  </View>
);

// Loading Skeleton עבור מסך תוכניות
export const PlansScreenSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.plansScreen, style]}>
    {/* Header */}
    <View style={styles.screenHeader}>
      <Skeleton width="40%" height={28} borderRadius={8} />
      <Skeleton width={32} height={32} borderRadius={16} />
    </View>

    {/* Filter/Sort Bar */}
    <View style={styles.filterBar}>
      <Skeleton width={80} height={32} borderRadius={16} />
      <Skeleton width={60} height={32} borderRadius={16} />
      <Skeleton width={40} height={32} borderRadius={16} />
    </View>

    {/* Plans List */}
    <View style={styles.plansList}>
      {[1, 2, 3, 4].map((index) => (
        <PlanCardSkeleton key={index} style={{ marginBottom: 16 }} />
      ))}
    </View>
  </View>
);

// Shimmer Effect (אנימציה מתקדמת יותר)
export const ShimmerEffect: React.FC<{
  children: React.ReactNode;
  visible?: boolean;
  duration?: number;
}> = ({ children, visible = true, duration = 1500 }) => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    const shimmer = () => {
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start(() => {
        shimmerAnimation.setValue(0);
        shimmer();
      });
    };

    shimmer();
  }, [shimmerAnimation, visible, duration]);

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  if (!visible) return <>{children}</>;

  return (
    <View style={styles.shimmerContainer}>
      {children}
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Workout Card Skeleton
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  workoutCardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // Plan Card Skeleton
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  planCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTags: {
    flexDirection: "row",
    gap: 8,
  },

  // User Profile Skeleton
  userProfile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },

  // Stats Grid Skeleton
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },

  // Exercise List Skeleton
  exerciseList: {
    padding: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 12,
  },

  // Home Dashboard Skeleton
  homeDashboard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  homeSection: {
    marginBottom: 24,
  },

  // Plans Screen Skeleton
  plansScreen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  screenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterBar: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  plansList: {
    flex: 1,
  },

  // Shimmer Effect
  shimmerContainer: {
    overflow: "hidden",
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: screenWidth,
  },
});

export default {
  Skeleton,
  WorkoutCardSkeleton,
  PlanCardSkeleton,
  UserProfileSkeleton,
  StatsGridSkeleton,
  ExerciseListSkeleton,
  HomeDashboardSkeleton,
  PlansScreenSkeleton,
  ShimmerEffect,
};
