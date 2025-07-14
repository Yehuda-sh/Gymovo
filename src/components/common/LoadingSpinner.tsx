// src/components/common/LoadingSpinner.tsx - אנימציית טעינה מתקדמת

import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  ActivityIndicator,
  Text,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../theme/colors";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  variant?: "default" | "dots" | "pulse" | "gradient";
  style?: ViewStyle;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = colors.primary,
  text,
  fullScreen = false,
  overlay = false,
  variant = "default",
  style,
}) => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (variant === "gradient") {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }

    if (variant === "pulse") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    if (variant === "dots") {
      const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: 1,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        ).start();
      };

      animateDot(dot1, 0);
      animateDot(dot2, 200);
      animateDot(dot3, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const getSize = () => {
    switch (size) {
      case "small":
        return 24;
      case "large":
        return 48;
      default:
        return 36;
    }
  };

  const spinnerSize = getSize();
  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderSpinner = () => {
    switch (variant) {
      case "gradient":
        return (
          <Animated.View
            style={[
              {
                width: spinnerSize,
                height: spinnerSize,
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary, "transparent"]}
              style={[
                styles.gradientSpinner,
                {
                  width: spinnerSize,
                  height: spinnerSize,
                  borderRadius: spinnerSize / 2,
                },
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
        );

      case "pulse":
        return (
          <Animated.View
            style={[
              styles.pulseContainer,
              {
                width: spinnerSize,
                height: spinnerSize,
                borderRadius: spinnerSize / 2,
                backgroundColor: color,
                transform: [{ scale: pulseValue }],
              },
            ]}
          />
        );

      case "dots":
        const dotSize = spinnerSize / 3;
        return (
          <View style={styles.dotsContainer}>
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: color,
                  transform: [
                    {
                      translateY: dot1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -dotSize],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: color,
                  transform: [
                    {
                      translateY: dot2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -dotSize],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: color,
                  transform: [
                    {
                      translateY: dot3.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -dotSize],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        );

      default:
        return (
          <ActivityIndicator
            size={size === "medium" ? "large" : size}
            color={color}
          />
        );
    }
  };

  const content = (
    <View style={[styles.container, style]}>
      {renderSpinner()}
      {text && (
        <Text
          style={[
            styles.text,
            {
              marginTop: size === "large" ? 16 : 12,
              fontSize: size === "large" ? 16 : 14,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={[
          styles.fullScreen,
          overlay && styles.overlay,
          { backgroundColor: overlay ? "rgba(0,0,0,0.7)" : colors.background },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  text: {
    color: colors.text,
    fontWeight: "500",
  },
  gradientSpinner: {
    borderWidth: 3,
    borderColor: "transparent",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  pulseContainer: {
    opacity: 0.8,
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 999,
    marginHorizontal: 4,
  },
});

export default LoadingSpinner;
