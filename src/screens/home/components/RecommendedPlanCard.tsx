// src/screens/home/components/RecommendedPlanCard.tsx
// כרטיס תוכנית מומלצת עם פרטים מלאים ומערכת עיצוב מאוחדת

import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Button } from "../../../components/common";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";
import { Plan } from "../../../types/plan";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;

interface RecommendedPlanCardProps {
  plan: Plan;
  onPress: () => void;
}

/**
 * Card component for recommended workout plan with detailed information
 */
const RecommendedPlanCard: React.FC<RecommendedPlanCardProps> = ({
  plan,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{plan.name}</Text>
          <Text style={styles.description}>{plan.description}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={24} color="#fff" />
              <Text style={styles.statText}>
                {plan.durationWeeks || 4} שבועות
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="barbell-outline" size={24} color="#fff" />
              <Text style={styles.statText}>
                {plan.days?.length || 3} ימים בשבוע
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={24} color="#fff" />
              <Text style={styles.statText}>{plan.difficulty || "בינוני"}</Text>
            </View>
          </View>

          <Button
            title="התחל עכשיו"
            onPress={onPress}
            variant="outline"
            fullWidth
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.heavy,
    color: colors.text,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
    opacity: 0.92,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  statText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
});

export default RecommendedPlanCard;
