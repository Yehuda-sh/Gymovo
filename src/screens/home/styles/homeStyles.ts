// src/screens/home/styles/homeStyles.ts
// סטיילים למסך הבית עם מערכת עיצוב מאוחדת

import { StyleSheet } from "react-native";
import { unifiedDesignSystem } from "../../../theme/unifiedDesignSystem";

const { colors, spacing, typography, borderRadius, shadows } =
  unifiedDesignSystem;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  statsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickActionsContainer: {
    marginBottom: spacing.xl,
  },
  quickActionsScroll: {
    paddingRight: spacing.md,
    gap: spacing.md,
  },
  recommendedPlanContainer: {
    marginBottom: spacing.xl,
  },
  workoutsContainer: {
    marginBottom: spacing.xl,
  },
  workoutCard: {
    marginBottom: spacing.sm,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  workoutDetails: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "center",
  },
  workoutDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  tabBarSpacing: {
    height: 100,
  },
});

export default homeStyles;
