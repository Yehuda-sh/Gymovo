// src/screens/workouts/start-workout/components/PlanCard.tsx
// כרטיס תוכנית אימון עם אנימציות מתקדמות ועיצוב משופר

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
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";

import { colors, withOpacity } from "../../../../theme/colors";
import { Plan } from "../../../../types/plan";

interface PlanCardProps {
  plan: Plan;
  onPress: () => void;
  isSelected?: boolean;
  index?: number;
}

// Helper function for difficulty color
const getDifficultyColor = (difficulty?: string) => {
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

// Helper function for difficulty text
const getDifficultyText = (difficulty?: string) => {
  switch (difficulty) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "מתקדם";
    case "advanced":
      return "מומחה";
    default:
      return difficulty || "כללי";
  }
};

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onPress,
  isSelected = false,
  index = 0,
}) => {
  // Animations
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: index * 100,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Selection animation
  useEffect(() => {
    if (isSelected) {
      Animated.parallel([
        Animated.spring(glowAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
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
  const totalExercises =
    plan.days?.reduce((acc, day) => acc + (day.exercises?.length || 0), 0) || 0;

  const estimatedDuration = plan.days?.length
    ? Math.round(totalExercises * 3) // ~3 min per exercise
    : 45;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
            {
              rotateY: rotateAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "2deg"],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <View style={styles.cardWrapper}>
          {/* Background gradient */}
          <LinearGradient
            colors={
              isSelected
                ? [colors.primary, colors.primaryDark]
                : ["#1e1e1e", "#2a2a2a"]
            }
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Glow effect */}
            {isSelected && (
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    opacity: glowAnim,
                    transform: [
                      {
                        scale: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1.2],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    withOpacity(colors.primary, 0.4),
                    withOpacity(colors.primary, 0.1),
                    "transparent",
                  ]}
                  style={StyleSheet.absoluteFillObject}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1, y: 1 }}
                />
              </Animated.View>
            )}

            {/* Content */}
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={styles.title} numberOfLines={1}>
                    {plan.name}
                  </Text>
                  {plan.description && (
                    <Text style={styles.description} numberOfLines={2}>
                      {plan.description}
                    </Text>
                  )}
                </View>

                {/* Difficulty Badge */}
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor: withOpacity(
                        getDifficultyColor(plan.difficulty),
                        0.15
                      ),
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.difficultyDot,
                      { backgroundColor: getDifficultyColor(plan.difficulty) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(plan.difficulty) },
                    ]}
                  >
                    {getDifficultyText(plan.difficulty)}
                  </Text>
                </View>
              </View>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="calendar" size={16} color="#666" />
                  </View>
                  <Text style={styles.statValue}>
                    {plan.durationWeeks || plan.days?.length || 4}
                  </Text>
                  <Text style={styles.statLabel}>שבועות</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="barbell" size={16} color="#666" />
                  </View>
                  <Text style={styles.statValue}>{plan.days?.length || 0}</Text>
                  <Text style={styles.statLabel}>ימי אימון</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="time" size={16} color="#666" />
                  </View>
                  <Text style={styles.statValue}>{estimatedDuration}</Text>
                  <Text style={styles.statLabel}>דקות</Text>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons name="fitness" size={16} color="#666" />
                  </View>
                  <Text style={styles.statValue}>{totalExercises}</Text>
                  <Text style={styles.statLabel}>תרגילים</Text>
                </View>
              </View>

              {/* Tags */}
              {plan.tags && plan.tags.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.tagsContainer}
                  contentContainerStyle={styles.tagsContent}
                >
                  {plan.tags.map((tag: string, idx: number) => (
                    <View key={idx} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}

              {/* Selection Indicator */}
              <Animated.View
                style={[
                  styles.selectionIndicator,
                  {
                    opacity: glowAnim,
                    transform: [
                      {
                        scale: glowAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </Animated.View>

              {/* Premium Badge (if applicable) */}
              {plan.isPremium && (
                <View style={styles.premiumBadge}>
                  <BlurView intensity={80} style={styles.premiumBlur}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.premiumText}>Premium</Text>
                  </BlurView>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    borderRadius: 20,
    overflow: "hidden",
  },
  glowEffect: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
  },
  tagsContainer: {
    marginTop: 8,
    marginHorizontal: -4,
  },
  tagsContent: {
    paddingHorizontal: 4,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  selectionIndicator: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  premiumBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  premiumBlur: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFD700",
  },
});

export default PlanCard;
