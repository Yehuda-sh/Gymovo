// src/components/common/Button.tsx - כפתור מותאם עם מערכת עיצוב מאוחדת

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
import { unifiedDesignSystem } from "../../theme/unifiedDesignSystem";

const { colors, button, typography, shadows } = unifiedDesignSystem;

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

  const getButtonConfig = () => {
    const sizeConfig = button.sizes[size];
    const variantConfig = button.variants[variant];

    return {
      ...sizeConfig,
      ...variantConfig,
    };
  };

  const buttonConfig = getButtonConfig();
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
              size={buttonConfig.iconSize}
              color={buttonConfig.textColor}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                fontSize: buttonConfig.fontSize,
                color: buttonConfig.textColor,
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.fontWeight.semibold,
              },
              isDisabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconName && iconPosition === "right" && (
            <Ionicons
              name={iconName}
              size={buttonConfig.iconSize}
              color={buttonConfig.textColor}
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
        {
          borderRadius: buttonConfig.borderRadius,
        },
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {gradient && !isOutline ? (
        <LinearGradient
          colors={
            isDisabled ? ["#ccc", "#999"] : (buttonConfig as any).gradient
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: buttonConfig.paddingVertical,
              paddingHorizontal: buttonConfig.paddingHorizontal,
              borderRadius: buttonConfig.borderRadius,
              ...buttonConfig.shadow,
            },
          ]}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.button,
            {
              paddingVertical: buttonConfig.paddingVertical,
              paddingHorizontal: buttonConfig.paddingHorizontal,
              borderRadius: buttonConfig.borderRadius,
              backgroundColor:
                (buttonConfig as any).backgroundColor || "transparent",
              borderColor: (buttonConfig as any).borderColor || "transparent",
              borderWidth: (buttonConfig as any).borderWidth || 0,
              ...buttonConfig.shadow,
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
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  fullWidth: {
    alignSelf: "stretch",
    width: "100%",
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    letterSpacing: 0.5,
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
