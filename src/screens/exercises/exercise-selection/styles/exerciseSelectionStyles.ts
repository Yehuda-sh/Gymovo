// src/screens/exercises/exercise-selection/styles/exerciseSelectionStyles.ts
// סגנונות למסך בחירת תרגילים

import { StyleSheet, Dimensions } from "react-native";
import { designSystem } from "../../../../theme/designSystem";
import { withOpacity } from "../utils/constants";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: designSystem.colors.neutral.text.primary,
    marginTop: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: designSystem.colors.semantic.error,
    marginTop: 16,
    fontWeight: "600",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: designSystem.colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
    ...designSystem.shadows.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    textAlign: "center",
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: designSystem.borderRadius.button,
    backgroundColor: withOpacity(designSystem.colors.semantic.error, 0.1),
  },
  clearButtonText: {
    fontSize: 14,
    color: designSystem.colors.semantic.error,
    fontWeight: "600",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: designSystem.colors.background.card,
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...designSystem.shadows.sm,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: designSystem.colors.neutral.text.primary,
    textAlign: "right",
    paddingVertical: 0,
  },
  searchClearButton: {
    marginRight: 8,
    padding: 4,
  },

  // Category Filter
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: designSystem.colors.background.card,
    borderWidth: 1,
    borderColor: designSystem.colors.neutral.border,
    gap: 8,
    marginRight: 12,
  },
  activeCategoryButton: {
    borderColor: "transparent",
    backgroundColor: "transparent",
    ...designSystem.shadows.md,
  },
  categoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    fontWeight: "600",
  },
  activeCategoryText: {
    color: "#fff",
  },

  // Selected Counter
  selectedCounter: {
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  selectedCounterText: {
    fontSize: 14,
    color: designSystem.colors.primary.main,
    fontWeight: "600",
  },

  // Exercises List
  exercisesList: {
    flex: 1,
  },
  exercisesContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Exercise Card
  exerciseCard: {
    flexDirection: "row",
    backgroundColor: designSystem.colors.background.card,
    borderRadius: designSystem.borderRadius.card,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    ...designSystem.shadows.sm,
  },
  selectedExerciseCard: {
    borderColor: designSystem.colors.primary.main,
    backgroundColor: withOpacity(designSystem.colors.primary.main, 0.05),
    ...designSystem.shadows.md,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: designSystem.colors.background.elevated,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginBottom: 4,
    textAlign: "right",
  },
  exerciseDescription: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    lineHeight: 18,
    marginBottom: 8,
    textAlign: "right",
  },
  exerciseTags: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: designSystem.colors.background.secondary,
    borderRadius: designSystem.borderRadius.sm,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: designSystem.colors.neutral.text.secondary,
    fontWeight: "500",
  },
  secondaryMuscles: {
    marginTop: 4,
  },
  secondaryLabel: {
    fontSize: 11,
    color: designSystem.colors.neutral.text.tertiary,
    marginBottom: 2,
  },
  secondaryText: {
    fontSize: 12,
    color: designSystem.colors.neutral.text.secondary,
  },

  // Selection
  selectionIndicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  unselectedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: designSystem.colors.neutral.border,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: designSystem.colors.neutral.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: designSystem.colors.neutral.text.secondary,
    textAlign: "center",
  },

  // Bottom Section
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    pointerEvents: "none",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
  },
  startButton: {
    borderRadius: designSystem.borderRadius.button,
    overflow: "hidden",
    ...designSystem.shadows.lg,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
