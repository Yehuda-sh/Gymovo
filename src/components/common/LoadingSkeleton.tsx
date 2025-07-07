// src/components/common/LoadingSkeleton.tsx - גרסה מעודכנת עם נושא כהה ושיפורים

import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../../theme/colors";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  variant?: "light" | "medium" | "shimmer";
}

const { width: screenWidth } = Dimensions.get("window");

// 🎨 Base Skeleton component עם אנימציה מתקדמת
export const SkeletonBox = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
  variant = "shimmer",
}: SkeletonProps) => {
  const opacity = useSharedValue(0.3);
  const translateX = useSharedValue(-200);

  React.useEffect(() => {
    if (variant === "shimmer") {
      // Shimmer effect - גל רץ
      translateX.value = withRepeat(
        withSequence(
          withTiming(screenWidth + 200, { duration: 1200 }),
          withTiming(-200, { duration: 0 })
        ),
        -1,
        false
      );
    } else {
      // Pulse effect - דפיקה
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        false
      );
    }
  }, [variant]);

  const animatedStyle = useAnimatedStyle(() => {
    if (variant === "shimmer") {
      return {
        transform: [{ translateX: translateX.value }],
      };
    }
    return {
      opacity: opacity.value,
    };
  });

  const getSkeletonColor = () => {
    switch (variant) {
      case "light":
        return colors.surface;
      case "medium":
        return colors.border;
      default:
        return colors.surface;
    }
  };

  return (
    <View
      style={[
        styles.skeletonContainer,
        { width, height, borderRadius, backgroundColor: getSkeletonColor() },
        style,
      ]}
    >
      {variant === "shimmer" && (
        <Animated.View
          style={[styles.shimmerGradient, { borderRadius }, animatedStyle]}
        />
      )}
      {variant !== "shimmer" && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: getSkeletonColor(), borderRadius },
            animatedStyle,
          ]}
        />
      )}
    </View>
  );
};

// 🏋️ Skeleton לכרטיס תוכנית אימון - נושא כהה
export const PlanCardSkeleton = () => (
  <View style={styles.planCard}>
    <View style={styles.planHeader}>
      <View style={styles.planInfo}>
        <SkeletonBox width="70%" height={20} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={14} />
      </View>
      <SkeletonBox width={60} height={24} borderRadius={12} />
    </View>

    <SkeletonBox width="85%" height={16} style={{ marginVertical: 12 }} />
    <SkeletonBox width="95%" height={16} style={{ marginBottom: 16 }} />

    <View style={styles.planTags}>
      <SkeletonBox width={60} height={20} borderRadius={10} />
      <SkeletonBox width={80} height={20} borderRadius={10} />
      <SkeletonBox width={50} height={20} borderRadius={10} />
    </View>

    <View style={styles.planActions}>
      <SkeletonBox width="60%" height={40} borderRadius={8} />
      <SkeletonBox width={40} height={40} borderRadius={20} />
    </View>
  </View>
);

// 🏃‍♂️ Skeleton לרשימת תרגילים - משופר
export const ExerciseListSkeleton = () => (
  <View style={styles.exerciseList}>
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} style={styles.exerciseItem}>
        <SkeletonBox width={50} height={50} borderRadius={25} />
        <View style={styles.exerciseInfo}>
          <SkeletonBox width="70%" height={18} style={{ marginBottom: 6 }} />
          <SkeletonBox width="50%" height={14} style={{ marginBottom: 4 }} />
          <SkeletonBox width="40%" height={12} />
        </View>
        <View style={styles.exerciseActions}>
          <SkeletonBox width={24} height={24} borderRadius={12} />
        </View>
      </View>
    ))}
  </View>
);

// 📊 Skeleton לסטטיסטיקות בית - מקצועי יותר
export const HomeStatsSkeleton = () => (
  <View style={styles.statsGrid}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.statCard}>
        <View style={styles.statHeader}>
          <SkeletonBox width={32} height={32} borderRadius={16} />
          <SkeletonBox width={20} height={20} borderRadius={10} />
        </View>
        <SkeletonBox width="90%" height={24} style={{ marginBottom: 4 }} />
        <SkeletonBox width="60%" height={14} />
      </View>
    ))}
  </View>
);

// 👤 Skeleton לפרופיל משתמש - עיצוב חדש
export const UserProfileSkeleton = () => (
  <View style={styles.profileContainer}>
    <View style={styles.profileHeader}>
      <SkeletonBox width={100} height={100} borderRadius={50} />
      <View style={styles.profileInfo}>
        <SkeletonBox width="80%" height={24} style={{ marginBottom: 8 }} />
        <SkeletonBox width="60%" height={16} style={{ marginBottom: 12 }} />
        <View style={styles.profileBadges}>
          <SkeletonBox width={60} height={20} borderRadius={10} />
          <SkeletonBox width={80} height={20} borderRadius={10} />
        </View>
      </View>
    </View>

    <View style={styles.profileStatsGrid}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.profileStat}>
          <SkeletonBox width="100%" height={28} style={{ marginBottom: 4 }} />
          <SkeletonBox width="80%" height={14} />
        </View>
      ))}
    </View>
  </View>
);

// 🏠 Skeleton למסך בית מלא
export const HomeScreenSkeleton = () => (
  <View style={styles.homeContainer}>
    {/* Header */}
    <View style={styles.homeHeader}>
      <View>
        <SkeletonBox width="60%" height={24} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={16} />
      </View>
      <SkeletonBox width={44} height={44} borderRadius={22} />
    </View>

    {/* Quick Actions */}
    <View style={styles.quickActions}>
      <SkeletonBox width="45%" height={120} borderRadius={12} />
      <SkeletonBox width="45%" height={120} borderRadius={12} />
    </View>

    {/* Stats Section */}
    <View style={styles.homeSection}>
      <SkeletonBox width="40%" height={20} style={{ marginBottom: 16 }} />
      <HomeStatsSkeleton />
    </View>

    {/* Recent Plans */}
    <View style={styles.homeSection}>
      <View style={styles.sectionHeader}>
        <SkeletonBox width="50%" height={20} />
        <SkeletonBox width="20%" height={16} />
      </View>
      <PlanCardSkeleton />
    </View>
  </View>
);

// 📋 Skeleton לרשימת תוכניות מלאה
export const PlansListSkeleton = () => (
  <View style={styles.plansContainer}>
    {[1, 2, 3].map((i) => (
      <PlanCardSkeleton key={i} />
    ))}
  </View>
);

// 🎨 Styles מעודכנים לנושא כהה
const styles = StyleSheet.create({
  // Base skeleton styles
  skeletonContainer: {
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  shimmerGradient: {
    width: 100,
    height: "100%",
    backgroundColor: `${colors.primary}20`,
    position: "absolute",
  },

  // Plan Card Skeleton
  planCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
    marginRight: 12,
  },
  planTags: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  planActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Exercise List Skeleton
  exerciseList: {
    gap: 12,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseActions: {
    alignItems: "center",
  },

  // Home Stats Skeleton
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (screenWidth - 60) / 2,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  // Profile Skeleton
  profileContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileBadges: {
    flexDirection: "row",
    gap: 8,
  },
  profileStatsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  profileStat: {
    flex: 1,
    alignItems: "center",
  },

  // Home Screen Skeleton
  homeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  homeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  homeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  // Plans List
  plansContainer: {
    padding: 20,
  },
});

export default {
  SkeletonBox,
  PlanCardSkeleton,
  ExerciseListSkeleton,
  HomeStatsSkeleton,
  UserProfileSkeleton,
  HomeScreenSkeleton,
  PlansListSkeleton,
};
