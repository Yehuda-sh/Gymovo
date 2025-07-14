// src/screens/plans/plans-screen/PlanCard.tsx
// כרטיס תוכנית מתקדם עם אנימציות וגרדיאנטים - גרסה משופרת

import React, { useRef, useEffect, memo, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../theme/colors";
import { Plan } from "../../../types/plan";
import { getDifficultyGradient, getAnimationDelay } from "./utils";
import Tag from "./Tag";

// הגדרת designSystem מקומית
const designSystem = {
  colors: {
    primary: {
      main: colors.primary,
      dark: colors.primaryDark,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      elevated: colors.surface,
    },
    neutral: {
      text: {
        primary: colors.text,
        secondary: colors.textSecondary,
        tertiary: colors.textMuted,
      },
      border: colors.border,
    },
    semantic: {
      error: colors.error,
    },
  },
  shadows: {
    lg: Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  animations: {
    easings: {
      spring: {
        tension: 40,
        friction: 7,
        useNativeDriver: true,
      },
      bounce: {
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      },
    },
  },
};

export interface PlanCardProps {
  plan: Plan & { isAiGenerated?: boolean };
  index: number;
  onPress: () => void;
  onShare: () => void;
  onDelete?: () => void;
  isUserPlan?: boolean;
}

// רכיב כרטיס תוכנית עם אנימציות מרשימות
const PlanCard: React.FC<PlanCardProps> = memo(
  ({ plan, index, onPress, onShare, onDelete, isUserPlan = false }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          delay: getAnimationDelay(index),
          ...designSystem.animations.easings.bounce,
        }),
      ]).start();
    }, [index, fadeAnim, slideAnim, scaleAnim]);

    // טיפול בלחיצה על הכרטיס
    const handlePress = useCallback(() => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }, [onPress]);

    // טיפול בשיתוף
    const handleShare = useCallback(() => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onShare();
    }, [onShare]);

    // טיפול במחיקה
    const handleDelete = useCallback(() => {
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onDelete?.();
    }, [onDelete]);

    // קבלת גרדיאנט רמת קושי - תיקון לתמיכה במערך של צבעים
    const difficultyGradient = useMemo(() => {
      const gradient = getDifficultyGradient(plan.difficulty || "beginner");
      return gradient.length >= 2 ? gradient : [gradient[0], gradient[0]];
    }, [plan.difficulty]);

    // חישוב סטטיסטיקות התוכנית עם fallbacks
    const stats = useMemo(() => {
      const totalExercises =
        plan.days?.reduce(
          (sum, day) => sum + (day.exercises?.length || 0),
          0
        ) || 0;
      const totalDuration =
        plan.days?.reduce(
          (sum, day) => sum + (day.estimatedDuration || 30),
          0
        ) || 0;
      const daysPerWeek = plan.days?.length || 0;
      const avgDuration =
        daysPerWeek > 0 ? Math.round(totalDuration / daysPerWeek) : 0;

      return { totalExercises, totalDuration, daysPerWeek, avgDuration };
    }, [plan.days]);

    const muscleGroups = plan.targetMuscleGroups || [];

    // מיפוי רמת קושי לטקסט בעברית
    const difficultyText = useMemo(
      () =>
        ({
          beginner: "מתחילים",
          intermediate: "מתקדמים",
          advanced: "מומחים",
        }[plan.difficulty || "beginner"]),
      [plan.difficulty]
    );

    // מיפוי אייקונים לתגים
    const getTagIcon = useCallback(
      (tag: string): keyof typeof Ionicons.glyphMap => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes("כוח")) return "fitness";
        if (lowerTag.includes("היפרטרופיה")) return "body";
        if (lowerTag.includes("חיטוב")) return "flash";
        if (lowerTag.includes("ביתי")) return "home";
        if (lowerTag.includes("מכון")) return "barbell";
        return "pricetag";
      },
      []
    );

    // צבעים דינמיים לפי תמה
    const dynamicColors = useMemo(
      () => ({
        cardBg: isDark ? colors.surface : "#FFFFFF",
        textPrimary: isDark ? colors.text : "#1F2937",
        textSecondary: isDark ? colors.textSecondary : "#64748B",
      }),
      [isDark]
    );

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            backgroundColor: dynamicColors.cardBg,
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
            colors={difficultyGradient as any}
            style={styles.cardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.planIconContainer}>
              <Ionicons name="fitness" size={32} color="#fff" />
            </View>

            {/* תגיות סטטוס */}
            <View style={styles.statusBadges}>
              {plan.isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>פעיל</Text>
                </View>
              )}
              {plan.isAiGenerated && (
                <View style={[styles.activeBadge, styles.aiBadge]}>
                  <MaterialIcons name="auto-awesome" size={12} color="#fff" />
                  <Text style={styles.activeBadgeText}>AI</Text>
                </View>
              )}
            </View>

            {/* רמת קושי */}
            <View style={styles.difficultyBadge}>
              <Text
                style={[
                  styles.difficultyText,
                  { color: dynamicColors.textPrimary },
                ]}
              >
                {difficultyText}
              </Text>
            </View>
          </LinearGradient>

          {/* תוכן הכרטיס */}
          <View style={styles.planContent}>
            {/* כותרת התוכנית */}
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text
                  style={[
                    styles.planName,
                    { color: dynamicColors.textPrimary },
                  ]}
                  numberOfLines={2}
                >
                  {plan.name}
                </Text>
                {plan.creator && (
                  <Text
                    style={[
                      styles.planCreator,
                      { color: dynamicColors.textSecondary },
                    ]}
                  >
                    נוצר ע&quot;י {plan.creator}
                  </Text>
                )}
              </View>
            </View>

            {/* תגים */}
            {plan.tags && plan.tags.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tagsContainer}
                contentContainerStyle={styles.tagsContentContainer}
              >
                {plan.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Tag
                    key={tagIndex}
                    text={tag}
                    icon={getTagIcon(tag)}
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
              <Text
                style={[
                  styles.planDescription,
                  { color: dynamicColors.textSecondary },
                ]}
                numberOfLines={2}
              >
                {plan.description}
              </Text>
            )}

            {/* סטטיסטיקות */}
            <View style={styles.planStats}>
              <View style={styles.statItem}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={dynamicColors.textSecondary}
                />
                <Text
                  style={[
                    styles.statText,
                    { color: dynamicColors.textSecondary },
                  ]}
                >
                  {stats.daysPerWeek} ימים בשבוע
                </Text>
              </View>

              {stats.avgDuration > 0 && (
                <View style={styles.statItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={dynamicColors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.statText,
                      { color: dynamicColors.textSecondary },
                    ]}
                  >
                    {stats.avgDuration} דק׳ לאימון
                  </Text>
                </View>
              )}

              <View style={styles.statItem}>
                <Ionicons
                  name="barbell-outline"
                  size={16}
                  color={dynamicColors.textSecondary}
                />
                <Text
                  style={[
                    styles.statText,
                    { color: dynamicColors.textSecondary },
                  ]}
                >
                  {stats.totalExercises} תרגילים
                </Text>
              </View>
            </View>

            {/* קבוצות שרירים */}
            {muscleGroups.length > 0 && (
              <View style={styles.muscleGroups}>
                <Text
                  style={[
                    styles.muscleGroupsTitle,
                    { color: dynamicColors.textSecondary },
                  ]}
                >
                  קבוצות שרירים:
                </Text>
                <Text
                  style={[
                    styles.muscleGroupsList,
                    { color: dynamicColors.textPrimary },
                  ]}
                  numberOfLines={1}
                >
                  {muscleGroups.join(", ")}
                </Text>
              </View>
            )}

            {/* פעולות */}
            <View style={styles.planActions}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handlePress}
              >
                <LinearGradient
                  colors={
                    [
                      designSystem.colors.primary.main,
                      designSystem.colors.primary.dark,
                    ] as any
                  }
                  style={styles.startButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.startButtonText}>
                    {plan.isActive ? "המשך תוכנית" : "התחל תוכנית"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              {/* פעולות מהירות */}
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleShare}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name="share-outline"
                    size={20}
                    color={dynamicColors.textSecondary}
                  />
                </TouchableOpacity>

                {/* הצג כפתור מחיקה רק עבור תוכניות משתמש */}
                {isUserPlan && onDelete && (
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={handleDelete}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="trash-outline"
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
  }
);

PlanCard.displayName = "PlanCard";

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20,
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
  statusBadges: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
  },
  activeBadge: {
    backgroundColor: designSystem.colors.secondary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  aiBadge: {
    backgroundColor: designSystem.colors.primary.dark,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  difficultyBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: "600",
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
    marginBottom: 4,
    textAlign: "right",
  },
  planCreator: {
    fontSize: 14,
    textAlign: "right",
  },
  tagsContainer: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  tagsContentContainer: {
    paddingHorizontal: 4,
  },
  planDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: "right",
  },
  planStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: designSystem.colors.neutral.border,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 13,
  },
  muscleGroups: {
    marginBottom: 16,
  },
  muscleGroupsTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "right",
  },
  muscleGroupsList: {
    fontSize: 14,
    textAlign: "right",
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: designSystem.colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
  },
});

export default PlanCard;
