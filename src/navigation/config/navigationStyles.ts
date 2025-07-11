// src/navigation/config/navigationStyles.ts
// הגדרות עיצוב לניווט באפליקציה

import { colors } from "../../theme/colors";

/**
 * הגדרות בסיסיות למסכים
 */
export const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold" as const,
    fontSize: 18,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
};

/**
 * הגדרות לטאב בר
 */
export const tabBarOptions = {
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: "600" as const,
    marginTop: 4,
  },
  headerStyle: {
    backgroundColor: colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold" as const,
    fontSize: 20,
  },
};

/**
 * הגדרות למסכי Auth
 */
export const authStackOptions = {
  ...defaultScreenOptions,
  headerShown: false,
  gestureEnabled: true,
  animation: "slide_from_right" as const,
};

/**
 * הגדרות למסכי האפליקציה הראשיים
 */
export const appStackOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
  animation: "slide_from_right" as const,
};

/**
 * הגדרות למודלים
 */
export const modalOptions = {
  presentation: "modal" as const,
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold" as const,
    fontSize: 18,
  },
};

export default {
  defaultScreenOptions,
  tabBarOptions,
  authStackOptions,
  appStackOptions,
  modalOptions,
};
