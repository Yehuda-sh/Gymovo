// src/ceenrss / workouts / start - workout / components / PlanCard.tsx;

import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../theme/colors";
import { Plan } from "../../../../types/plan";
import * as Haptics from "expo-haptics";

interface PlanCardProps {
  plan: Plan;
  onPress: () => void;
  isSelected: boolean;
  index: number;
}

// Fixed with displayName
const PlanCard = React.memo<PlanCardProps>(
  ({ plan, onPress, isSelected, index }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    };

    const getIcon = () => {
      // Use category or tags to determine icon
      const category = plan.category;
      const tags = plan.tags || [];

      // Check category first
      if (category) {
        switch (category.toLowerCase()) {
          case "powerlifting":
          case "strength":
            return "barbell";
          case "cardio":
          case "running":
            return "bicycle";
          case "flexibility":
          case "yoga":
          case "stretching":
            return "body";
          case "bodybuilding":
          case "hypertrophy":
            return "fitness";
          case "crossfit":
          case "functional":
            return "fitness";
          default:
            break;
        }
      }

      // Check tags for hints
      if (
        tags.some((tag) =>
          ["strength", "powerlifting", "כוח"].includes(tag.toLowerCase())
        )
      ) {
        return "barbell";
      }
      if (
        tags.some((tag) =>
          ["cardio", "running", "aerobic", "ריצה"].includes(tag.toLowerCase())
        )
      ) {
        return "bicycle";
      }
      if (
        tags.some((tag) =>
          ["flexibility", "yoga", "stretching", "יוגה"].includes(
            tag.toLowerCase()
          )
        )
      ) {
        return "body";
      }

      // Default icon
      return "fitness";
    };

    // Get difficulty level from plan
    const getDifficultyText = () => {
      if (plan.difficulty) {
        const difficultyMap: Record<string, string> = {
          beginner: "מתחיל",
          intermediate: "בינוני",
          advanced: "מתקדם",
        };
        return difficultyMap[plan.difficulty] || plan.difficulty;
      }
      return "כללי";
    };

    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ scale: scaleAnim }] },
          isSelected && styles.selectedContainer,
        ]}
      >
        <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
          <LinearGradient
            colors={
              isSelected
                ? [colors.primary, colors.secondary]
                : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
              <View
                style={[
                  styles.iconContainer,
                  isSelected && styles.selectedIcon,
                ]}
              >
                <Ionicons
                  name={getIcon() as any}
                  size={28}
                  color={isSelected ? "white" : colors.primary}
                />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[styles.title, isSelected && styles.selectedTitle]}
                >
                  {plan.name}
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    isSelected && styles.selectedSubtitle,
                  ]}
                >
                  {plan.days?.length || 0} ימי אימון • {getDifficultyText()}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={isSelected ? "white" : "rgba(255,255,255,0.3)"}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.plan.id === nextProps.plan.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

// Add display name for debugging
PlanCard.displayName = "PlanCard";

export { PlanCard };

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  selectedContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  selectedIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  selectedTitle: {
    color: "white",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  selectedSubtitle: {
    color: "rgba(255,255,255,0.9)",
  },
});
