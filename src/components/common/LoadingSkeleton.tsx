// src/components/common/LoadingSkeleton.tsx - אנימציית שלד לטעינת תוכן

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface LoadingSkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: "text" | "box" | "circle" | "card";
  lines?: number;
  spacing?: number;
  animated?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width,
  height,
  borderRadius,
  style,
  variant = "box",
  lines = 1,
  spacing = 12,
  animated = true,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    }
  }, [animated, animatedValue]);

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "text":
        return {
          width: width ?? "100%",
          height: height ?? 16,
          borderRadius: borderRadius ?? 4,
        };
      case "circle":
        const size = typeof width === "number" ? width : 50;
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
      case "card":
        return {
          width: width ?? "100%",
          height: height ?? 200,
          borderRadius: borderRadius ?? 12,
        };
      default:
        return {
          width: width ?? "100%",
          height: height ?? 50,
          borderRadius: borderRadius ?? 8,
        };
    }
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  const renderSkeleton = () => {
    const skeletonStyle = getVariantStyles();

    return (
      <View style={[styles.skeleton, skeletonStyle, style]}>
        {animated && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                "transparent",
                "rgba(255, 255, 255, 0.3)",
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  if (variant === "text" && lines > 1) {
    return (
      <View>
        {Array.from({ length: lines }).map((_, index) => (
          <View
            key={index}
            style={[
              index > 0 && { marginTop: spacing },
              index === lines - 1 && { width: "70%" },
            ]}
          >
            {renderSkeleton()}
          </View>
        ))}
      </View>
    );
  }

  return renderSkeleton();
};

// Pre-built skeleton components
export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <LoadingSkeleton variant="box" height={150} />
    <View style={styles.cardContent}>
      <LoadingSkeleton variant="text" lines={2} />
      <View style={styles.cardFooter}>
        <LoadingSkeleton variant="text" width="30%" height={12} />
        <LoadingSkeleton variant="text" width="25%" height={12} />
      </View>
    </View>
  </View>
);

export const SkeletonList: React.FC<{
  count?: number;
  style?: ViewStyle;
}> = ({ count = 3, style }) => (
  <View style={style}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.listItem}>
        <LoadingSkeleton variant="circle" width={50} height={50} />
        <View style={styles.listContent}>
          <LoadingSkeleton variant="text" width="70%" />
          <LoadingSkeleton
            variant="text"
            width="50%"
            height={12}
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
    ))}
  </View>
);

export const SkeletonWorkout: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.workoutCard, style]}>
    <View style={styles.workoutHeader}>
      <LoadingSkeleton variant="text" width="60%" height={20} />
      <LoadingSkeleton variant="circle" width={24} height={24} />
    </View>
    <View style={styles.workoutContent}>
      <LoadingSkeleton variant="text" lines={3} />
    </View>
    <View style={styles.workoutFooter}>
      <LoadingSkeleton variant="box" width={80} height={32} />
      <LoadingSkeleton variant="box" width={80} height={32} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.skeleton,
    overflow: "hidden",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  listContent: {
    flex: 1,
    marginLeft: 16,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  workoutContent: {
    marginBottom: 20,
  },
  workoutFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default LoadingSkeleton;
