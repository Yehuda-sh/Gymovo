// src/components/ui/ProgressBar.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../theme";

type ProgressBarVariant = "default" | "gradient" | "striped";
type ProgressBarSize = "small" | "medium" | "large";

export interface ProgressBarProps {
  progress: number; // 0-100
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  labelPosition?: "inside" | "outside";
  animated?: boolean;
  gradient?: string[];
  style?: ViewStyle;
}

const sizeConfig = {
  small: { height: 4, fontSize: 10 },
  medium: { height: 8, fontSize: 12 },
  large: { height: 12, fontSize: 14 },
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = "default",
  size = "medium",
  color = theme.colors.primary,
  backgroundColor = theme.colors.surface,
  showLabel = false,
  labelPosition = "outside",
  animated = true,
  gradient = [theme.colors.primary, theme.colors.accent],
  style,
}) => {
  const animatedProgress = useSharedValue(0);
  const shimmerPosition = useSharedValue(-1);
  const config = sizeConfig[size];

  useEffect(() => {
    const normalizedProgress = Math.max(0, Math.min(100, progress)) / 100;

    if (animated) {
      animatedProgress.value = withTiming(normalizedProgress, {
        duration: 600,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      animatedProgress.value = normalizedProgress;
    }
  }, [progress, animated, animatedProgress]);

  useEffect(() => {
    if (variant === "striped" && animated) {
      shimmerPosition.value = withTiming(
        2,
        {
          duration: 2000,
          easing: Easing.linear,
        },
        () => {
          shimmerPosition.value = -1;
        }
      );
    }
  }, [variant, animated, shimmerPosition]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmerPosition.value, [-1, 2], [-50, 300]),
      },
    ],
  }));

  const renderProgressBar = () => {
    const barContent =
      variant === "gradient" ? (
        <LinearGradient
          colors={gradient as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: color }]}
        />
      );

    return (
      <Animated.View style={[styles.progressFill, progressStyle]}>
        {barContent}
        {variant === "striped" && (
          <Animated.View style={[styles.shimmer, shimmerStyle]} />
        )}
        {showLabel && labelPosition === "inside" && config.height >= 8 && (
          <View style={styles.insideLabelContainer}>
            <Text style={[styles.insideLabel, { fontSize: config.fontSize }]}>
              {Math.round(progress)}%
            </Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && labelPosition === "outside" && (
        <View style={styles.outsideLabelContainer}>
          <Text style={[styles.outsideLabel, { fontSize: config.fontSize }]}>
            {Math.round(progress)}%
          </Text>
        </View>
      )}
      <View
        style={[
          styles.progressBar,
          {
            height: config.height,
            backgroundColor,
          },
        ]}
      >
        {renderProgressBar()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  progressBar: {
    width: "100%",
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 50,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ skewX: "-20deg" }],
  },
  outsideLabelContainer: {
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  outsideLabel: {
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  insideLabelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  insideLabel: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
