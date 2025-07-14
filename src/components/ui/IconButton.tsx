// src/components/ui/IconButton.tsx
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "../../theme";

type IconButtonVariant = "ghost" | "filled" | "outline";
type IconButtonSize = "small" | "medium" | "large";

export interface IconButtonProps
  extends Omit<TouchableOpacityProps, "onPress"> {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  color?: string;
  backgroundColor?: string;
  loading?: boolean;
  badge?: number;
  onPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const sizeConfig = {
  small: {
    buttonSize: 32,
    iconSize: 16,
    badgeSize: 16,
    badgeFontSize: 10,
  },
  medium: {
    buttonSize: 40,
    iconSize: 20,
    badgeSize: 20,
    badgeFontSize: 11,
  },
  large: {
    buttonSize: 48,
    iconSize: 24,
    badgeSize: 24,
    badgeFontSize: 12,
  },
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = "ghost",
  size = "medium",
  color = theme.colors.primary,
  backgroundColor,
  loading = false,
  badge,
  onPress,
  disabled,
  ...props
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const config = sizeConfig[size];

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });

    if (onPress && !disabled && !loading) {
      rotate.value = withTiming(360, { duration: 400 }, () => {
        rotate.value = 0;
      });
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onPress)();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const getBackgroundColor = () => {
    if (disabled) return theme.colors.surface;
    if (backgroundColor) return backgroundColor;

    switch (variant) {
      case "filled":
        return color;
      case "outline":
        return "transparent";
      case "ghost":
      default:
        return "transparent";
    }
  };

  const getIconColor = () => {
    if (disabled) return theme.colors.textSecondary;
    if (variant === "filled") return "#FFFFFF";
    return color;
  };

  const getBorderWidth = () => {
    return variant === "outline" ? 1.5 : 0;
  };

  return (
    <AnimatedTouchable
      {...props}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.button,
        {
          width: config.buttonSize,
          height: config.buttonSize,
          borderRadius: config.buttonSize / 2,
          backgroundColor: getBackgroundColor(),
          borderWidth: getBorderWidth(),
          borderColor: disabled ? theme.colors.border : color,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getIconColor()} />
      ) : (
        <Ionicons name={icon} size={config.iconSize} color={getIconColor()} />
      )}

      {badge !== undefined && badge > 0 && !loading && (
        <View
          style={[
            styles.badge,
            {
              width: config.badgeSize,
              height: config.badgeSize,
              borderRadius: config.badgeSize / 2,
              top: -config.badgeSize / 4,
              right: -config.badgeSize / 4,
            },
          ]}
        >
          <Animated.Text
            style={[styles.badgeText, { fontSize: config.badgeFontSize }]}
          >
            {badge > 99 ? "99+" : badge}
          </Animated.Text>
        </View>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    backgroundColor: theme.colors.error,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
