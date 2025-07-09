// src/screens/exercises/details/components/ExerciseImage.tsx
// רכיב תמונת התרגיל

import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { colors } from "../../../../theme/colors";
import { ExerciseImageProps } from "../types";

const ExerciseImage: React.FC<ExerciseImageProps> = ({
  imageUrl,
  exerciseName,
}) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={`תמונה של תרגיל ${exerciseName}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
});

export default ExerciseImage;
