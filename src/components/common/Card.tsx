// src/components/common/Card.tsx - כרטיס גמיש עם גרדיאנט ואנימציות

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
import { colors } from "../../theme/colors";

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
  gradientColors = ["#6200EA", "#7C4DFF"],
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
    switch (padding) {
      case "none":
        return 0;
      case "small":
        return 12;
      case "large":
        return 24;
      default:
        return 16;
    }
  };

  const getMargin = () => {
    switch (margin) {
      case "none":
        return 0;
      case "small":
        return 8;
      case "large":
        return 20;
      default:
        return 12;
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "gradient":
        return {};
      case "outline":
        return {
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: "transparent",
        };
      case "elevated":
        return {
          backgroundColor: colors.surface,
          ...styles.elevatedShadow,
        };
      default:
        return {
          backgroundColor: colors.surface,
        };
    }
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
            style={[styles.gradient, { borderRadius: 16 }]}
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
          style={[styles.gradient, { borderRadius: 16 }]}
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
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevatedShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default Card;
