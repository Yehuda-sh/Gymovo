// src/components/common/Button.tsx - גרסה מתקדמת עם micro-interactions

import React, { useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  ViewStyle,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

// Force RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// צבעים מתקדמים מ-WelcomeScreen
const buttonColors = {
  // Primary - כתום חם ראשי
  primary: "#FF6B35",
  primaryGlow: "rgba(255, 107, 53, 0.3)",
  primaryShadow: "rgba(255, 107, 53, 0.4)",

  // Secondary - כתום זהוב
  secondary: "#F7931E",
  secondaryGlow: "rgba(247, 147, 30, 0.3)",

  // Accent - צהוב זהב
  accent: "#FFD23F",
  accentGlow: "rgba(255, 210, 63, 0.3)",

  // Outline
  outline: "rgba(255, 255, 255, 0.3)",
  outlineText: "rgba(255, 255, 255, 0.9)",

  // Dark/Surface
  dark: "#2C1810",
  surface: "rgba(0, 0, 0, 0.8)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.9)",
  textMuted: "rgba(255, 255, 255, 0.7)",

  // States
  disabled: "rgba(255, 255, 255, 0.3)",
  success: "#00ff88",
  danger: "#ff3366",
};

// Types
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "accent"
  | "ghost"
  | "danger"
  | "success";

export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  hapticFeedback?: "light" | "medium" | "heavy" | "none";
  glowEffect?: boolean;
  pulseAnimation?: boolean;
}

/**
 * רכיב Button מתקדם עם micro-interactions, אנימציות ו-haptic feedback
 * מבוסס על העיצוב של WelcomeScreen עם שיפורים נוספים
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  style,
  textStyle,
  fullWidth = true,
  hapticFeedback = "medium",
  glowEffect = true,
  pulseAnimation = false,
}) => {
  // אנימציות
  const buttonScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.7)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  // Pulse animation effect
  useEffect(() => {
    if (pulseAnimation && !disabled && !loading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [pulseAnimation, disabled, loading]);

  // Glow animation effect
  useEffect(() => {
    if (glowEffect && variant === "primary" && !disabled) {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.7,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [glowEffect, variant, disabled]);

  // Press animations
  const handlePressIn = () => {
    if (disabled || loading) return;

    // Haptic feedback
    if (hapticFeedback !== "none") {
      const feedbackType = {
        light: Haptics.ImpactFeedbackStyle.Light,
        medium: Haptics.ImpactFeedbackStyle.Medium,
        heavy: Haptics.ImpactFeedbackStyle.Heavy,
      }[hapticFeedback];

      Haptics.impactAsync(feedbackType);
    }

    // Scale down animation
    const scaleValue = variant === "primary" ? 0.95 : 0.97;
    Animated.spring(buttonScale, {
      toValue: scaleValue,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;

    // Scale back up
    Animated.spring(buttonScale, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    // Trigger onPress with slight delay for better UX
    setTimeout(() => {
      onPress();
    }, 100);
  };

  // Dynamic styles based on variant
  const getButtonStyles = (): ViewStyle => {
    const baseStyle = styles.button;
    const sizeStyle = styles[size];

    let variantStyle: ViewStyle = {};

    switch (variant) {
      case "primary":
        variantStyle = {
          backgroundColor: buttonColors.primary,
          borderWidth: 0,
          shadowColor: buttonColors.primaryShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 8,
        };
        break;

      case "secondary":
        variantStyle = {
          backgroundColor: buttonColors.secondary,
          borderWidth: 0,
          shadowColor: buttonColors.secondaryGlow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 6,
        };
        break;

      case "accent":
        variantStyle = {
          backgroundColor: buttonColors.accent,
          borderWidth: 0,
          shadowColor: buttonColors.accentGlow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
          elevation: 6,
        };
        break;

      case "outline":
        variantStyle = {
          backgroundColor: "transparent",
          borderColor: buttonColors.outline,
          borderWidth: 2,
          shadowColor: "transparent",
        };
        break;

      case "ghost":
        variantStyle = {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: 0,
          shadowColor: "transparent",
        };
        break;

      case "danger":
        variantStyle = {
          backgroundColor: buttonColors.danger,
          borderWidth: 0,
          shadowColor: buttonColors.danger,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6,
        };
        break;

      case "success":
        variantStyle = {
          backgroundColor: buttonColors.success,
          borderWidth: 0,
          shadowColor: buttonColors.success,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 6,
        };
        break;
    }

    if (disabled) {
      variantStyle = {
        ...variantStyle,
        backgroundColor: buttonColors.disabled,
        shadowColor: "transparent",
        opacity: 0.6,
      };
    }

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      width: fullWidth ? "100%" : "auto",
    };
  };

  // Dynamic text styles
  const getTextStyles = (): TextStyle => {
    let color = buttonColors.textPrimary;

    if (variant === "outline" || variant === "ghost") {
      color = buttonColors.outlineText;
    } else if (variant === "accent") {
      color = buttonColors.dark;
    }

    if (disabled) {
      color = buttonColors.textMuted;
    }

    return {
      ...styles.text,
      ...styles[`${size}Text` as keyof typeof styles],
      color,
      ...textStyle,
    };
  };

  // Icon component
  const renderIcon = () => {
    if (!icon || loading) return null;

    return (
      <Ionicons
        name={icon}
        size={size === "small" ? 16 : size === "large" ? 24 : 20}
        color={getTextStyles().color}
        style={iconPosition === "right" ? styles.iconRight : styles.iconLeft}
      />
    );
  };

  // Loading indicator
  const renderLoading = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        size={size === "small" ? "small" : "large"}
        color={getTextStyles().color}
        style={styles.loading}
      />
    );
  };

  // Glow effect overlay
  const renderGlow = () => {
    if (!glowEffect || variant !== "primary" || disabled) return null;

    return (
      <Animated.View
        style={[
          styles.glowOverlay,
          {
            opacity: glowOpacity,
            backgroundColor: buttonColors.primaryGlow,
          },
        ]}
      />
    );
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: buttonScale }, { scale: pulseScale }] },
        style,
      ]}
    >
      <TouchableOpacity
        style={getButtonStyles()}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1} // נשלוט באנימציה בעצמנו
      >
        {renderGlow()}

        {/* Content container */}
        <Animated.View style={styles.content}>
          {iconPosition === "left" && renderIcon()}
          {renderLoading()}

          {!loading && <Text style={getTextStyles()}>{title}</Text>}

          {iconPosition === "right" && renderIcon()}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  // Size variants
  small: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  medium: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  large: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
  },

  // Content layout
  content: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  // Text styles
  text: {
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Icon styles
  iconLeft: {
    marginLeft: 4,
  },
  iconRight: {
    marginRight: 4,
  },

  // Loading
  loading: {
    marginHorizontal: 8,
  },

  // Glow effect
  glowOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
});

export default Button;
