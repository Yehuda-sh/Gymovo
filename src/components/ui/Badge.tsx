// src/components/ui/Badge.tsx
import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { theme } from "../../theme";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
type BadgeSize = "small" | "medium" | "large";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  count?: number;
  animated?: boolean;
  outline?: boolean;
  rounded?: boolean;
  style?: ViewStyle;
}

const variantColors = {
  default: {
    backgroundColor: theme.colors.surface,
    textColor: theme.colors.text,
    borderColor: theme.colors.border,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    textColor: "#FFFFFF",
    borderColor: theme.colors.primary,
  },
  success: {
    backgroundColor: theme.colors.success,
    textColor: "#FFFFFF",
    borderColor: theme.colors.success,
  },
  warning: {
    backgroundColor: theme.colors.warning,
    textColor: "#FFFFFF",
    borderColor: theme.colors.warning,
  },
  danger: {
    backgroundColor: theme.colors.error,
    textColor: "#FFFFFF",
    borderColor: theme.colors.error,
  },
  info: {
    backgroundColor: theme.colors.info,
    textColor: "#FFFFFF",
    borderColor: theme.colors.info,
  },
};

const sizeStyles = {
  small: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 10,
    height: 20,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    height: 24,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 14,
    height: 28,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = "default",
  size = "medium",
  icon,
  count,
  animated = true,
  outline = false,
  rounded = false,
  style,
}) => {
  const scale = useSharedValue(1);
  const colors = variantColors[variant];
  const sizeStyle = sizeStyles[size];

  React.useEffect(() => {
    if (animated && count !== undefined) {
      scale.value = withSpring(1.2, { damping: 5 }, () => {
        scale.value = withSpring(1);
      });
    }
  }, [count, animated, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const badgeStyle: ViewStyle[] = [
    styles.badge,
    {
      backgroundColor: outline ? "transparent" : colors.backgroundColor,
      borderColor: colors.borderColor,
      borderWidth: outline ? 1 : 0,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      paddingVertical: sizeStyle.paddingVertical,
      height: sizeStyle.height,
      borderRadius: rounded ? sizeStyle.height / 2 : theme.borderRadius.sm,
    },
  ];

  if (style) {
    badgeStyle.push(style);
  }

  const textStyle: TextStyle = {
    color: outline ? colors.borderColor : colors.textColor,
    fontSize: sizeStyle.fontSize,
    fontWeight: "600",
  };

  const content = (
    <View style={styles.content}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={textStyle}>
        {count !== undefined ? `${label} (${count})` : label}
      </Text>
    </View>
  );

  if (animated) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[badgeStyle, animatedStyle]}
      >
        {content}
      </Animated.View>
    );
  }

  return <View style={badgeStyle}>{content}</View>;
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
});
