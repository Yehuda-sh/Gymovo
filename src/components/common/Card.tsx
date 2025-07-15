// src/components/common/Card.tsx - כרטיס גמיש עם מערכת עיצוב מאוחדת

import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { unifiedDesignSystem } from "../../theme/unifiedDesignSystem";

const { colors, card, spacing, borderRadius, shadows } = unifiedDesignSystem;

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: "default" | "gradient" | "outline" | "elevated";
  padding?: "none" | "small" | "medium" | "large";
  margin?: "none" | "small" | "medium" | "large";
  gradient?: boolean;
  gradientColors?: string[];
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = "medium",
  margin = "none",
  gradient = false,
  gradientColors = [colors.primary, colors.secondary],
  style,
  onPress,
  shadow = true,
  ...props
}) => {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getPadding = () => {
    return card.padding[padding];
  };

  const getMargin = () => {
    return card.margin[margin];
  };

  const getVariantStyles = (): ViewStyle => {
    const variantConfig = card.variants[variant];
    return {
      backgroundColor: variantConfig.backgroundColor,
      borderColor: (variantConfig as any).borderColor || "transparent",
      borderWidth: (variantConfig as any).borderWidth || 0,
      ...variantConfig.shadow,
    };
  };

  const cardContent = (
    <View
      style={[
        {
          padding: getPadding(),
        },
      ]}
    >
      {children}
    </View>
  );

  const cardStyles = [
    styles.card,
    {
      borderRadius: borderRadius.lg,
    },
    getVariantStyles(),
    shadow && variant !== "outline" && styles.shadow,
    { margin: getMargin() },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={cardStyles}
        {...props}
      >
        {(gradient || variant === "gradient") && gradientColors.length >= 2 ? (
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, { borderRadius: borderRadius.lg }]}
          >
            {cardContent}
          </LinearGradient>
        ) : (
          cardContent
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles}>
      {(gradient || variant === "gradient") && gradientColors.length >= 2 ? (
        <LinearGradient
          colors={gradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: borderRadius.lg }]}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        cardContent
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  shadow: {
    ...shadows.sm,
  },
});

export default Card;
