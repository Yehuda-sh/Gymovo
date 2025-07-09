// src/screens/home/styles/homeStyles.ts
// סטיילים למסך הבית

import { StyleSheet } from "react-native";

import { theme } from "../../../theme";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  statsContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  quickActionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  quickActionsScroll: {
    paddingRight: theme.spacing.md,
    gap: theme.spacing.md,
  },
  recommendedPlanContainer: {
    marginBottom: theme.spacing.xl,
  },
  workoutsContainer: {
    marginBottom: theme.spacing.xl,
  },
  workoutCard: {
    marginBottom: theme.spacing.sm,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  workoutDetails: {
    flexDirection: "row",
    gap: theme.spacing.md,
    justifyContent: "center",
  },
  workoutDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  tabBarSpacing: {
    height: 100,
  },
});

export default homeStyles;
