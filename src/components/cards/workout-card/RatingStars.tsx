// src/components/cards/workout-card/RatingStars.tsx
// רכיב כוכבי דירוג עם אנימציה וצבעים

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * ⭐ רכיב כוכבי דירוג אינטרקטיבי
 * מציג דירוג עם כוכבים מלאים וריקים + ציון מספרי
 */
interface RatingStarsProps {
  /** ציון הדירוג (1-5) */
  rating?: number;
  /** גודל הכוכבים */
  size?: number;
  /** צבע הכוכבים הפעילים */
  activeColor?: string;
  /** צבע הכוכבים הלא פעילים */
  inactiveColor?: string;
  /** האם להציג את הציון המספרי */
  showNumericRating?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 12,
  activeColor = "#ffab00",
  inactiveColor = "#444444",
  showNumericRating = true,
}) => {
  if (!rating) return null;

  return (
    <View style={styles.container}>
      {/* כוכבי הדירוג */}
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color={star <= rating ? activeColor : inactiveColor}
            style={styles.star}
          />
        ))}
      </View>

      {/* ציון מספרי */}
      {showNumericRating && (
        <Text style={[styles.ratingText, { color: "#cccccc" }]}>
          ({rating.toFixed(1)})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  star: {
    // ניתן להוסיף אנימציות עתידיות
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 4,
    fontWeight: "500",
  },
});
