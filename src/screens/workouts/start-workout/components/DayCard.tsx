// src/screens/workouts/start-workout/components/DayCard.tsx
// כרטיס יום אימון עם אנימציות ועיצוב משופר

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../../../theme/colors";
import { PlanDay } from "../../../../types/plan";

interface DayCardProps {
  day: PlanDay;
  isSelected: boolean;
  onPress: () => void;
  index?: number;
}

const DayCard: React.FC<DayCardProps> = ({
  day,
  isSelected,
  onPress,
  index = 0,
}) => {
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const selectedAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 50,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Selection animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(selectedAnim, {
        toValue: isSelected ? 1 : 0,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  // Calculate stats
  const totalSets = day.exercises.reduce((acc, exercise) => {
    if (typeof exercise.sets === "number") {
      return acc + exercise.sets;
    } else if (Array.isArray(exercise.sets)) {
      return acc + (exercise.sets as any[]).length;
    }
    return acc;
  }, 0);

  const muscleGroups = [
    ...new Set(day.exercises.map((ex) => ex.muscleGroup || "כללי")),
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
            {
              scale: selectedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.05],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <LinearGradient
          colors={
            isSelected
              ? [colors.primary, colors.primaryDark]
              : ["#2a2a2a", "#1e1e1e"]
          }
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[colors.primary, "transparent"]}
              style={StyleSheet.absoluteFillObject}
              start={{ x: 0.5, y: 0.5 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            {/* Day name */}
            <Text
              style={[styles.dayName, isSelected && styles.selectedDayName]}
            >
              {day.name}
            </Text>

            {/* Exercise count */}
            <View style={styles.exerciseInfo}>
              <Ionicons
                name="fitness"
                size={14}
                color={isSelected ? "white" : "#999"}
              />
              <Text
                style={[
                  styles.exerciseCount,
                  isSelected && styles.selectedExerciseCount,
                ]}
              >
                {day.exercises.length} תרגילים
              </Text>
            </View>

            {/* Additional info */}
            <View style={styles.additionalInfo}>
              <View style={styles.infoItem}>
                <Ionicons
                  name="layers"
                  size={12}
                  color={isSelected ? "rgba(255,255,255,0.7)" : "#666"}
                />
                <Text
                  style={[
                    styles.infoText,
                    isSelected && styles.selectedInfoText,
                  ]}
                >
                  {totalSets} סטים
                </Text>
              </View>

              {muscleGroups.length > 0 && (
                <View style={styles.infoItem}>
                  <Ionicons
                    name="body"
                    size={12}
                    color={isSelected ? "rgba(255,255,255,0.7)" : "#666"}
                  />
                  <Text
                    style={[
                      styles.infoText,
                      isSelected && styles.selectedInfoText,
                    ]}
                    numberOfLines={1}
                  >
                    {muscleGroups[0]}
                  </Text>
                </View>
              )}
            </View>

            {/* Selection checkmark */}
            <Animated.View
              style={[
                styles.checkmark,
                {
                  opacity: selectedAnim,
                  transform: [
                    {
                      scale: selectedAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </Animated.View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    minWidth: 140,
    position: "relative",
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
  },
  content: {
    alignItems: "center",
  },
  dayName: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  selectedDayName: {
    color: "white",
  },
  exerciseInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  exerciseCount: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  selectedExerciseCount: {
    color: "white",
  },
  additionalInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  selectedInfoText: {
    color: "rgba(255,255,255,0.7)",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

export default DayCard;
