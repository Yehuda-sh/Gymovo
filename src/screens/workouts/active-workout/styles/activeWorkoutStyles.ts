// src/screens/workouts/active-workout/styles/activeWorkoutStyles.ts

import { StyleSheet } from "react-native";
import { workoutColors } from "../types";

export const activeWorkoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: workoutColors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: workoutColors.background,
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    color: workoutColors.subtext,
    textAlign: "center",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 48,
    backgroundColor: workoutColors.surface,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border,
  },
  headerCenter: {
    alignItems: "center",
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  timerText: {
    fontSize: 14,
    color: workoutColors.subtext,
  },

  // Content
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Navigation
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: workoutColors.surface,
    borderTopWidth: 1,
    borderTopColor: workoutColors.border,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  exerciseCounterContainer: {
    alignItems: "center",
    gap: 4,
  },
  exerciseCounter: {
    fontSize: 14,
    fontWeight: "bold",
    color: workoutColors.text,
    textAlign: "center",
  },
});
