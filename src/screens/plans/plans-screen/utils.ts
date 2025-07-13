// src/screens/plans/plans-screen/utils.ts
// פונקציות עזר וקבועים למסך תוכניות האימון - גרסה מתוקנת

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types/navigation";
import { designSystem } from "../../../theme/designSystem";
import { Plan } from "../../../types/plan";
import { Animated, Dimensions } from "react-native";

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// מצב הפילטר הנוכחי במסך - עדכון לתמיכה ב-recommended
export type FilterType = "all" | "mine" | "recommended";

// מידע על פילטר בודד
export interface FilterInfo {
  id: FilterType;
  label: string;
  icon: string;
}

// פרמטרים לרכיב תג
export interface TagProps {
  text: string;
  color?: string;
  icon?: string;
}

// פרמטרים לרכיב חיפוש
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

// פרמטרים לרכיב פילטרים - תיקון לתמיכה בממשק הנכון
export interface FilterTabsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    mine: number;
    recommended: number;
  };
}

// פרמטרים לרכיב EmptyState - תיקון לתמיכה בממשק הנכון
export interface EmptyStateProps {
  message: string;
  actionText?: string;
  onAction?: () => void;
}

// קבועים - עדכון לתמיכה ב-recommended
export const filtersList: FilterInfo[] = [
  { id: "all", label: "הכל", icon: "apps" },
  { id: "mine", label: "שלי", icon: "person" },
  { id: "recommended", label: "מומלצות", icon: "star" },
];

// פונקציות עזר

// קבלת גרדיאנט לפי רמת קושי
export const getDifficultyGradient = (difficulty?: string): string[] => {
  switch (difficulty) {
    case "beginner":
      return ["#00C9FF", "#0081FF"];
    case "intermediate":
      return ["#FC466B", "#3F5EFB"];
    case "advanced":
      return ["#FF416C", "#FF4B2B"];
    default:
      return designSystem.gradients.primary.colors;
  }
};

// עיכוב אנימציה לפי אינדקס
export const getAnimationDelay = (index: number): number => {
  return Math.min(index * 100, 800); // הגבלה למקסימום 800ms
};

// יצירת אנימציית לחיצה
export const createPressAnimation = (scaleAnim: Animated.Value) => {
  return Animated.sequence([
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }),
  ]);
};

// יצירת אנימציית כניסה מרכזית
export const createEntranceAnimation = (
  fadeAnim: Animated.Value,
  slideAnim: Animated.Value,
  headerScale: Animated.Value
) => {
  return Animated.parallel([
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }),
    Animated.spring(slideAnim, {
      toValue: 0,
      ...designSystem.animations.easings.spring,
      useNativeDriver: true,
    }),
    Animated.spring(headerScale, {
      toValue: 1,
      delay: 200,
      ...designSystem.animations.easings.bounce,
      useNativeDriver: true,
    }),
  ]);
};

// סינון תוכניות לפי חיפוש
export const filterPlansBySearch = (
  plans: Plan[],
  searchQuery: string
): Plan[] => {
  if (!searchQuery.trim()) {
    return plans;
  }

  const query = searchQuery.toLowerCase();
  return plans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(query) ||
      plan.description?.toLowerCase().includes(query) ||
      plan.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
      plan.targetMuscleGroups?.some((muscle) =>
        muscle.toLowerCase().includes(query)
      )
  );
};

// קבלת ממדי מסך
export const getScreenDimensions = () => {
  return Dimensions.get("window");
};

// קבלת טקסט סטטוס לתוכנית
export const getPlanStatusText = (plan: Plan): string => {
  if (plan.isActive) return "פעיל";
  if (plan.isCompleted) return "הושלם";
  return "לא פעיל";
};

// קבלת צבע סטטוס לתוכנית
export const getPlanStatusColor = (plan: Plan): string => {
  if (plan.isActive) return designSystem.colors.secondary.main;
  if (plan.isCompleted) return designSystem.colors.semantic.success;
  return designSystem.colors.neutral.text.tertiary;
};
