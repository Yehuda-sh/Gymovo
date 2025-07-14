// src/screens/exercises/exercise-selection/components/ExerciseItem.tsx
// רכיב תרגיל בודד עם אנימציות, תגים ומידע מפורט

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, Text } from "react-native";
import { Exercise } from "../../../../types/exercise";
import { theme } from "../../../../theme";
import { colors } from "../../../../theme/colors";
import { styles } from "../styles/exerciseSelectionStyles";

interface ExerciseItemProps {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  isSelected,
  onToggle,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // אנימציית כניסה - fade in + slide מימין
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100, // השהייה פרוגרסיבית לכל כרטיס
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, fadeAnim, slideAnim]);

  const handlePress = () => {
    // משוב הפטי
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // אנימציית לחיצה
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case "beginner":
        return colors.success;
      case "intermediate":
        return colors.warning;
      case "advanced":
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const getDifficultyText = (difficulty?: string): string => {
    switch (difficulty) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return "";
    }
  };

  const exerciseDifficultyColor = getDifficultyColor(exercise.difficulty);
  const exerciseDifficultyText = getDifficultyText(exercise.difficulty);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.exerciseCard, isSelected && styles.selectedExerciseCard]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* Exercise Icon */}
        <View style={styles.exerciseIcon}>
          <Ionicons
            name="barbell-outline"
            size={24}
            color={isSelected ? colors.primary : colors.textSecondary}
          />
        </View>

        {/* Exercise Info */}
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>

          {exercise.description && (
            <Text style={styles.exerciseDescription} numberOfLines={2}>
              {exercise.description}
            </Text>
          )}

          <View style={styles.exerciseTags}>
            {/* Primary muscle tag */}
            {exercise.targetMuscleGroups?.[0] && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: exerciseDifficultyColor + "20" },
                ]}
              >
                <Text
                  style={[styles.tagText, { color: exerciseDifficultyColor }]}
                >
                  {exercise.targetMuscleGroups[0]}
                </Text>
              </View>
            )}

            {/* Equipment tag */}
            {exercise.equipment && exercise.equipment.length > 0 && (
              <View style={styles.tag}>
                <Ionicons
                  name="barbell"
                  size={12}
                  color={colors.textSecondary}
                />
                <Text style={styles.tagText}>{exercise.equipment[0]}</Text>
              </View>
            )}

            {/* Difficulty tag */}
            {exercise.difficulty && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: exerciseDifficultyColor + "10" },
                ]}
              >
                <Text
                  style={[styles.tagText, { color: exerciseDifficultyColor }]}
                >
                  {exerciseDifficultyText}
                </Text>
              </View>
            )}
          </View>

          {/* Secondary muscles */}
          {exercise.targetMuscleGroups &&
            exercise.targetMuscleGroups.length > 1 && (
              <View style={styles.secondaryMuscles}>
                <Text style={styles.secondaryLabel}>שרירים משניים:</Text>
                <Text style={styles.secondaryText}>
                  {exercise.targetMuscleGroups.slice(1).join(", ")}
                </Text>
              </View>
            )}
        </View>

        {/* Selection indicator with animation */}
        <View style={styles.selectionIndicator}>
          {isSelected ? (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0.98, 1],
                      outputRange: [1.2, 1],
                    }),
                  },
                ],
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={colors.primary}
              />
            </Animated.View>
          ) : (
            <View style={styles.unselectedCircle} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ExerciseItem;
