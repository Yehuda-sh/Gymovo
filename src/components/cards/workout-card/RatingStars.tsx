// src/components/cards/workout-card/RatingStars.tsx
// רכיב כוכבי דירוג עם אנימציה, כוכבים חלקיים וצבעים דינמיים

import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, ViewStyle } from "react-native";
import { SIZE_CONFIG } from "./config";

/**
 * ⭐ רכיב כוכבי דירוג אינטרקטיבי
 * מציג דירוג עם כוכבים מלאים, חצאיים וריקים + ציון מספרי
 */
interface RatingStarsProps {
  /** ציון הדירוג (0-5, תומך בערכים עשרוניים) */
  rating?: number;
  /** מספר כוכבים מקסימלי */
  maxStars?: number;
  /** גודל התצוגה */
  size?: "small" | "medium" | "large" | number;
  /** צבע הכוכבים הפעילים */
  activeColor?: string;
  /** צבע הכוכבים הלא פעילים */
  inactiveColor?: string;
  /** האם להציג את הציון המספרי */
  showNumericRating?: boolean;
  /** האם להציג אנימציה */
  animated?: boolean;
  /** פורמט התצוגה */
  displayFormat?: "horizontal" | "vertical" | "compact";
  /** סגנון מותאם אישית */
  style?: ViewStyle;
}

export const RatingStars = React.memo<RatingStarsProps>(
  ({
    rating,
    maxStars = 5,
    size = "medium",
    activeColor = "#FFD700",
    inactiveColor = "#444444",
    showNumericRating = true,
    animated = true,
    displayFormat = "horizontal",
    style,
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnims = useRef(
      Array.from({ length: maxStars }, () => new Animated.Value(0.8))
    ).current;

    useEffect(() => {
      if (!animated || !rating) return;

      // אנימציית כניסה
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // אנימציית כוכבים
      scaleAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          delay: index * 50,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      });
    }, [rating, animated]);

    if (!rating) return null;

    // חישוב גודל הכוכבים
    const getStarSize = (): number => {
      if (typeof size === "number") return size;
      const sizeMap = {
        small: SIZE_CONFIG.small.iconSize,
        medium: SIZE_CONFIG.medium.iconSize,
        large: SIZE_CONFIG.large.iconSize,
      };
      return sizeMap[size];
    };

    // חישוב גודל הטקסט
    const getTextSize = (): number => {
      if (typeof size === "number") return size * 0.8;
      const sizeMap = {
        small: SIZE_CONFIG.small.fontSize,
        medium: SIZE_CONFIG.medium.fontSize,
        large: SIZE_CONFIG.large.fontSize,
      };
      return sizeMap[size];
    };

    const starSize = getStarSize();
    const textSize = getTextSize();

    // רכיב כוכב בודד
    const renderStar = (index: number) => {
      const starNumber = index + 1;
      const filled = rating >= starNumber;
      const halfFilled = rating > index && rating < starNumber;

      let iconName: keyof typeof Ionicons.glyphMap = "star-outline";
      let color = inactiveColor;

      if (filled) {
        iconName = "star";
        color = activeColor;
      } else if (halfFilled) {
        iconName = "star-half";
        color = activeColor;
      }

      const StarWrapper = animated ? Animated.View : View;
      const animatedStyle = animated
        ? {
            transform: [{ scale: scaleAnims[index] }],
          }
        : {};

      return (
        <StarWrapper key={index} style={animatedStyle}>
          <Ionicons
            name={iconName}
            size={starSize}
            color={color}
            style={styles.star}
          />
        </StarWrapper>
      );
    };

    // סגנון הקונטיינר לפי פורמט
    const getContainerStyle = () => {
      switch (displayFormat) {
        case "vertical":
          return styles.verticalContainer;
        case "compact":
          return styles.compactContainer;
        default:
          return styles.horizontalContainer;
      }
    };

    const containerStyle = getContainerStyle();
    const AnimatedContainer = animated ? Animated.View : View;

    return (
      <AnimatedContainer
        style={[
          styles.container,
          containerStyle,
          animated && { opacity: fadeAnim },
          style,
        ]}
        accessible={true}
        accessibilityLabel={`דירוג: ${rating} מתוך ${maxStars} כוכבים`}
        accessibilityRole="text"
      >
        {/* כוכבי הדירוג */}
        <View
          style={[
            styles.starsContainer,
            displayFormat === "vertical" && styles.verticalStars,
          ]}
        >
          {Array.from({ length: maxStars }, (_, i) => renderStar(i))}
        </View>

        {/* ציון מספרי */}
        {showNumericRating && (
          <Text
            style={[
              styles.ratingText,
              {
                color: activeColor,
                fontSize: textSize,
              },
              displayFormat === "vertical" && styles.verticalText,
              displayFormat === "compact" && styles.compactText,
            ]}
          >
            {displayFormat === "compact"
              ? rating.toFixed(1)
              : `${rating.toFixed(1)}/${maxStars}`}
          </Text>
        )}
      </AnimatedContainer>
    );
  }
);

// הוספת displayName לצורכי דיבוג
RatingStars.displayName = "RatingStars";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  horizontalContainer: {
    flexDirection: "row",
  },
  verticalContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  verticalStars: {
    marginBottom: 4,
  },
  star: {
    marginHorizontal: 1,
  },
  ratingText: {
    fontWeight: "600",
    marginLeft: 6,
  },
  verticalText: {
    marginLeft: 0,
    marginTop: 4,
  },
  compactText: {
    marginLeft: 4,
    fontWeight: "500",
  },
});
