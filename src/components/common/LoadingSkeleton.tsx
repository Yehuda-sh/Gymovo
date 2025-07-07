// src/components/common/LoadingSkeleton.tsx

import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

const { width: screenWidth } = Dimensions.get("window");

export const SkeletonBox = ({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
};

// 🏋️ Skeleton לכרטיס תוכנית אימון
export const PlanCardSkeleton = () => (
  <View style={styles.planCard}>
    <View style={styles.planHeader}>
      <View style={styles.planInfo}>
        <SkeletonBox width="70%" height={20} style={{ marginBottom: 8 }} />
        <SkeletonBox width="40%" height={14} />
      </View>
      <SkeletonBox width={60} height={24} borderRadius={12} />
    </View>

    <SkeletonBox width="85%" height={16} style={{ marginBottom: 12 }} />

    <View style={styles.planTags}>
      <SkeletonBox width={60} height={20} borderRadius={10} />
      <SkeletonBox width={80} height={20} borderRadius={10} />
      <SkeletonBox width={50} height={20} borderRadius={10} />
    </View>

    <View style={styles.planActions}>
      <SkeletonBox width="60%" height={36} borderRadius={8} />
      <SkeletonBox width={36} height={36} borderRadius={18} />
    </View>
  </View>
);

// 🏃‍♂️ Skeleton לרשימת תרגילים
export const ExerciseListSkeleton = () => (
  <View style={styles.exerciseList}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={styles.exerciseItem}>
        <SkeletonBox width={40} height={40} borderRadius={20} />
        <View style={styles.exerciseInfo}>
          <SkeletonBox width="60%" height={18} style={{ marginBottom: 6 }} />
          <SkeletonBox width="40%" height={14} />
        </View>
        <SkeletonBox width={24} height={24} borderRadius={12} />
      </View>
    ))}
  </View>
);

// 📊 Skeleton לסטטיסטיקות
export const StatsSkeleton = () => (
  <View style={styles.statsContainer}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={styles.statCard}>
        <SkeletonBox
          width={32}
          height={32}
          borderRadius={16}
          style={{ marginBottom: 8 }}
        />
        <SkeletonBox width="80%" height={20} style={{ marginBottom: 4 }} />
        <SkeletonBox width="60%" height={14} />
      </View>
    ))}
  </View>
);

// 👤 Skeleton לפרופיל משתמש
export const UserProfileSkeleton = () => (
  <View style={styles.profileContainer}>
    <SkeletonBox
      width={80}
      height={80}
      borderRadius={40}
      style={{ marginBottom: 16 }}
    />
    <SkeletonBox width="60%" height={24} style={{ marginBottom: 8 }} />
    <SkeletonBox width="40%" height={16} style={{ marginBottom: 16 }} />

    <View style={styles.profileStats}>
      <View style={styles.profileStat}>
        <SkeletonBox width="100%" height={20} style={{ marginBottom: 4 }} />
        <SkeletonBox width="80%" height={14} />
      </View>
      <View style={styles.profileStat}>
        <SkeletonBox width="100%" height={20} style={{ marginBottom: 4 }} />
        <SkeletonBox width="80%" height={14} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e1e9ee",
  },

  // Plan Card Skeleton
  planCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 16,
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
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  exerciseInfo: {
    flex: 1,
  },

  // Stats Skeleton
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
  },

  // Profile Skeleton
  profileContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  profileStats: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
  },
  profileStat: {
    flex: 1,
    alignItems: "center",
  },
});
