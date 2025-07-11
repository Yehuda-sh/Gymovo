// src/screens/plans/plans-screen/PlanCard.tsx
// כרטיס תוכנית מתקדם עם אנימציות וגרדיאנטים

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { designSystem } from "../../../theme/designSystem";
import { Plan } from "../../../types/plan";
import { getDifficultyGradient, getAnimationDelay } from "./utils";
import Tag from "./Tag";

export interface PlanCardProps {
  plan: Plan;
  index: number;
  onPress: () => void;
  onShare: () => void;
  onDelete?: () => void;
}

// רכיב כרטיס תוכנית עם אנימציות מרשימות
const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  onPress,
  onShare,
  onDelete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: getAnimationDelay(index),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay: getAnimationDelay(index),
        ...designSystem.animations.easings.spring,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: getAnimationDelay(index),
        ...designSystem.animations.easings.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  // טיפול בלחיצה על הכרטיס
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  // קבלת גרדיאנט רמת קושי
  const difficultyGradient = getDifficultyGradient(plan.difficulty);

  // חישוב סטטיסטיקות התוכנית
  const totalExercises =
    plan.days?.reduce((sum, day) => sum + day.exercises.length, 0) || 0;

  const totalDuration =
    plan.days?.reduce((sum, day) => sum + (day.estimatedDuration || 30), 0) ||
    0;

  const muscleGroups = plan.targetMuscleGroups || [];

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        {/* כותרת עם גרדיאנט */}
        <LinearGradient
          colors={difficultyGradient}
          style={styles.cardHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.planIconContainer}>
            <Ionicons name="fitness" size={32} color="#fff" />
          </View>
          {plan.isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>פעיל</Text>
            </View>
          )}
        </LinearGradient>

        {/* תוכן הכרטיס */}
        <View style={styles.planContent}>
          {/* כותרת התוכנית */}
          <View style={styles.planHeader}>
            <View style={styles.planInfo}>
              <Text style={styles.planName} numberOfLines={2}>
                {plan.name}
              </Text>
              {plan.creator && (
                <Text style={styles.planCreator}>נוצר ע"י {plan.creator}</Text>
              )}
            </View>
          </View>

          {/* תגים */}
          {plan.tags && plan.tags.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tagsContainer}
            >
              {plan.tags.slice(0, 3).map((tag, tagIndex) => (
                <Tag
                  key={tagIndex}
                  text={tag}
                  color={designSystem.colors.primary.main}
                />
              ))}
              {plan.tags.length > 3 && (
                <Tag
                  text={`+${plan.tags.length - 3}`}
                  color={designSystem.colors.neutral.text.tertiary}
                />
              )}
            </ScrollView>
          )}

          {/* תיאור */}
          {plan.description && (
            <Text style={styles.planDescription} numberOfLines={3}>
              {plan.description}
            </Text>
          )}

          {/* סטטיסטיקות */}
          <View style={styles.planStats}>
            <View style={styles.statItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={designSystem.colors.neutral.text.secondary}
              />
              <Text style={styles.statText}>{totalDuration || "גמיש"} דק'</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="barbell-outline"
                size={16}
                color={designSystem.colors.neutral.text.secondary}
              />
              <Text style={styles.statText}>{totalExercises || 0} תרגילים</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={designSystem.colors.neutral.text.secondary}
              />
              <Text style={styles.statText}>{plan.days?.length || 0} ימים</Text>
            </View>
          </View>

          {/* פעולות */}
          <View style={styles.planActions}>
            <TouchableOpacity style={styles.startButton} onPress={handlePress}>
              <LinearGradient
                colors={difficultyGradient}
                style={styles.startButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="play" size={20} color="#fff" />
                <Text style={styles.startButtonText}>התחל</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onShare();
                }}
              >
                <Ionicons
                  name="share"
                  size={20}
                  color={designSystem.colors.neutral.text.secondary}
                />
              </TouchableOpacity>

              {onDelete && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onDelete();
                  }}
                >
                  <Ionicons
                    name="trash"
                    size={20}
                    color={designSystem.colors.semantic.error}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.elevated,
    ...designSystem.shadows.lg,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardHeader: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  planIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    padding: 16,
  },
  activeBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: designSystem.colors.secondary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  planContent: {
    padding: 20,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 4,
  },
  planCreator: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
  },
  tagsContainer: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  planDescription: {
    fontSize: 15,
    color: designSystem.colors.neutral.text.secondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: designSystem.colors.neutral.text.secondary,
  },
  planActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  startButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
  },
});

export default PlanCard;
