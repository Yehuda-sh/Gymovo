// src/components/common/LoadingSkeleton.tsx - ✅ תיקון הייצוא ושיפורים

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
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

// 🦴 רכיב Skeleton בסיסי
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // פתרון נקי יותר - יצירת style object נפרד
  const animatedStyle = {
    opacity,
    width,
    height,
    borderRadius,
  } as any; // נאלצים להשתמש ב-any בגלל מגבלות של Animated types

  return <Animated.View style={[styles.skeleton, animatedStyle, style]} />;
};

// 🏋️ כרטיס אימון Skeleton
export const WorkoutCardSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardHeader}>
      <Skeleton width="60%" height={20} borderRadius={4} />
      <Skeleton width="30%" height={16} borderRadius={4} />
    </View>
    <View style={styles.cardBody}>
      <Skeleton width="100%" height={14} borderRadius={4} />
      <Skeleton
        width="85%"
        height={14}
        borderRadius={4}
        style={{ marginTop: 8 }}
      />
    </View>
    <View style={styles.cardFooter}>
      <Skeleton width={60} height={24} borderRadius={12} />
      <Skeleton width={60} height={24} borderRadius={12} />
      <Skeleton width={60} height={24} borderRadius={12} />
    </View>
  </View>
);

// 📋 כרטיס תוכנית Skeleton
export const PlanCardSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.planCard, style]}>
    <View style={styles.planHeader}>
      <Skeleton width="70%" height={24} borderRadius={6} />
      <Skeleton width={40} height={40} borderRadius={20} />
    </View>
    <Skeleton
      width="100%"
      height={60}
      borderRadius={4}
      style={{ marginVertical: 12 }}
    />
    <View style={styles.planTags}>
      <Skeleton width={80} height={24} borderRadius={12} />
      <Skeleton width={60} height={24} borderRadius={12} />
      <Skeleton width={70} height={24} borderRadius={12} />
    </View>
  </View>
);

// 👤 פרופיל משתמש Skeleton
export const UserProfileSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.profileContainer, style]}>
    <Skeleton width={100} height={100} borderRadius={50} />
    <Skeleton
      width="60%"
      height={24}
      borderRadius={6}
      style={{ marginTop: 16 }}
    />
    <Skeleton
      width="40%"
      height={16}
      borderRadius={4}
      style={{ marginTop: 8 }}
    />
    <View style={styles.profileStats}>
      <View style={styles.statItem}>
        <Skeleton width={50} height={32} borderRadius={4} />
        <Skeleton width={60} height={14} borderRadius={4} />
      </View>
      <View style={styles.statItem}>
        <Skeleton width={50} height={32} borderRadius={4} />
        <Skeleton width={60} height={14} borderRadius={4} />
      </View>
      <View style={styles.statItem}>
        <Skeleton width={50} height={32} borderRadius={4} />
        <Skeleton width={60} height={14} borderRadius={4} />
      </View>
    </View>
  </View>
);

// 📊 גריד סטטיסטיקות Skeleton
export const StatsGridSkeleton: React.FC<{
  columns?: number;
  style?: ViewStyle;
}> = ({ columns = 3, style }) => (
  <View style={[styles.statsGrid, style]}>
    {Array.from({ length: columns }).map((_, index) => (
      <View key={index} style={styles.statCard}>
        <Skeleton width={32} height={32} borderRadius={16} />
        <Skeleton
          width="80%"
          height={20}
          borderRadius={4}
          style={{ marginTop: 8 }}
        />
        <Skeleton
          width="60%"
          height={14}
          borderRadius={4}
          style={{ marginTop: 4 }}
        />
      </View>
    ))}
  </View>
);

// 📝 רשימת תרגילים Skeleton
export const ExerciseListSkeleton: React.FC<{
  count?: number;
  style?: ViewStyle;
}> = ({ count = 5, style }) => (
  <View style={style}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.exerciseItem}>
        <Skeleton width={50} height={50} borderRadius={8} />
        <View style={styles.exerciseInfo}>
          <Skeleton width="70%" height={18} borderRadius={4} />
          <Skeleton
            width="50%"
            height={14}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        </View>
      </View>
    ))}
  </View>
);

// 🏠 דשבורד ראשי Skeleton
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

// 📋 מסך תוכניות Skeleton
export const PlansScreenSkeleton: React.FC<{ style?: ViewStyle }> = ({
  style,
}) => (
  <View style={[styles.plansScreen, style]}>
    <View style={styles.screenHeader}>
      <Skeleton width="40%" height={28} borderRadius={8} />
      <Skeleton width={32} height={32} borderRadius={16} />
    </View>

    <View style={styles.filterBar}>
      <Skeleton width={80} height={32} borderRadius={16} />
      <Skeleton width={60} height={32} borderRadius={16} />
      <Skeleton width={40} height={32} borderRadius={16} />
    </View>

    <View style={styles.plansList}>
      {[1, 2, 3, 4].map((index) => (
        <PlanCardSkeleton key={index} style={{ marginBottom: 16 }} />
      ))}
    </View>
  </View>
);

// ✨ אפקט Shimmer מתקדם
export const ShimmerEffect: React.FC<{
  children: React.ReactNode;
  visible?: boolean;
  duration?: number;
}> = ({ children, visible = true, duration = 1500 }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(translateX, {
          toValue: screenWidth,
          duration,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [visible, translateX, duration]);

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
  skeleton: {
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardBody: {
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
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
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTags: {
    flexDirection: "row",
    gap: 8,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 24,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
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

// Default export for compatibility
export default Skeleton;
