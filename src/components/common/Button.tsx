// src/components/common/Button.tsx - כפתור מותאם עם אנימציות וגרדיאנט

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { colors } from "../../theme/colors";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger" | "success";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  gradient?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = false,
  iconName,
  iconPosition = "left",
  gradient = true,
  style,
  textStyle,
  ...props
}) => {
  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getButtonColors = (): [string, string] => {
    switch (variant) {
      case "primary":
        return [colors.primary, colors.secondary];
      case "secondary":
        return [colors.secondary, colors.primary];
      case "danger":
        return ["#FF4B4B", "#C62828"];
      case "success":
        return ["#4CAF50", "#2E7D32"];
      case "outline":
        return ["transparent", "transparent"];
      default:
        return [colors.primary, colors.secondary];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 18,
        };
      case "large":
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 18,
          iconSize: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const [startColor, endColor] = getButtonColors();
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  const buttonContent = (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isOutline ? colors.primary : "#fff"}
        />
      ) : (
        <>
          {iconName && iconPosition === "left" && (
            <Ionicons
              name={iconName}
              size={sizeStyles.iconSize}
              color={isOutline ? colors.primary : "#fff"}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeStyles.fontSize,
                color: isOutline ? colors.primary : "#fff",
              },
              isOutline && styles.outlineText,
              isDisabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconName && iconPosition === "right" && (
            <Ionicons
              name={iconName}
              size={sizeStyles.iconSize}
              color={isOutline ? colors.primary : "#fff"}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {gradient && !isOutline ? (
        <LinearGradient
          colors={isDisabled ? ["#ccc", "#999"] : [startColor, endColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
          ]}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.button,
            isOutline && styles.outlineButton,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
            isDisabled && styles.disabledButton,
          ]}
        >
          {buttonContent}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  gradient: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  outlineText: {
    color: colors.primary,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  disabledText: {
    color: "#999",
  },
});

export default Button;
