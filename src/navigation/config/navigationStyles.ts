// src/navigation/config/navigationStyles.ts
// הגדרות עיצוב לניווט באפליקציה עם תמיכה מלאה ב-TypeScript

import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { colors } from "../../theme/colors";
import { Platform } from "react-native";

// קבועים לגדלים וערכים
const CONSTANTS = {
  headerFontSize: 18,
  headerFontSizeLarge: 20,
  tabBarHeight: Platform.OS === "ios" ? 85 : 60,
  tabBarPadding: 8,
  tabBarFontSize: 12,
  tabBarIconSize: 24,
  borderWidth: 1,
  shadowRadius: 8,
  shadowOpacity: 0.1,
  elevation: 8,
} as const;

// טיפוסים מותאמים אישית
type NavigationTheme = "light" | "dark";

interface NavigationStyles {
  defaultScreenOptions: NativeStackNavigationOptions;
  tabBarOptions: BottomTabNavigationOptions;
  authStackOptions: NativeStackNavigationOptions;
  appStackOptions: NativeStackNavigationOptions;
  modalOptions: NativeStackNavigationOptions;
}

/**
 * הגדרות בסיסיות למסכים
 */
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: CONSTANTS.headerFontSize,
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: colors.background,
  },
  // אנימציות לפי פלטפורמה
  animation: Platform.OS === "ios" ? "default" : "slide_from_right",
};

/**
 * הגדרות לטאב בר
 */
export const tabBarOptions: BottomTabNavigationOptions = {
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary,
  tabBarStyle: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: CONSTANTS.borderWidth,
    paddingTop: CONSTANTS.tabBarPadding,
    paddingBottom: CONSTANTS.tabBarPadding,
    height: CONSTANTS.tabBarHeight,
    // צללים לפי פלטפורמה
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: CONSTANTS.shadowOpacity,
        shadowRadius: CONSTANTS.shadowRadius,
      },
      android: {
        elevation: CONSTANTS.elevation,
      },
    }),
  },
  tabBarLabelStyle: {
    fontSize: CONSTANTS.tabBarFontSize,
    fontWeight: "600",
    marginTop: 4,
  },
  tabBarIconStyle: {
    marginBottom: -4,
  },
  headerStyle: {
    backgroundColor: colors.surface,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: CONSTANTS.borderWidth,
    borderBottomColor: colors.border,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: CONSTANTS.headerFontSizeLarge,
  },
  // אפשרויות נוספות
  tabBarHideOnKeyboard: true,
  tabBarAllowFontScaling: false,
};

/**
 * הגדרות למסכי Auth
 */
export const authStackOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  headerShown: false,
  gestureEnabled: true,
  animation: Platform.select({
    ios: "slide_from_right",
    android: "slide_from_right",
  }),
  // מניעת חזרה באמצעות gesture ב-iOS
  fullScreenGestureEnabled: false,
};

/**
 * הגדרות למסכי האפליקציה הראשיים
 */
export const appStackOptions: NativeStackNavigationOptions = {
  ...defaultScreenOptions,
  gestureEnabled: true,
  animation: Platform.select({
    ios: "slide_from_right",
    android: "slide_from_right",
  }),
  // הגדרות נוספות לחוויית משתמש
  headerBackVisible: true, // תיקון: השם הנכון של המאפיין
  headerBackTitle: "", // הסתרת טקסט ה-back ב-iOS
  // headerLeftContainerStyle: {
  //   paddingLeft: Platform.OS === "ios" ? 0 : 4,
  // },
};

/**
 * הגדרות למודלים
 */
export const modalOptions: NativeStackNavigationOptions = {
  presentation: "modal",
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: CONSTANTS.headerFontSize,
  },
  // כפתור סגירה למודל
  headerLeft: Platform.OS === "ios" ? undefined : () => null,
  // אנימציה מותאמת למודלים
  animation: Platform.select({
    ios: "slide_from_bottom",
    android: "fade_from_bottom",
  }),
  gestureEnabled: Platform.OS === "ios",
  gestureDirection: "vertical",
};

/**
 * פונקציה ליצירת סגנונות דינמיים עם תמיכה ב-Dark Mode
 * @param theme - ערכת נושא (בעתיד)
 */
export const createNavigationStyles = (
  theme: NavigationTheme = "light"
): NavigationStyles => {
  // TODO: בעתיד - החלפת צבעים לפי theme
  // const themeColors = theme === 'light' ? lightColors : darkColors;

  return {
    defaultScreenOptions,
    tabBarOptions,
    authStackOptions,
    appStackOptions,
    modalOptions,
  };
};

/**
 * Hooks מותאמים אישית לגישה לסגנונות
 */
export const useNavigationStyles = () => {
  // בעתיד: קריאת theme מ-context או store
  const theme: NavigationTheme = "light";
  return createNavigationStyles(theme);
};

// ייצוא ברירת מחדל
export default {
  defaultScreenOptions,
  tabBarOptions,
  authStackOptions,
  appStackOptions,
  modalOptions,
  CONSTANTS,
  createNavigationStyles,
};
