// src/components/LoadingSkeleton.tsx - ✅ תוקן לייצוא named
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// 🎨 Props לרכיב LoadingSkeleton
interface LoadingSkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: "text" | "circular" | "rectangular" | "button";
  lines?: number; // למספר שורות טקסט
  spacing?: number; // רווח בין שורות
  duration?: number; // משך האנימציה
  direction?: "ltr" | "rtl";
  intensity?: "light" | "medium" | "dark";
}

// 📐 ממדי מסך
const { width: screenWidth } = Dimensions.get("window");

// 🎭 וריאנטים מוכנים
const SKELETON_VARIANTS = {
  text: {
    height: 16,
    borderRadius: 4,
    width: "100%",
  },
  circular: {
    borderRadius: 9999,
  },
  rectangular: {
    borderRadius: 8,
  },
  button: {
    height: 48,
    borderRadius: 12,
    width: "100%",
  },
};

// 🎨 עוצמות אנימציה
const INTENSITY_COLORS = {
  light: {
    base: "#f0f0f0",
    highlight: "#e0e0e0",
  },
  medium: {
    base: "#e0e0e0",
    highlight: "#c0c0c0",
  },
  dark: {
    base: "#2a2a2a",
    highlight: "#3a3a3a",
  },
};

// ✅ שינוי לייצוא named במקום default
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width,
  height,
  borderRadius,
  style,
  variant = "rectangular",
  lines = 1,
  spacing = 8,
  duration = 1500,
  direction = "rtl",
  intensity = "dark",
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // הגדרת סגנון לפי וריאנט
  const variantStyle = SKELETON_VARIANTS[variant] || {};
  const colors = INTENSITY_COLORS[intensity];

  // אנימציית הבהוב
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue, duration]);

  // חישוב opacity לאנימציה
  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.6],
  });

  // יצירת שורות מרובות לטקסט
  const renderLines = () => {
    return Array.from({ length: lines }).map((_, index) => {
      const isLastLine = index === lines - 1;
      const lineWidth = isLastLine ? "70%" : "100%";

      return (
        <View
          key={index}
          style={[
            styles.line,
            {
              width: lineWidth,
              marginBottom: index < lines - 1 ? spacing : 0,
              alignSelf: direction === "rtl" ? "flex-end" : "flex-start",
            },
          ]}
        >
          <SkeletonItem
            width={lineWidth}
            height={height}
            borderRadius={borderRadius}
            variantStyle={variantStyle}
            opacity={opacity}
            colors={colors}
          />
        </View>
      );
    });
  };

  // רכיב בודד
  if (lines === 1) {
    return (
      <SkeletonItem
        width={width}
        height={height}
        borderRadius={borderRadius}
        style={style}
        variantStyle={variantStyle}
        opacity={opacity}
        colors={colors}
      />
    );
  }

  // מספר שורות
  return <View style={style}>{renderLines()}</View>;
};

// 🎯 רכיב פנימי לשלד בודד
interface SkeletonItemProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variantStyle?: any;
  opacity: Animated.AnimatedInterpolation<number>;
  colors: {
    base: string;
    highlight: string;
  };
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width,
  height,
  borderRadius,
  style,
  variantStyle,
  opacity,
  colors,
}) => {
  return (
    <Animated.View
      style={[
        styles.skeleton,
        variantStyle,
        {
          width: width || variantStyle.width,
          height: height || variantStyle.height,
          borderRadius: borderRadius ?? variantStyle.borderRadius ?? 8,
          opacity,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[colors.base, colors.highlight, colors.base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

// 🎨 Skeleton Presets - קומפוננטים מוכנים
export const TextSkeleton: React.FC<Partial<LoadingSkeletonProps>> = (
  props
) => <LoadingSkeleton variant="text" {...props} />;

export const CircularSkeleton: React.FC<Partial<LoadingSkeletonProps>> = (
  props
) => <LoadingSkeleton variant="circular" {...props} />;

export const ButtonSkeleton: React.FC<Partial<LoadingSkeletonProps>> = (
  props
) => <LoadingSkeleton variant="button" {...props} />;

export const CardSkeleton: React.FC<Partial<LoadingSkeletonProps>> = (
  props
) => (
  <View style={styles.card}>
    <LoadingSkeleton height={200} borderRadius={12} />
    <View style={styles.cardContent}>
      <LoadingSkeleton variant="text" lines={2} spacing={12} />
      <View style={styles.cardFooter}>
        <LoadingSkeleton width={60} height={24} borderRadius={12} />
        <LoadingSkeleton width={80} height={24} borderRadius={12} />
      </View>
    </View>
  </View>
);

export const ListItemSkeleton: React.FC<Partial<LoadingSkeletonProps>> = (
  props
) => (
  <View style={styles.listItem}>
    <LoadingSkeleton variant="circular" width={48} height={48} />
    <View style={styles.listItemContent}>
      <LoadingSkeleton variant="text" width="60%" />
      <LoadingSkeleton variant="text" width="40%" height={12} />
    </View>
  </View>
);

// 🎨 סטיילים
const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  line: {
    overflow: "hidden",
  },
  card: {
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginVertical: 8,
  },
  cardContent: {
    marginTop: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    marginVertical: 4,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
});
