// src/screens/plans/create-edit/styles/planStyles.ts
// סטיילים למסך יצירה/עריכה של תוכנית אימון

import { StyleSheet } from "react-native";

import { colors } from "../../../../theme/colors";

export const planStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  headerButton: {
    padding: 5,
  },
  saveButton: {
    width: "auto",
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginVertical: 0,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    textAlign: "right",
    marginTop: 16,
  },
  dayCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayCardActive: {
    backgroundColor: colors.primaryLight,
    elevation: 4,
    shadowOpacity: 0.1,
  },
  dayDetailsContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    color: colors.text,
  },
  daySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },
  formContainer: {
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorInput: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: "right",
    marginTop: 4,
  },
});

export default planStyles;
