// src/types/tabs.ts - ✅ טיפוסים מלאים ומעודכנים לניווט הטאבים

import { NavigatorScreenParams } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./navigation";

// 📱 רשימת הטאבים הראשיים באפליקציה
export type AppTabsParamList = {
  // 🏠 מסך הבית
  Home: undefined;
  
  // 📋 תוכניות אימון
  Plans: {
    filter?: "active" | "completed" | "favorites";
    scrollToId?: string;
  } | undefined;
  
  // 🏋️ התחלת אימון
  StartWorkout: {
    planId?: string;
    dayId?: string;
    isQuickStart?: boolean;
  } | undefined;
  
  // 📊 היסטוריית אימונים
  Workouts: {
    dateFilter?: "week" | "month" | "year" | "all";
    muscleFilter?: string;
  } | undefined;
  
  // 👤 פרופיל משתמש
  Profile: {
    section?: "stats" | "achievements" | "settings";
  } | undefined;
};

// 🔧 טיפוסי ניווט לכל טאב
export type TabNavigationProp<T extends keyof AppTabsParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<AppTabsParamList, T>,
  NativeStackNavigationProp<RootStackParamList>
>;

// 🎯 טיפוסי Route לכל טאב
export type TabRouteProp<T extends keyof AppTabsParamList> = RouteProp<
  AppTabsParamList,
  T
>;

// 📊 פרופס למסכי טאבים
export type TabScreenProps<T extends keyof AppTabsParamList> = {
  navigation: TabNavigationProp<T>;
  route: TabRouteProp<T>;
};

// 🎨 הגדרות עיצוב לטאבים
export interface TabBarStyle {
  backgroundColor?: string;
  borderTopColor?: string;
  borderTopWidth?: number;
  paddingTop?: number;
  paddingBottom?: number;
  height?: number;
  elevation?: number;
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  borderRadius?: number;
  position?: "absolute" | "relative";
  bottom?: number;
  left?: number;
  right?: number;
}

// 🔔 הגדרות Badge לטאבים
export interface TabBadgeConfig {
  count?: number;
  showDot?: boolean;
  color?: string;
  textColor?: string;
  maxCount?: number; // למשל 99+
}

// 🎯 הגדרות כלליות לטאב
export interface TabConfig {
  name: keyof AppTabsParamList;
  label: string;
  icon: {
    focused: string;
    unfocused: string;
  };
  badge?: TabBadgeConfig;
  visible?: boolean;
  accessibilityLabel?: string;
  testID?: string;
}

// 📱 רשימת הטאבים עם הגדרותיהם
export const TAB_CONFIG: TabConfig[] = [
  {
    name: "Profile",
    label: "פרופיל",
    icon: {
      focused: "person",
      unfocused: "person-outline",
    },
    accessibilityLabel: "פרופיל אישי",
    testID: "tab-profile",
  },
  {
    name: "Workouts",
    label: "אימונים",
    icon: {
      focused: "barbell",
      unfocused: "barbell-outline",
    },
    accessibilityLabel: "היסטוריית אימונים",
    testID: "tab-workouts",
  },
  {
    name: "StartWorkout",
    label: "", // ללא טקסט - רק אייקון
    icon: {
      focused: "add-circle",
      unfocused: "add-circle-outline",
    },
    accessibilityLabel: "התחל אימון חדש",
    testID: "tab-start-workout",
  },
  {
    name: "Plans",
    label: "תוכניות",
    icon: {
      focused: "list",
      unfocused: "list-outline",
    },
    accessibilityLabel: "תוכניות אימון",
    testID: "tab-plans",
  },
  {
    name: "Home",
    label: "בית",
    icon: {
      focused: "home",
      unfocused: "home-outline",
    },
    accessibilityLabel: "מסך הבית",
    testID: "tab-home",
  },
];

// 🎨 הגדרות עיצוב דיפולטיביות
export const DEFAULT_TAB_BAR_STYLE: TabBarStyle = {
  backgroundColor: "#ffffff",
  borderTopColor: "#e5e5e7",
  borderTopWidth: 0,
  paddingTop: 8,
  paddingBottom: 8,
  height: 60,
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
};

// 🎨 הגדרות עיצוב לטאב מרחף
export const FLOATING_TAB_BAR_STYLE: TabBarStyle = {
  ...DEFAULT_TAB_BAR_STYLE,
  position: "absolute",
  bottom: 25,
  left: 20,
  right: 20,
  borderRadius: 15,
  height: 70,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.1,
  shadowRadius: 20,
};

// 🏷️ טיפוסים לניהול מצב הטאבים
export interface TabsState {
  activeTab: keyof AppTabsParamList;
  badges: Partial<Record<keyof AppTabsParamList, TabBadgeConfig>>;
  hiddenTabs: (keyof AppTabsParamList)[];
  tabHistory: (keyof AppTabsParamList)[];
}

// 🎯 פעולות על הטאבים
export interface TabsActions {
  setActiveTab: (tab: keyof AppTabsParamList) => void;
  setBadge: (tab: keyof AppTabsParamList, badge: TabBadgeConfig | null) => void;
  hideTab: (tab: keyof AppTabsParamList) => void;
  showTab: (tab: keyof AppTabsParamList) => void;
  clearHistory: () => void;
}

// 🔧 Type Guards
export const isValidTab = (tab: string): tab is keyof AppTabsParamList => {
  return ["Home", "Plans", "StartWorkout", "Workouts", "Profile"].includes(tab);
};

export const hasTabParams = <T extends keyof AppTabsParamList>(
  route: TabRouteProp<T>
): route.params is NonNullable<AppTabsParamList[T]> => {
  return route.params !== undefined;
};

// 🔧 Helper Functions
export const getTabIcon = (
  tabName: keyof AppTabsParamList,
  focused: boolean
): string => {
  const config = TAB_CONFIG.find(tab => tab.name === tabName);
  return config ? (focused ? config.icon.focused : config.icon.unfocused) : "help-outline";
};

export const getTabLabel = (tabName: keyof AppTabsParamList): string => {
  const config = TAB_CONFIG.find(tab => tab.name === tabName);
  return config?.label || "";
};

export const getTabAccessibilityLabel = (tabName: keyof AppTabsParamList): string => {
  const config = TAB_CONFIG.find(tab => tab.name === tabName);
  return config?.accessibilityLabel || config?.label || "";
};

// 🎨 צבעי טאבים
export const TAB_COLORS = {
  active: "#007AFF",
  inactive: "#8E8E93",
  background: "#FFFFFF",
  border: "#E5E5E7",
  badge: "#FF3B30",
  badgeText: "#FFFFFF",
} as const;

// 📐 מידות טאבים
export const TAB_DIMENSIONS = {
  height: 60,
  iconSize: 24,
  fontSize: 12,
  fabSize: 60,
  fabIconSize: 32,
  badgeSize: 18,
  badgeFontSize: 10,
} as const;

// 🎯 אירועי Analytics לטאבים
export type TabAnalyticsEvent = 
  | { type: "tab_switched"; from: keyof AppTabsParamList; to: keyof AppTabsParamList }
  | { type: "tab_badge_shown"; tab: keyof AppTabsParamList; count: number }
  | { type: "fab_pressed"; source: "tab_bar" };