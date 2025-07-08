// src/components/SkeletonLoader.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  Dimensions,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

const { width: screenWidth } = Dimensions.get("window");

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: "text" | "circular" | "rectangular" | "button";
  animation?: "pulse" | "wave";
}

// רכיב Skeleton בודד
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  borderRadius,
  style,
  variant = "rectangular",
  animation = "wave",
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    if (animation === "pulse") {
      // אנימציית Pulse
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
    } else {
      // אנימציית Wave
      Animated.loop(
        Animated.timing(translateX, {
          toValue: screenWidth,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, []);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "circular":
        const size = typeof width === "number" ? width : 40;
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
      case "text":
        return {
          width: width || "100%",
          height: 16,
          borderRadius: 4,
        };
      case "button":
        return {
          width: width || "100%",
          height: 48,
          borderRadius: 8,
        };
      default:
        return {
          width: width || "100%",
          height: height || 20,
          borderRadius: borderRadius ?? 8,
        };
    }
  };

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.skeleton, getVariantStyles(), style]}>
      {animation === "pulse" ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: colors.skeleton,
              opacity,
            },
          ]}
        />
      ) : (
        <>
          <View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: colors.skeleton },
            ]}
          />
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.3)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
        </>
      )}
    </View>
  );
};

// קומפוננטות Skeleton מוכנות לשימוש

// Skeleton לכרטיס אימון
export const WorkoutCardSkeleton: React.FC = () => {
  return (
    <View style={skeletonStyles.workoutCard}>
      <View style={skeletonStyles.workoutHeader}>
        <Skeleton width={120} height={20} variant="text" />
        <Skeleton width={60} height={16} variant="text" />
      </View>
      <View style={skeletonStyles.workoutContent}>
        <Skeleton
          width="100%"
          height={12}
          variant="text"
          style={{ marginBottom: 8 }}
        />
        <Skeleton width="80%" height={12} variant="text" />
      </View>
      <View style={skeletonStyles.workoutFooter}>
        <Skeleton width={80} height={32} variant="button" />
        <Skeleton width={40} height={40} variant="circular" />
      </View>
    </View>
  );
};

// Skeleton לרשימת תרגילים
export const ExerciseListSkeleton: React.FC = () => {
  return (
    <View>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={skeletonStyles.exerciseItem}>
          <Skeleton width={60} height={60} borderRadius={8} />
          <View style={skeletonStyles.exerciseContent}>
            <Skeleton width={150} height={18} variant="text" />
            <Skeleton
              width={100}
              height={14}
              variant="text"
              style={{ marginTop: 6 }}
            />
          </View>
          <Skeleton width={24} height={24} variant="circular" />
        </View>
      ))}
    </View>
  );
};

// Skeleton למסך פרופיל
export const ProfileSkeleton: React.FC = () => {
  return (
    <View style={skeletonStyles.profile}>
      <Skeleton
        width={100}
        height={100}
        variant="circular"
        style={{ alignSelf: "center" }}
      />
      <Skeleton
        width={150}
        height={24}
        variant="text"
        style={{ alignSelf: "center", marginTop: 16 }}
      />
      <Skeleton
        width={200}
        height={16}
        variant="text"
        style={{ alignSelf: "center", marginTop: 8 }}
      />

      <View style={skeletonStyles.statsContainer}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={skeletonStyles.statItem}>
            <Skeleton width={60} height={40} borderRadius={8} />
            <Skeleton
              width={50}
              height={12}
              variant="text"
              style={{ marginTop: 8 }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// סטיילים לקומפוננטות השלד
const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
    backgroundColor: colors.skeleton,
  },
});

const skeletonStyles = StyleSheet.create({
  // Workout Card
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  workoutContent: {
    marginBottom: 16,
  },
  workoutFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Exercise List
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface,
    marginBottom: 8,
    borderRadius: 8,
  },
  exerciseContent: {
    flex: 1,
    marginHorizontal: 12,
  },

  // Profile
  profile: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 32,
  },
  statItem: {
    alignItems: "center",
  },
});

// הוספת הצבע לקובץ colors.ts
// יש להוסיף: skeleton: '#E0E0E0' או כל צבע אחר שמתאים לעיצוב
